"use client";

import { Glyph } from "@/components/icons";
import { Button, Card, FieldLabel, Input, PageHeader, Select, Textarea } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { people } from "@/lib/data";
import { typeLabel } from "@/lib/format";
import type { AssessmentModule, Session, SessionType } from "@/lib/types";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const steps = ["Type", "Details", "People", "Modules", "Review"];

const modules: { id: AssessmentModule; label: string; hint: string }[] = [
  { id: "video", label: "Meeting room", hint: "Participant layout and controls" },
  { id: "screen", label: "Screen share UI", hint: "Simulated share surface" },
  { id: "coding", label: "Coding test", hint: "Editor, prompt, and results" },
  { id: "whiteboard", label: "System design", hint: "Whiteboard and diagramming" },
  { id: "questions", label: "Evaluation questions", hint: "Structured prompts" },
  { id: "scorecard", label: "Scorecard", hint: "Ratings and recommendation" },
  { id: "notes", label: "Private notes", hint: "Visible only to evaluators" },
];

export function NewSessionView() {
  const router = useRouter();
  const { me, addSession } = useApp();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<SessionType>("interview");
  const [title, setTitle] = useState("Staff Engineer — live loop");
  const [duration, setDuration] = useState("60");
  const [agenda, setAgenda] = useState("Introductions\nWorking session\nDebrief");
  const [startsAt, setStartsAt] = useState("2026-08-20T10:00");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([me.id, "u6"]);
  const [selectedModules, setSelectedModules] = useState<AssessmentModule[]>([
    "video",
    "coding",
    "whiteboard",
    "scorecard",
    "notes",
  ]);

  const canNext = useMemo(() => {
    if (step === 1) return title.trim().length > 3;
    if (step === 2) return selectedPeople.length > 0;
    if (step === 3) return selectedModules.length > 0;
    return true;
  }, [step, title, selectedPeople, selectedModules]);

  function create() {
    const session: Session = {
      id: `s${Date.now()}`,
      title,
      type,
      status: "scheduled",
      hostId: me.id,
      companyId: me.companyId,
      startsAt: new Date(startsAt).toISOString(),
      durationMin: Number(duration),
      timezone: me.timezone,
      agenda: agenda.split("\n").filter(Boolean),
      modules: selectedModules,
      participants: selectedPeople.map((id, i) => ({
        personId: id,
        meetingRole: i === 0 ? "host" : "evaluator",
        cameraOn: true,
        micOn: true,
      })),
      location: "remote",
      recordingEnabled: true,
    };
    addSession(session);
    router.push(`/sessions/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Create"
        title="Create session"
        subtitle="Set up a professional meeting or assessment. Media stays simulated in this phase."
      />
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {steps.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              i === step
                ? "bg-ink text-white"
                : i < step
                  ? "bg-accent-soft text-accent"
                  : "border border-line bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            {i < step ? <Glyph icon={Check} size="xs" /> : <span>{i + 1}</span>}
            {label}
          </button>
        ))}
      </div>

      <Card>
        {step === 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(typeLabel) as SessionType[]).map((key) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  type === key
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-900">{typeLabel[key]}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {key === "investor" && "Founder meetings, diligence, and memos."}
                  {key === "client_review" && "Technical reviews with enterprise stakeholders."}
                  {key === "interview" && "Hiring loops with coding and design."}
                  {key === "freelancer" && "Agency or contractor evaluations."}
                  {key === "assessment" && "Standalone technical assessments."}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <FieldLabel>Title</FieldLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Start</FieldLabel>
                <Input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Duration (minutes)</FieldLabel>
                <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {["30", "45", "60", "75", "90"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel>Agenda (one item per line)</FieldLabel>
              <Textarea rows={5} value={agenda} onChange={(e) => setAgenda(e.target.value)} />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-2">
            {people.map((person) => {
              const on = selectedPeople.includes(person.id);
              return (
                <button
                  key={person.id}
                  onClick={() =>
                    setSelectedPeople((prev) =>
                      on ? prev.filter((id) => id !== person.id) : [...prev, person.id],
                    )
                  }
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                    on ? "border-accent bg-accent-soft" : "border-line hover:border-slate-300"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{person.name}</span>
                    <span className="block text-xs text-slate-500">
                      {person.title} · {person.role}
                    </span>
                  </span>
                  {on ? <Glyph icon={Check} size="md" className="text-teal-800" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-2">
            {modules.map((mod) => {
              const on = selectedModules.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() =>
                    setSelectedModules((prev) =>
                      on ? prev.filter((id) => id !== mod.id) : [...prev, mod.id],
                    )
                  }
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                    on ? "border-accent bg-accent-soft" : "border-line hover:border-slate-300"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{mod.label}</span>
                    <span className="block text-xs text-slate-500">{mod.hint}</span>
                  </span>
                  {on ? <Glyph icon={Check} size="md" className="text-teal-800" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-500">Type</span> · {typeLabel[type]}
            </p>
            <p>
              <span className="text-slate-500">Title</span> · {title}
            </p>
            <p>
              <span className="text-slate-500">People</span> · {selectedPeople.length} participants
            </p>
            <p>
              <span className="text-slate-500">Modules</span> · {selectedModules.join(", ")}
            </p>
            <p className="rounded-xl bg-slate-50 p-3 text-slate-600">
              Video, screen share, and code execution are simulated. This session is stored in
              application state so a later backend can replace the mock layer.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}>
              Continue
            </Button>
          ) : (
            <Button onClick={create}>Create session</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
