"use client";

import { Avatar, Badge, Card, EmptyState, Input, PageHeader } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { companies, people } from "@/lib/data";
import { roleLabel } from "@/lib/format";
import { Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PeopleView() {
  const { role } = useApp();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const query = q.toLowerCase();
    return people.filter((p) => {
      const matches =
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.skills.some((s) => s.toLowerCase().includes(query));
      if (!matches) return false;
      if (role === "candidate") return p.role === "company" || p.id === "u4" || p.id === "u10";
      return true;
    });
  }, [q, role]);

  return (
    <div>
      <PageHeader
        kicker="Directory"
        title="People"
        subtitle="Participants across companies, funds, clients, and candidates."
      />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, title, or skill"
        className="mb-4 max-w-md"
      />
      {list.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No people found"
          body="Try a different name, title, or skill."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((person) => {
            const company = companies.find((c) => c.id === person.companyId);
            return (
              <Link key={person.id} href={`/people/${person.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start gap-3">
                    <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="lg" />
                    <div className="min-w-0">
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-slate-500">{person.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge>{roleLabel[person.role]}</Badge>
                        {company ? <Badge tone="blue">{company.name}</Badge> : null}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
