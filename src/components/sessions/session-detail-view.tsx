"use client";

import { Avatar, Badge, Button, Card, EmptyState, Kicker, PageHeader, StatusBadge } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { companies, people, reports } from "@/lib/data";
import { formatWhen, typeLabel } from "@/lib/format";
import { ArrowRight, CalendarDays, Video } from "lucide-react";
import Link from "next/link";

export function SessionDetailView({ id }: { id: string }) {
  const { sessions } = useApp();
  const session = sessions.find((s) => s.id === id);
  if (!session) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Session not found"
        body="It may have been archived. Return to the session list to continue."
      />
    );
  }
  const company = companies.find((c) => c.id === session.companyId);
  const report = reports.find((r) => r.sessionId === session.id);

  return (
    <div>
      <PageHeader
        kicker={typeLabel[session.type]}
        title={session.title}
        subtitle={`${formatWhen(session.startsAt)} · ${session.durationMin} min · ${session.location}`}
        actions={
          <>
            <StatusBadge status={session.status} />
            <Link href={`/sessions/${session.id}/room`}>
              <Button>
                <Video size={16} />
                {session.status === "completed" ? "Replay room" : "Enter room"}
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <Kicker>Agenda</Kicker>
            <ol className="mt-4 space-y-2.5">
              {session.agenda.map((item, i) => (
                <li key={item} className="flex gap-3 text-[13.5px] text-slate-700">
                  <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-slate-100 text-[10px] font-medium tabular-nums text-slate-500">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <Kicker>Workspace modules</Kicker>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {session.modules.map((m) => (
                <Badge key={m} tone="slate">
                  {m}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-[13.5px] leading-6 text-slate-600">
              The room includes participant layout, chat, and simulated screen share. Assessment
              modules open in the same session without a third-party meeting SDK.
            </p>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <Kicker>Participants</Kicker>
            <div className="mt-3 space-y-1">
              {session.participants.map((p) => {
                const person = people.find((x) => x.id === p.personId);
                if (!person) return null;
                return (
                  <Link
                    key={p.personId}
                    href={`/people/${person.id}`}
                    className="flex items-center gap-3 rounded-[10px] px-1 py-2 hover:bg-slate-50"
                  >
                    <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{person.name}</span>
                      <span className="block text-[12px] capitalize text-muted">
                        {p.meetingRole} · {person.title}
                      </span>
                    </span>
                    <ArrowRight size={16} className="text-slate-300" />
                  </Link>
                );
              })}
            </div>
          </Card>
          {company ? (
            <Link href={`/companies/${company.id}`}>
              <Card hover>
                <Kicker>Company</Kicker>
                <p className="mt-1.5 font-medium">{company.name}</p>
                <p className="text-[13px] text-muted">{company.industry}</p>
              </Card>
            </Link>
          ) : null}
          {report ? (
            <Link href={`/reports/${report.id}`}>
              <Card hover>
                <Kicker>Report</Kicker>
                <p className="mt-1.5 font-medium">{report.title}</p>
                <p className="mt-1 text-[13px] text-muted">Overall {report.overall.toFixed(1)} / 5</p>
              </Card>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
