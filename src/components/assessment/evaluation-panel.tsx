"use client";

import { Glyph } from "@/components/icons";
import { Badge, Button, ScoreBar, Textarea } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/cn";
import { defaultScorecard, questionsByType } from "@/lib/data";
import { recLabel } from "@/lib/format";
import type { Session } from "@/lib/types";
import { ClipboardList, ListChecks, StickyNote } from "lucide-react";
import { useMemo, useState } from "react";

type Tab = "questions" | "scorecard" | "notes";

const tabs: Array<[Tab, string, typeof ListChecks]> = [
  ["questions", "Questions", ListChecks],
  ["scorecard", "Scorecard", ClipboardList],
  ["notes", "Notes", StickyNote],
];

export function EvaluationPanel({ session }: { session: Session }) {
  const { notes, setNote, role } = useApp();
  const [tab, setTab] = useState<Tab>("scorecard");
  const seed = questionsByType[session.type];
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(seed.map((q) => [q.id, q.answer ?? ""])),
  );
  const [scores, setScores] = useState(defaultScorecard);
  const [rec, setRec] = useState<"strong_yes" | "yes" | "lean_yes" | "no" | "hold">("lean_yes");
  const isEvaluator = role !== "candidate";

  const overall = useMemo(
    () => scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
    [scores],
  );

  return (
    <div className="flex h-full min-h-0 flex-col text-slate-200">
      <div className="flex gap-1 border-b border-white/[0.06] px-2 py-2">
        {tabs.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "ui-press flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[9px] text-[11px] font-medium",
              tab === id
                ? "bg-white/[0.09] text-white"
                : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200",
            )}
          >
            <span
              className={cn(
                "grid size-5 place-items-center rounded-md",
                tab === id ? "bg-accent text-white" : "text-slate-500",
              )}
            >
              <Glyph icon={Icon} size="xs" />
            </span>
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {!isEvaluator ? (
          <p className="rounded-[12px] border border-white/[0.06] bg-white/[0.04] p-3 text-[13px] leading-6 text-slate-400">
            Evaluation tools are hidden from the candidate view. Switch role to Company, Client, or
            Investor to score this session.
          </p>
        ) : null}

        {isEvaluator && tab === "questions" ? (
          <div className="space-y-5">
            {seed.map((q) => (
              <div key={q.id}>
                <p className="mb-2 text-[13px] font-medium text-white">{q.prompt}</p>
                {q.kind === "scale" ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: n }))}
                        className={cn(
                          "ui-press size-8 rounded-[9px] text-xs",
                          answers[q.id] === n
                            ? "bg-accent text-white"
                            : "bg-white/10 text-slate-300 hover:bg-white/15",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                ) : null}
                {q.kind === "choice" ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={cn(
                          "ui-press rounded-full px-3 py-1 text-xs",
                          answers[q.id] === opt
                            ? "bg-accent text-white"
                            : "bg-white/10 text-slate-300 hover:bg-white/15",
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : null}
                {q.kind === "text" ? (
                  <Textarea
                    rows={3}
                    className="border-white/10 bg-white/5 text-slate-100"
                    value={String(answers[q.id] ?? "")}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {isEvaluator && tab === "scorecard" ? (
          <div className="space-y-4">
            <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Overall
                </p>
                <Badge tone="teal">{overall.toFixed(1)} / 5</Badge>
              </div>
              <div className="mt-3">
                <ScoreBar value={overall} invert />
              </div>
            </div>
            {scores.map((dim) => (
              <div key={dim.id}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-slate-200">{dim.label}</span>
                  <span className="tabular-nums text-slate-400">{dim.score}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={dim.score}
                  onChange={(e) =>
                    setScores((prev) =>
                      prev.map((s) =>
                        s.id === dim.id ? { ...s, score: Number(e.target.value) } : s,
                      ),
                    )
                  }
                  className="w-full accent-accent"
                />
              </div>
            ))}
            <p className="pt-1 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
              Recommendation
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(["strong_yes", "yes", "lean_yes", "no", "hold"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRec(r)}
                  className={cn(
                    "ui-press rounded-full px-3 py-1 text-[11px]",
                    rec === r ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:bg-white/15",
                  )}
                >
                  {recLabel[r]}
                </button>
              ))}
            </div>
            <Button className="w-full">Save scorecard (local)</Button>
          </div>
        ) : null}

        {isEvaluator && tab === "notes" ? (
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-amber-300/90 uppercase">
              Visible only to evaluators
            </p>
            <Textarea
              rows={14}
              className="border-white/10 bg-white/5 text-slate-100"
              value={notes[session.id] ?? ""}
              onChange={(e) => setNote(session.id, e.target.value)}
              placeholder="Capture signal, concerns, and follow-ups…"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
