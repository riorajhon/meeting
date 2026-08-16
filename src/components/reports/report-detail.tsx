"use client";

import { Glyph } from "@/components/icons";
import { Badge, Button, EmptyState, Kicker, ScoreBar } from "@/components/ui";
import { people, reports, sessions } from "@/lib/data";
import { formatDate, recLabel, recTone } from "@/lib/format";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

const riskTone = {
  high: "rose" as const,
  medium: "amber" as const,
  low: "slate" as const,
};

export function ReportDetail({ id }: { id: string }) {
  const report = reports.find((r) => r.id === id);
  if (!report) {
    return (
      <EmptyState
        icon={FileText}
        title="Report not found"
        body="This result may have been unpublished."
      />
    );
  }
  const session = sessions.find((s) => s.id === report.sessionId);
  const evaluators = report.evaluatorIds.flatMap((eid) => {
    const person = people.find((p) => p.id === eid);
    return person ? [person] : [];
  });

  return (
    <div className="mx-auto max-w-[920px]">
      <Link
        href="/reports"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-slate-800"
      >
        <Glyph icon={ArrowLeft} size="sm" /> All briefs
      </Link>

      <article className="brief-paper overflow-hidden rounded-[18px] border border-[#e6dfd2]">
        <header className="border-b border-[#e6dfd2] px-6 py-7 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Kicker className="text-[#8a8172]">Confidential decision brief</Kicker>
            <Badge className="bg-[#efe8db] text-[#6f675c]">{report.visibility} distribution</Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-[28px] font-semibold tracking-[-0.04em] text-ink sm:text-[32px]">
            {report.title}
          </h1>
          <p className="mt-2 text-[13.5px] text-muted">
            {report.subject} · Published {formatDate(report.publishedAt)}
          </p>
          <p className="mt-1 text-[12px] text-slate-500">{report.distribution}</p>
        </header>

        <section className="grid gap-0 border-b border-[#e6dfd2] md:grid-cols-[1.15fr_0.85fr]">
          <div className="border-[#e6dfd2] px-6 py-7 sm:px-10 md:border-r">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
              Verdict
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <Badge tone={recTone[report.recommendation]} dot className="h-8 px-3 text-[13px]">
                {recLabel[report.recommendation]}
              </Badge>
              <div>
                <p className="text-[40px] leading-none font-semibold tracking-[-0.06em] text-ink">
                  {report.overall.toFixed(1)}
                </p>
                <p className="mt-1 text-[12px] text-muted">overall · 5.0 scale</p>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-7 text-slate-700">{report.summary}</p>
            {evaluators.length > 0 ? (
              <p className="mt-5 text-[12px] text-slate-500">
                Evaluated by {evaluators.map((p) => p.name).join(", ")}
              </p>
            ) : null}
          </div>
          <div className="bg-[#f3eee5]/70 px-6 py-7 sm:px-8">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
              Scores
            </p>
            <div className="mt-4 space-y-4">
              {report.dimensions.map((d) => (
                <div key={d.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="font-medium text-slate-800">{d.label}</span>
                    <span className="tabular-nums text-muted">
                      {d.score.toFixed(1)}
                    </span>
                  </div>
                  <ScoreBar value={d.score} max={d.max} tone="ink" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e6dfd2] px-6 py-8 sm:px-10">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
            Findings
          </h2>
          <ol className="mt-4 space-y-4">
            {report.findings.map((finding, i) => (
              <li key={finding} className="flex gap-4 text-[14.5px] leading-7 text-slate-700">
                <span className="w-6 shrink-0 tabular-nums text-[#a39a8c]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{finding}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-b border-[#e6dfd2] px-6 py-8 sm:px-10">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
            Evaluation notes
          </h2>
          <div className="mt-4 space-y-5">
            {report.dimensions.map((d, i) => (
              <div key={d.id} className="grid gap-1 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
                <p className="text-[13px] font-medium text-ink">
                  <span className="mr-2 tabular-nums text-[#a39a8c]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {d.label}
                </p>
                <p className="text-[13.5px] leading-6 text-slate-600">
                  {d.notes ?? "No additional note on this dimension."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-[#e6dfd2] px-6 py-8 sm:px-10">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
            Risks
          </h2>
          <div className="mt-4 space-y-3">
            {report.risks.map((risk) => (
              <div
                key={risk.id}
                className="flex flex-col gap-2 rounded-[12px] border border-[#e6dfd2] bg-white/40 px-4 py-3 sm:flex-row sm:items-start"
              >
                <Badge tone={riskTone[risk.level]} className="capitalize">
                  {risk.level}
                </Badge>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink">{risk.label}</p>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600">{risk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[#8a8172] uppercase">
            Recommendation & next steps
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700">{report.summary}</p>
          <ul className="mt-5 space-y-2.5">
            {report.nextSteps.map((step) => (
              <li key={step} className="flex gap-3 text-[14px] leading-6 text-slate-700">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {step}
              </li>
            ))}
          </ul>
          {session ? (
            <Link href={`/sessions/${session.id}`} className="mt-8 inline-block">
              <Button variant="secondary" size="sm">
                Open source session
                <Glyph icon={ArrowUpRight} size="sm" />
              </Button>
            </Link>
          ) : null}
        </section>
      </article>
    </div>
  );
}
