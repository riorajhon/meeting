"use client";

import { Avatar, Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { companies, people } from "@/lib/data";
import { roleLabel } from "@/lib/format";
import { UserRound } from "lucide-react";
import Link from "next/link";

export function PersonProfile({ id }: { id: string }) {
  const { sessions } = useApp();
  const person = people.find((p) => p.id === id);
  if (!person) {
    return (
      <EmptyState
        icon={UserRound}
        title="Person not found"
        body="This profile is not in the current directory."
      />
    );
  }
  const company = companies.find((c) => c.id === person.companyId);
  const related = sessions.filter(
    (s) => s.hostId === person.id || s.participants.some((p) => p.personId === person.id),
  );

  return (
    <div>
      <PageHeader
        kicker={roleLabel[person.role]}
        title={person.name}
        subtitle={`${person.title} · ${person.location}`}
        actions={<Badge tone="teal">{roleLabel[person.role]}</Badge>}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="2xl" />
            <div>
              <p className="text-sm leading-6 text-slate-600">{person.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {person.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                {person.email} · {person.timezone}
              </p>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          {company ? (
            <Link href={`/companies/${company.id}`}>
              <Card hover>
                <p className="text-xs uppercase tracking-wide text-slate-500">Company</p>
                <p className="mt-1 font-medium">{company.name}</p>
                <p className="text-sm text-slate-500">{company.industry}</p>
              </Card>
            </Link>
          ) : null}
          <Card>
            <h3 className="mb-3 text-sm font-semibold">Sessions</h3>
            <div className="space-y-2">
              {related.map((s) => (
                <Link
                  key={s.id}
                  href={`/sessions/${s.id}`}
                  className="block rounded-xl px-2 py-2 text-sm hover:bg-slate-50"
                >
                  {s.title}
                </Link>
              ))}
            </div>
            <Link href={`/sessions/${related[0]?.id ?? ""}/room`}>
              <Button variant="secondary" className="mt-3 w-full" disabled={!related[0]}>
                Open related room
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
