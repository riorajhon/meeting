"use client";

import { Avatar, Badge, Button, Card, EmptyState, PageHeader, Select, StatusBadge } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { people } from "@/lib/data";
import { formatWhen, typeLabel } from "@/lib/format";
import type { SessionStatus, SessionType } from "@/lib/types";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const types: Array<SessionType | "all"> = [
  "all",
  "investor",
  "client_review",
  "interview",
  "freelancer",
  "assessment",
];

const statuses: Array<SessionStatus | "all"> = [
  "all",
  "live",
  "scheduled",
  "draft",
  "completed",
];

export function SessionsView() {
  const { sessions, me, role } = useApp();
  const [type, setType] = useState<(typeof types)[number]>("all");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");

  const list = useMemo(() => {
    return sessions.filter((s) => {
      const roleOk =
        role === "company" ||
        s.participants.some((p) => p.personId === me.id) ||
        s.hostId === me.id ||
        (role === "investor" && s.type === "investor") ||
        (role === "client" && s.type === "client_review");
      return (
        roleOk &&
        (type === "all" || s.type === type) &&
        (status === "all" || s.status === status)
      );
    });
  }, [sessions, type, status, role, me.id]);

  return (
    <div>
      <PageHeader
        kicker="Scheduling"
        title="Sessions"
        subtitle="Create and manage investor meetings, client reviews, interviews, and assessments."
        actions={
          <Link href="/sessions/new">
            <Button>
              <Plus size={16} /> New session
            </Button>
          </Link>
        }
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="sm:w-52">
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : typeLabel[t]}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="sm:w-44"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </div>
      {list.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No sessions match these filters"
          body="Try another type or create a session to start a professional workflow."
        />
      ) : (
        <Card padded={false}>
          {list.map((session, i) => {
            const host = people.find((p) => p.id === session.hostId);
            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className={`flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50/80 lg:flex-row lg:items-center ${
                  i < list.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <StatusBadge status={session.status} />
                    <Badge tone="slate">{typeLabel[session.type]}</Badge>
                  </div>
                  <p className="text-[14px] font-medium text-slate-900">{session.title}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {formatWhen(session.startsAt)} · {session.durationMin} min · {session.modules.length}{" "}
                    modules
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {session.participants.slice(0, 4).map((p) => {
                    const person = people.find((x) => x.id === p.personId);
                    if (!person) return null;
                    return (
                      <Avatar
                        key={p.personId}
                        name={person.name}
                        hue={person.avatarHue}
                        src={person.avatar}
                        size="sm"
                      />
                    );
                  })}
                  {host ? (
                    <span className="ml-3 hidden text-[12px] text-muted sm:block">
                      Host {host.name.split(" ")[0]}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}
