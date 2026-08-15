"use client";

import { Badge, Button, ScoreBar, Textarea } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { defaultScorecard, questionsByType } from "@/lib/data";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";

type Tab = "questions" | "scorecard" | "notes";

export function EvaluationPanel({ session }: { session: Session }) {
  const { notes, setNote, role } = useApp();
  const [tab, setTab] = useState<Tab>("questions");
  const seed = questionsByType[session.type];
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(seed.map((q) => [q.id, q.answer ?? ""])),
  );
  const [scores, setScores] = useState(defaultScorecard);
  const [rec, setRec] = useState("lean_yes");
  const isEvaluator = role !== "candidate";

  const overall = useMemo(
    () => scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
    [scores],
  );

  return (
    <div className="flex h-full min-h-0 flex-col text-slate-200">
      <div className="flex gap-1 border-b border-white/10 p-2">
        {(
          [
            ["questions", "Questions"],
            ["scorecard", "Scorecard"],
            ["notes", "Private notes"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
              tab === id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {!isEvaluator ? (
          <p className="rounded-xl bg-white/5 p-3 text-sm text-slate-400">
            Evaluation tools are hidden from the candidate view. Switch role to Company, Client, or
            Investor to score this session.
          </p>
        ) : null}

        {isEvaluator && tab === "questions" ? (
          <div className="space-y-5">
            {seed.map((q) => (
              <div key={q.id}>
                <p className="mb-2 text-sm font-medium text-white">{q.prompt}</p>
                {q.kind === "scale" ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: n }))}
                        className={cn(
                          "size-8 rounded-lg text-xs",
                          answers[q.id] === n ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:bg-white/15",
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
                          "rounded-full px-3 py-1 text-xs",
                          answers[q.id] === opt ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:bg-white/15",
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Overall</p>
              <Badge tone="teal">{overall.toFixed(1)} / 5</Badge>
            </div>
            <ScoreBar value={overall} />
            {scores.map((dim) => (
              <div key={dim.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{dim.label}</span>
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
            <p className="text-sm font-medium">Recommendation</p>
            <div className="flex flex-wrap gap-2">
              {["strong_yes", "yes", "lean_yes", "no", "hold"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRec(r)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs capitalize",
                    rec === r ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:bg-white/15",
                  )}
                >
                  {r.replace("_", " ")}
                </button>
              ))}
            </div>
            <Button className="w-full">Save scorecard (local)</Button>
          </div>
        ) : null}

        {isEvaluator && tab === "notes" ? (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-amber-300">
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
