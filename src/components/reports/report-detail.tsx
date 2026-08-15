"use client";

import { Badge, Button, Card, EmptyState, Kicker, PageHeader, ScoreBar } from "@/components/ui";
import { reports, sessions } from "@/lib/data";
import { formatWhen } from "@/lib/format";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

const recLabel: Record<string, string> = {
  strong_yes: "Strong yes",
  yes: "Yes",
  lean_yes: "Lean yes",
  no: "No",
  hold: "Hold",
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

  return (
    <div>
      <Link
        href="/reports"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-slate-800"
      >
        <ArrowLeft size={14} /> All reports
      </Link>
      <PageHeader
        kicker="Confidential brief"
        title={report.title}
        subtitle={`Published ${formatWhen(report.publishedAt)} · ${report.visibility} distribution`}
        actions={
          <Badge tone="teal" dot>
            {recLabel[report.recommendation] ?? report.recommendation}
          </Badge>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="bg-[#fcfbf9] lg:min-h-[420px]">
          <Kicker>Executive summary</Kicker>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">{report.summary}</p>
          <h3 className="mt-8 text-[13px] font-semibold tracking-tight">Scored dimensions</h3>
          <div className="mt-4 space-y-5">
            {report.dimensions.map((d, i) => (
              <div key={d.id}>
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span className="font-medium text-slate-800">
                    <span className="mr-2 tabular-nums text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {d.label}
                  </span>
                  <span className="tabular-nums text-muted">
                    {d.score} / {d.max}
                  </span>
                </div>
                <ScoreBar value={d.score} max={d.max} />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="text-center">
            <Kicker>Overall rating</Kicker>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{report.overall.toFixed(1)}</p>
            <p className="mt-1 text-[13px] text-muted">out of 5.0</p>
            <div className="mt-5 h-24">
              <Sparkline values={report.dimensions.map((d) => d.score)} />
            </div>
          </Card>
          {session ? (
            <Link href={`/sessions/${session.id}`}>
              <Card hover>
                <Kicker>Source session</Kicker>
                <p className="mt-1.5 text-[14px] font-medium">{session.title}</p>
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Open session
                </Button>
              </Card>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = 5;
  const w = 260;
  const h = 96;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - (v / max) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full text-accent">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
      {values.map((v, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * w;
        const y = h - (v / max) * (h - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />;
      })}
    </svg>
  );
}
