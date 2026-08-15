"use client";

import { Badge, Card, Kicker, PageHeader, ScoreBar } from "@/components/ui";
import { reports, sessions } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

const recTone = {
  strong_yes: "emerald" as const,
  yes: "teal" as const,
  lean_yes: "blue" as const,
  no: "rose" as const,
  hold: "amber" as const,
};

const recLabel = {
  strong_yes: "Strong yes",
  yes: "Yes",
  lean_yes: "Lean yes",
  no: "No",
  hold: "Hold",
};

export function ReportsView() {
  return (
    <div>
      <PageHeader
        kicker="Outcomes"
        title="Reports"
        subtitle="Formal scorecards, ratings, and published results from completed sessions."
      />
      <div className="space-y-3">
        {reports.map((report) => {
          const session = sessions.find((s) => s.id === report.sessionId);
          return (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid size-10 place-items-center rounded-[10px] bg-[#f3f0ea] text-slate-700">
                  <FileText size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap gap-2">
                    <Badge tone={recTone[report.recommendation]} dot>
                      {recLabel[report.recommendation]}
                    </Badge>
                    <Badge>{report.visibility}</Badge>
                  </div>
                  <p className="text-[15px] font-semibold tracking-tight">{report.title}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {session?.title} · {formatDate(report.publishedAt)}
                  </p>
                </div>
                <div className="w-full sm:w-44">
                  <Kicker className="mb-1">Overall</Kicker>
                  <ScoreBar value={report.overall} />
                </div>
                <ArrowUpRight size={16} className="hidden text-slate-300 sm:block" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
