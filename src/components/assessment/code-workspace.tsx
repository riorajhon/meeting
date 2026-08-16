"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useState } from "react";

const starter = `type Interval = [number, number];

export function mergeIntervals(items: Interval[]): Interval[] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a[0] - b[0]);
  const out: Interval[] = [sorted[0]];

  for (const [start, end] of sorted.slice(1)) {
    const last = out[out.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}
`;

const tests = [
  { name: "empty input", pass: true },
  { name: "overlapping ranges [[1,3],[2,6]] → [1,6]", pass: true },
  { name: "adjacent ranges are merged", pass: true },
  { name: "disjoint ranges preserved", pass: false },
];

export function CodeWorkspace() {
  const [code, setCode] = useState(starter);
  const [lang, setLang] = useState("TypeScript");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<typeof tests | null>(null);

  const lines = code.split("\n").length;

  function run() {
    setRunning(true);
    setResults(null);
    window.setTimeout(() => {
      setResults(tests);
      setRunning(false);
    }, 1100);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5 lg:flex-row">
      <aside className="w-full shrink-0 overflow-auto rounded-[14px] border border-white/[0.07] bg-[#121820] p-4 text-slate-200 lg:w-80">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Coding assessment</p>
        <h3 className="mt-1 font-semibold text-white">Merge calendar intervals</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Given meeting ranges <code className="text-teal-300">[start, end]</code>, return a
          minimal set of non-overlapping intervals. Mutating input is allowed. This runner is
          simulated — no remote execution in this phase.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
          <li>Time: 35 minutes</li>
          <li>Language: {lang}</li>
          <li>Hidden tests: 4</li>
        </ul>
        {results ? (
          <div className="mt-4 space-y-2">
            {results.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs",
                  t.pass ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300",
                )}
              >
                {t.pass ? "Passed" : "Failed"} · {t.name}
              </div>
            ))}
          </div>
        ) : null}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#0d1520]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-200"
          >
            {["TypeScript", "JavaScript", "Python", "Go"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <Button size="sm" onClick={run} disabled={running}>
            {running ? "Running tests…" : "Run tests"}
          </Button>
        </div>
        <div className="flex min-h-0 flex-1 font-mono text-[13px] leading-6">
          <div className="select-none border-r border-white/10 px-2 py-3 text-right text-slate-500">
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-full w-full resize-none bg-transparent p-3 text-slate-100 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
