"use client";

import { Badge, Card, PageHeader } from "@/components/ui";
import { companies, people } from "@/lib/data";
import Link from "next/link";

export function CompaniesView() {
  return (
    <div>
      <PageHeader
        kicker="Organizations"
        title="Companies"
        subtitle="Startups, funds, enterprise clients, and agencies participating in Caliber sessions."
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {companies.map((company) => {
          const members = people.filter((p) => p.companyId === company.id);
          return (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card hover className="h-full">
                <div className="mb-2 flex items-center gap-2">
                  <p className="font-semibold">{company.name}</p>
                  <Badge tone={company.kind === "investor" ? "violet" : "teal"}>
                    {company.kind}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">
                  {company.industry}
                  {company.stage ? ` · ${company.stage}` : ""} · {company.location}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{company.summary}</p>
                <p className="mt-3 text-xs text-slate-500">{members.length} people</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
