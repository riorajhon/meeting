"use client";

import {
  Avatar,
  Badge,
  Button,
  Card,
  IconTile,
  PageHeader,
  ScoreBar,
  SectionHeader,
  StatusBadge,
} from "@/components/ui";
import { Glyph } from "@/components/icons";
import { useApp } from "@/context/app-context";
import { companies, people, reports } from "@/lib/data";
import { formatWhen, roleLabel, typeLabel } from "@/lib/format";
import type { Session, UserRole } from "@/lib/types";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  ClipboardList,
  LineChart,
  Radio,
  Timer,
  UserRound,
} from "lucide-react";
import Link from "next/link";

function visibleSessions(sessions: Session[], role: UserRole, userId: string) {
  if (role === "company") return sessions;
  if (role === "investor") {
    return sessions.filter(
      (s) =>
        s.type === "investor" ||
        s.participants.some((p) => p.personId === userId),
    );
  }
  if (role === "client") {
    return sessions.filter(
      (s) =>
        s.type === "client_review" ||
        s.participants.some((p) => p.personId === userId),
    );
  }
  return sessions.filter((s) => s.participants.some((p) => p.personId === userId));
}

export function DashboardView() {
  const { me, role, sessions } = useApp();
  const mine = visibleSessions(sessions, role, me.id);
  const live = mine.filter((s) => s.status === "live");
  const upcoming = mine.filter((s) => s.status === "scheduled").slice(0, 4);
  const copy = copyFor(role, me.name);

  return (
    <div>
      <PageHeader
        kicker={`${roleLabel[role]} workspace`}
        title={copy.hello}
        subtitle={copy.sub}
        actions={<Badge tone="teal" dot>{roleLabel[role]}</Badge>}
      />

      <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {copy.stats.map((stat) => (
          <Card key={stat.label} className="flex items-start justify-between">
            <div>
              <p className="text-[12px] text-muted">{stat.label}</p>
              <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em] tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-[12px] text-slate-400">{stat.hint}</p>
            </div>
            <IconTile icon={stat.icon} />
          </Card>
        ))}
      </div>

      {live.length > 0 ? (
        <div className="mb-7 flex flex-col gap-4 overflow-hidden rounded-[14px] border border-line bg-ink text-white sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <div className="flex items-center gap-3.5 px-5 pt-4 sm:p-0">
            <span className="relative grid size-10 place-items-center rounded-full bg-rose-600">
              <Glyph icon={Radio} size="md" />
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/25" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-rose-300">
                In session
              </p>
              <p className="text-[15px] font-semibold tracking-tight">{live[0].title}</p>
              <p className="text-[13px] text-slate-400">{typeLabel[live[0].type]}</p>
            </div>
          </div>
          <div className="px-5 pb-4 sm:p-0">
            <Link href={`/sessions/${live[0].id}/room`}>
              <Button variant="light" className="rounded-full px-4">
                Join room
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-7 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionHeader
            title="Upcoming sessions"
            action={
              <Link href="/sessions" className="text-[13px] font-medium text-accent hover:text-[#0b6b63]">
                View all
              </Link>
            }
          />
          <Card padded={false}>
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">No upcoming sessions.</p>
            ) : (
              upcoming.map((session, i) => {
                const host = people.find((p) => p.id === session.hostId);
                return (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className={cnRow(i < upcoming.length - 1)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="truncate text-[14px] font-medium text-slate-900">
                          {session.title}
                        </p>
                        <StatusBadge status={session.status} />
                      </div>
                      <p className="text-[13px] text-muted">
                        {typeLabel[session.type]} · {formatWhen(session.startsAt)} · {session.durationMin}m
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {host ? (
                        <Avatar name={host.name} hue={host.avatarHue} src={host.avatar} size="sm" />
                      ) : null}
                      <Glyph icon={ArrowRight} size="md" className="text-slate-300" />
                    </div>
                  </Link>
                );
              })
            )}
          </Card>

          {role === "investor" ? <div className="mt-7"><Pipeline /></div> : null}
          {role === "candidate" ? <div className="mt-7"><CandidatePrep /></div> : null}
        </div>

        <div>
          <SectionHeader title={copy.sideTitle} />
          <Card>
            <p className="text-[13.5px] leading-6 text-slate-600">{copy.sideBody}</p>
            <Link href={copy.sideHref}>
              <Button variant="secondary" className="mt-4 w-full">
                {copy.sideCta}
              </Button>
            </Link>
          </Card>
          <div className="mt-4 space-y-3">
            {reports.slice(0, 2).map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card hover>
                  <p className="kicker">Latest brief</p>
                  <p className="mt-1.5 text-[14px] font-medium text-slate-900">{report.title}</p>
                  <div className="mt-3">
                    <ScoreBar value={report.overall} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cnRow(divided: boolean) {
  return [
    "flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center",
    divided ? "border-b border-line" : "",
  ].join(" ");
}

function Pipeline() {
  return (
    <>
      <SectionHeader title="Deal pipeline" />
      <Card>
        <div className="space-y-5">
          {[
            { name: "Meridian Labs", stage: "Series A diligence", score: 4.2 },
            { name: "Lumen Pay", stage: "Intro booked", score: 3.6 },
          ].map((row) => {
            const company = companies.find((c) => c.name === row.name);
            return (
              <Link
                key={row.name}
                href={company ? `/companies/${company.id}` : "/companies"}
                className="block"
              >
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-muted">{row.stage}</span>
                </div>
                <ScoreBar value={row.score} />
              </Link>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function CandidatePrep() {
  return (
    <>
      <SectionHeader title="Your interview prep" />
      <Card>
        <ul className="space-y-3 text-[13.5px] leading-6 text-slate-600">
          <li>Bring two recent production incidents you owned end-to-end.</li>
          <li>Coding environment: TypeScript, 35 minutes, tests in the workspace.</li>
          <li>System design: design a job-assessment workflow with audit trails.</li>
        </ul>
      </Card>
    </>
  );
}

function copyFor(role: UserRole, name: string) {
  const first = name.split(" ")[0];
  if (role === "investor") {
    return {
      hello: `Good afternoon, ${first}`,
      sub: "Diligence calendar, portfolio companies, and live founder sessions.",
      stats: [
        { label: "Meetings this week", value: "4", hint: "2 founder, 2 internal", icon: CalendarDays },
        { label: "Active deals", value: "9", hint: "3 in technical review", icon: Briefcase },
        { label: "Portfolio in room", value: "2", hint: "Meridian, Lumen", icon: UserRound },
        { label: "Pending memos", value: "3", hint: "Due Monday", icon: ClipboardList },
      ],
      sideTitle: "For this meeting",
      sideBody:
        "Northbridge is meeting Meridian Labs this afternoon. Suggested focus: retention cohorts, infra moat, and use of funds.",
      sideCta: "Open session briefing",
      sideHref: "/sessions/s1",
    };
  }
  if (role === "client") {
    return {
      hello: `Welcome back, ${first}`,
      sub: "Vendor reviews, technical assessments, and architecture sessions with partners.",
      stats: [
        { label: "Open reviews", value: "2", hint: "1 scheduled this week", icon: CalendarDays },
        { label: "Vendors", value: "6", hint: "3 strategic", icon: Briefcase },
        { label: "Risk items", value: "4", hint: "1 high", icon: ClipboardList },
        { label: "SLA health", value: "99.2%", hint: "Last 30 days", icon: LineChart },
      ],
      sideTitle: "Next review",
      sideBody:
        "Helix Health architecture & risk review is scheduled for Tuesday. Data residency and Q3 expansion are on the agenda.",
      sideCta: "Review agenda",
      sideHref: "/sessions/s3",
    };
  }
  if (role === "candidate") {
    return {
      hello: `Hi ${first}`,
      sub: "Your interviews, assessments, and results — in one place.",
      stats: [
        { label: "Upcoming", value: "1", hint: "Live now if you join", icon: CalendarDays },
        { label: "Completed", value: "1", hint: "Scorecard pending", icon: ClipboardList },
        { label: "Prep time", value: "35m", hint: "Coding + design", icon: Timer },
        { label: "Interviewers", value: "2", hint: "Marcus, Hannah", icon: UserRound },
      ],
      sideTitle: "Join when ready",
      sideBody:
        "Your Staff Engineer loop is live. Enter the room, use the coding workspace, and share a system-design board.",
      sideCta: "Enter meeting room",
      sideHref: "/sessions/s2/room",
    };
  }
  return {
    hello: `Welcome, ${first}`,
    sub: "Run professional meetings, technical assessments, and hiring loops from one workspace.",
    stats: [
      { label: "Sessions today", value: "3", hint: "1 live, 1 upcoming", icon: CalendarDays },
      { label: "Open roles", value: "5", hint: "2 staff loops active", icon: UserRound },
      { label: "Reports ready", value: "2", hint: "Share with the committee", icon: ClipboardList },
      { label: "Avg score", value: "4.1", hint: "Last 30 days", icon: LineChart },
    ],
    sideTitle: "Hiring pulse",
    sideBody:
      "Staff Engineer loop is live with Sam Okonkwo. Schedule a 30-minute debrief once scorecards are in.",
    sideCta: "Open live session",
    sideHref: "/sessions/s2",
  };
}
