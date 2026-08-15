"use client";

import { Avatar, Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { companies, people } from "@/lib/data";
import { Building2 } from "lucide-react";
import Link from "next/link";

export function CompanyProfile({ id }: { id: string }) {
  const { sessions } = useApp();
  const company = companies.find((c) => c.id === id);
  if (!company) {
    return (
      <EmptyState
        icon={Building2}
        title="Company not found"
        body="This organization is not in the current directory."
      />
    );
  }
  const members = people.filter((p) => p.companyId === company.id);
  const related = sessions.filter((s) => s.companyId === company.id);

  return (
    <div>
      <PageHeader
        kicker={company.kind}
        title={company.name}
        subtitle={`${company.industry} · ${company.employees} people · ${company.website}`}
        actions={<Badge tone="teal">{company.kind}</Badge>}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-sm leading-6 text-slate-600">{company.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {company.focus.map((f) => (
              <Badge key={f}>{f}</Badge>
            ))}
          </div>
          <h3 className="mt-8 text-sm font-semibold">Sessions</h3>
          <div className="mt-3 space-y-2">
            {related.map((s) => (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                className="block rounded-[10px] border border-line px-3 py-2 text-[13px] hover:border-slate-300 hover:bg-slate-50"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-semibold">Team</h3>
          <div className="space-y-3">
            {members.map((p) => (
              <Link key={p.id} href={`/people/${p.id}`} className="flex items-center gap-3">
                <Avatar name={p.name} hue={p.avatarHue} src={p.avatar} />
                <span>
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="block text-xs text-slate-500">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
