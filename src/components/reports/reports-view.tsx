"use client";

import { Glyph, IconWell } from "@/components/icons";
import { Badge, Kicker, PageHeader } from "@/components/ui";
import { people, reports, sessions } from "@/lib/data";
import { formatDate, recLabel, recTone } from "@/lib/format";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

export function ReportsView() {
  return (
    <div>
      <PageHeader
        kicker="Decision briefs"
        title="Reports"
        subtitle="Published scorecards formatted as decision documents — scores, findings, risks, and a recommendation."
      />
      <div className="space-y-3">
        {reports.map((report, index) => {
          const session = sessions.find((s) => s.id === report.sessionId);
          const evaluators = report.evaluatorIds
            .map((id) => people.find((p) => p.id === id)?.name.split(" ")[0])
            .filter(Boolean)
            .join(" · ");
          return (
            <Link key={report.id} href={`/reports/${report.id}`} className="block">
              <article className="brief-paper ui-press group flex flex-col gap-5 rounded-[16px] border border-[#e6dfd2] p-5 hover:border-[#d7cebd] sm:flex-row sm:items-stretch">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Kicker className="text-[#8a8172]">
                      Brief {String(index + 1).padStart(2, "0")}
                    </Kicker>
                    <span className="text-slate-300">·</span>
                    <Badge tone={recTone[report.recommendation]} dot>
                      {recLabel[report.recommendation]}
                    </Badge>
                    <Badge className="bg-[#efe8db] text-[#6f675c]">{report.visibility}</Badge>
                  </div>
                  <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-ink">
                    {report.title}
                  </h2>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {report.subject} · {formatDate(report.publishedAt)}
                  </p>
                  <p className="mt-3 max-w-2xl text-[13.5px] leading-6 text-slate-600">
                    {report.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
                    <span>{report.findings.length} findings</span>
                    <span>{report.risks.length} risks</span>
                    <span>{report.nextSteps.length} next steps</span>
                    {evaluators ? <span>Evaluators {evaluators}</span> : null}
                    {session ? <span>{session.title}</span> : null}
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col justify-between border-t border-[#e6dfd2] pt-4 sm:w-40 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-[#8a8172] uppercase">
                      Overall
                    </p>
                    <p className="mt-1 text-[32px] font-semibold tracking-[-0.05em] text-ink">
                      {report.overall.toFixed(1)}
                    </p>
                    <p className="text-[12px] text-muted">out of 5.0</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-slate-700 group-hover:gap-1.5">
                    Open brief
                    <Glyph icon={ArrowUpRight} size="sm" className="text-slate-400" />
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
      {reports.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-white px-6 py-16 text-center">
          <IconWell icon={FileText} className="mx-auto bg-slate-50" />
          <p className="mt-3 text-sm font-medium">No published briefs yet</p>
        </div>
      ) : null}
    </div>
  );
}
