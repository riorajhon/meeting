"use client";

import { BrandMark } from "@/components/brand-mark";
import { CodeWorkspace } from "@/components/assessment/code-workspace";
import { EvaluationPanel } from "@/components/assessment/evaluation-panel";
import { Whiteboard } from "@/components/assessment/whiteboard";
import { Glyph, LabeledControl, ModeButton } from "@/components/icons";
import { Avatar, Button } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/cn";
import { people } from "@/lib/data";
import { typeLabel } from "@/lib/format";
import type { ChatMessage, Session } from "@/lib/types";
import {
  Circle,
  ClipboardCheck,
  Code2,
  LayoutGrid,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PenTool,
  PhoneOff,
  ScreenShare,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Center = "gallery" | "speaker" | "screen" | "code" | "board";
type Side = "chat" | "eval";

const stageCopy: Record<Center, { kicker: string; title: string }> = {
  gallery: { kicker: "Professional meeting", title: "People" },
  speaker: { kicker: "Professional meeting", title: "Speaker" },
  screen: { kicker: "Professional meeting", title: "Shared surface" },
  code: { kicker: "Assessment", title: "Live coding" },
  board: { kicker: "Assessment", title: "System design" },
};

export function MeetingRoom({ sessionId }: { sessionId: string }) {
  const { sessions, me, chat, sendChat } = useApp();
  const session = sessions.find((s) => s.id === sessionId);
  const [center, setCenter] = useState<Center>("gallery");
  const [side, setSide] = useState<Side>("eval");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(session?.recordingEnabled ?? false);
  const [elapsed, setElapsed] = useState(12 * 60 + 18);
  const [draft, setDraft] = useState("");
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [mobilePanel, setMobilePanel] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  const messages = useMemo(
    () => chat.filter((m) => m.sessionId === sessionId),
    [chat, sessionId],
  );

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07090e] text-slate-300">
        <div className="text-center">
          <p className="font-medium">Session not found</p>
          <Link href="/sessions" className="mt-3 inline-block text-sm text-teal-400">
            Back to sessions
          </Link>
        </div>
      </div>
    );
  }

  const participants = session.participants
    .map((p) => ({ ...p, person: people.find((x) => x.id === p.personId) }))
    .filter((p) => p.person);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const stage = stageCopy[center];

  function send() {
    if (!draft.trim()) return;
    sendChat({ sessionId, authorId: me.id, body: draft.trim() });
    setDraft("");
  }

  const workspaceModes = (
    [
      ["gallery", "People", Users],
      ["screen", "Share", ScreenShare],
      ...(session.modules.includes("coding") ? ([["code", "Code", Code2]] as const) : []),
      ...(session.modules.includes("whiteboard") ? ([["board", "Board", PenTool]] as const) : []),
    ] as Array<[Center, string, typeof Users]>
  );

  const reviewModes = (
    [
      ["chat", "Chat", MessageSquare],
      ["eval", "Evaluate", ClipboardCheck],
    ] as const
  );

  function workspaceHint(id: Center) {
    if (id === "gallery" || id === "speaker") return "People — meeting stage";
    if (id === "screen") return "Share — shared surface";
    if (id === "code") return "Code — live coding";
    return "Board — system design";
  }

  return (
    <div className="room-shell flex h-screen min-h-screen flex-col text-slate-100">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-3 sm:px-4">
        <Link href="/" className="shrink-0" aria-label="Caliber home">
          <BrandMark size={36} className="rounded-[12px] shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
        </Link>
        <Link
          href={`/sessions/${session.id}`}
          className="ui-press rounded-[10px] px-2.5 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-white/[0.05] hover:text-white"
        >
          Exit
        </Link>
        <div className="h-5 w-px bg-white/10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold tracking-tight">{session.title}</p>
          <p className="truncate text-[11px] text-slate-500">
            {typeLabel[session.type]} · {session.durationMin} min
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[12px] tabular-nums text-slate-300 sm:inline-flex">
          <span
            className={cn(
              "size-1.5 rounded-full",
              session.status === "live" ? "bg-rose-400 live-dot" : "bg-slate-500",
            )}
          />
          {session.status === "live" ? clock : session.status === "completed" ? "Replay" : typeLabel[session.type]}
        </span>
        {recording ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-rose-500/12 px-2.5 py-1 text-[11px] font-medium text-rose-200 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-rose-400 live-dot" />
            Recording
          </span>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="room-rail hidden w-[92px] shrink-0 flex-col border-r border-white/[0.06] py-3 md:flex">
          <p className="mb-1 px-3 text-[9px] font-semibold tracking-[0.16em] text-slate-600 uppercase">
            Room
          </p>
          <div className="space-y-0.5 px-1.5">
            {workspaceModes.map(([id, label, Icon]) => (
              <ModeButton
                key={id}
                icon={Icon}
                label={label}
                hint={workspaceHint(id)}
                selected={center === id || (id === "gallery" && center === "speaker")}
                onClick={() => {
                  setCenter(id);
                  if (id === "screen") setSharing(true);
                }}
              />
            ))}
          </div>
          <div className="mx-4 my-3 h-px bg-white/[0.06]" />
          <p className="mb-1 px-3 text-[9px] font-semibold tracking-[0.16em] text-slate-600 uppercase">
            Review
          </p>
          <div className="space-y-0.5 px-1.5">
            {reviewModes.map(([id, label, Icon]) => (
              <ModeButton
                key={id}
                icon={Icon}
                label={label}
                hint={id === "chat" ? "Chat — room discussion" : "Evaluate — live scorecard"}
                selected={side === id}
                onClick={() => setSide(id)}
              />
            ))}
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.06] px-2 py-1.5 md:hidden">
            {workspaceModes.map(([id, label, Icon]) => (
              <ModeButton
                key={id}
                icon={Icon}
                label={label}
                hint={workspaceHint(id)}
                compact
                selected={center === id || (id === "gallery" && center === "speaker")}
                onClick={() => {
                  setCenter(id);
                  if (id === "screen") setSharing(true);
                }}
              />
            ))}
            {reviewModes.map(([id, label, Icon]) => (
              <ModeButton
                key={id}
                icon={Icon}
                label={label}
                hint={id === "chat" ? "Chat — room discussion" : "Evaluate — live scorecard"}
                compact
                selected={mobilePanel && side === id}
                onClick={() => {
                  setSide(id);
                  setMobilePanel(true);
                }}
              />
            ))}
          </div>

          <section className="flex min-h-0 min-w-0 flex-1 flex-col p-2 sm:p-3">
            <div className="mb-2 flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-medium tracking-[0.14em] text-slate-500 uppercase">
                  {stage.kicker}
                </p>
                <h1 className="text-[15px] font-semibold tracking-tight text-white">{stage.title}</h1>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                <span className={cn(center === "gallery" || center === "speaker" || center === "screen" ? "text-slate-200" : "text-slate-500")}>
                  Meeting
                </span>
                {" · "}
                <span className={cn(center === "code" || center === "board" ? "text-slate-200" : "text-slate-500")}>
                  Assessment
                </span>
                {" · "}
                <span className={cn(side === "eval" ? "text-slate-200" : "text-slate-500")}>Evaluation</span>
              </p>
            </div>
            <div className="room-stage min-h-0 flex-1 overflow-hidden rounded-[18px] border border-white/[0.08] p-2 sm:p-3">
              <div key={center} className="panel-in h-full min-h-0">
                {center === "gallery" || center === "speaker" ? (
                  <VideoGrid
                    participants={participants}
                    layout={layout}
                    meId={me.id}
                    cam={cam}
                  />
                ) : null}
                {center === "screen" ? <ScreenSharePreview sharing={sharing} /> : null}
                {center === "code" ? <CodeWorkspace /> : null}
                {center === "board" ? <Whiteboard /> : null}
              </div>
            </div>
          </section>
        </div>

        <button
          type="button"
          aria-label="Close panel"
          onClick={() => setMobilePanel(false)}
          className={cn(
            "fixed inset-0 z-20 bg-black/50 md:hidden",
            mobilePanel ? "overlay-in opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <aside
          className={cn(
            "room-panel flex w-[336px] shrink-0 flex-col border-l border-white/[0.06]",
            "max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:z-30 max-md:flex max-md:shadow-[-24px_0_48px_rgba(0,0,0,0.45)]",
            "max-md:transition-transform max-md:duration-300 max-md:ease-[cubic-bezier(0.22,1,0.36,1)]",
            mobilePanel ? "max-md:translate-x-0" : "max-md:translate-x-full",
            "md:flex",
          )}
        >
          <div className="flex items-center gap-1 border-b border-white/[0.06] p-2">
            {reviewModes.map(([id, label, Icon]) => (
              <ModeButton
                key={id}
                icon={Icon}
                label={label}
                hint={id === "chat" ? "Chat — room discussion" : "Evaluate — live scorecard"}
                compact
                className="flex-1"
                selected={side === id}
                onClick={() => setSide(id)}
              />
            ))}
            <button
              type="button"
              className="ui-press ml-1 rounded-[10px] px-2.5 py-1.5 text-[12px] font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white md:hidden"
              onClick={() => setMobilePanel(false)}
            >
              Close
            </button>
          </div>
          <div key={side} className="panel-in flex min-h-0 flex-1 flex-col">
            {side === "chat" ? (
              <ChatPeople
                session={session}
                messages={messages}
                draft={draft}
                setDraft={setDraft}
                onSend={send}
              />
            ) : (
              <EvaluationPanel session={session} />
            )}
          </div>
        </aside>
      </div>

      <footer className="flex h-[80px] shrink-0 items-center justify-center border-t border-white/[0.06] bg-[#06080c] px-3">
        <div className="room-dock flex items-center gap-0.5 rounded-[18px] border border-white/[0.06] px-1.5 py-1">
          <LabeledControl
            icon={mic ? Mic : MicOff}
            label="Mic"
            hint={mic ? "Mute microphone" : "Unmute microphone"}
            on={mic}
            onClick={() => setMic((v) => !v)}
          />
          <LabeledControl
            icon={cam ? Video : VideoOff}
            label="Camera"
            hint={cam ? "Turn camera off" : "Turn camera on"}
            on={cam}
            onClick={() => setCam((v) => !v)}
          />
          <div className="mx-1 hidden h-8 w-px bg-white/[0.08] sm:block" />
          <LabeledControl
            icon={sharing ? MonitorUp : ScreenShare}
            label="Share"
            hint={sharing ? "Stop sharing" : "Share screen"}
            selected={sharing}
            onClick={() => {
              setSharing((v) => !v);
              setCenter((c) => (c === "screen" ? "gallery" : "screen"));
            }}
          />
          <LabeledControl
            icon={LayoutGrid}
            label={layout === "grid" ? "Gallery" : "Speaker"}
            hint={layout === "grid" ? "Switch to speaker layout" : "Switch to gallery layout"}
            onClick={() => setLayout((l) => (l === "grid" ? "speaker" : "grid"))}
          />
          <LabeledControl
            icon={Circle}
            label="Record"
            hint={recording ? "Stop recording" : "Start recording"}
            on={!recording}
            onClick={() => setRecording((v) => !v)}
          />
          <Link
            href={`/sessions/${session.id}`}
            className="ui-press ml-2 inline-flex h-10 items-center gap-2 rounded-[12px] bg-rose-600 px-4 text-[13px] font-medium text-white hover:bg-rose-500"
          >
            <Glyph icon={PhoneOff} size="md" />
            Leave
          </Link>
        </div>
      </footer>
    </div>
  );
}

function VideoGrid({
  participants,
  layout,
  meId,
  cam,
}: {
  participants: Array<{
    personId: string;
    meetingRole: string;
    cameraOn?: boolean;
    micOn?: boolean;
    person?: (typeof people)[number];
  }>;
  layout: "grid" | "speaker";
  meId: string;
  cam: boolean;
}) {
  const tiles = layout === "speaker" ? participants.slice(0, 1) : participants;
  return (
    <div
      className={cn(
        "grid h-full gap-2.5",
        tiles.length === 1 && "grid-cols-1",
        tiles.length === 2 && "grid-cols-1 md:grid-cols-2",
        tiles.length >= 3 && "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {tiles.map((p, i) => {
        const person = p.person;
        if (!person) return null;
        const isMe = person.id === meId;
        const camera = isMe ? cam : p.cameraOn !== false;
        const speaking = i === 0;
        return (
          <div
            key={person.id}
            className={cn(
              "relative overflow-hidden rounded-[14px] bg-[#10161f] ring-1 ring-white/[0.05]",
              speaking && "ring-accent/55",
            )}
          >
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3">
              {camera ? (
                <div className={cn("relative grid size-[88px] place-items-center rounded-full", speaking && "speak-ring")}>
                  <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="2xl" />
                </div>
              ) : (
                <div className="grid size-[88px] place-items-center rounded-full bg-white/[0.04] text-slate-500">
                  <Glyph icon={VideoOff} size="xl" />
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white">
                  {person.name}
                  {isMe ? " (you)" : ""}
                </p>
                <p className="text-[11px] capitalize text-slate-400">{p.meetingRole}</p>
              </div>
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full",
                  p.micOn === false ? "bg-rose-500/20 text-rose-200" : "bg-white/10 text-slate-200",
                )}
              >
                <Glyph icon={p.micOn === false ? MicOff : Mic} size="xs" />
              </span>
            </div>
            {speaking ? (
              <span className="absolute right-3 top-3 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-teal-200">
                Speaking
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ScreenSharePreview({ sharing }: { sharing: boolean }) {
  if (!sharing) {
    return (
      <div className="grid h-full place-items-center rounded-[14px] border border-dashed border-white/12 text-slate-400">
        <div className="max-w-sm text-center">
          <IconWellShare />
          <p className="mt-3 text-sm font-medium text-slate-200">No shared surface yet</p>
          <p className="mt-1 text-[13px] leading-6 text-slate-500">
            Share is simulated for this phase. Use the Share control to present the assessment deck.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[14px] border border-white/10 bg-white text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Presenting · Meridian Labs — architecture overview.pdf</span>
        <span>Simulated share</span>
      </div>
      <div className="grid flex-1 gap-4 bg-slate-50 p-6 md:grid-cols-2">
        {["Meet", "Assess", "Evaluate", "Decide"].map((col, i) => (
          <div key={col} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-medium tracking-[0.14em] text-teal-800 uppercase">
              {String(i + 1).padStart(2, "0")} · {col}
            </p>
            <p className="mt-2 text-lg font-semibold">
              {["Sessions", "Code & board", "Scorecards", "Decision briefs"][i]}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Mock diagram tile for investor and client screen-share walkthroughs.
            </p>
          </div>
        ))}
        <div className="rounded-2xl bg-[#0b1220] p-4 text-slate-200 md:col-span-2">
          <p className="text-sm font-medium">Data plane (placeholder)</p>
          <p className="mt-2 text-sm text-slate-400">
            No third-party meeting SDK. This surface stands in for screen share until the internal
            media pipeline is connected.
          </p>
        </div>
      </div>
    </div>
  );
}

function IconWellShare() {
  return (
    <span className="mx-auto grid size-12 place-items-center rounded-[14px] bg-white/[0.05] text-slate-400">
      <Glyph icon={ScreenShare} size="lg" />
    </span>
  );
}

function ChatPeople({
  session,
  messages,
  draft,
  setDraft,
  onSend,
}: {
  session: Session;
  messages: ChatMessage[];
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
          In this room
        </p>
        <div className="flex flex-wrap gap-1.5">
          {session.participants.map((p) => {
            const person = people.find((x) => x.id === p.personId);
            if (!person) return null;
            return (
              <div
                key={p.personId}
                className="flex items-center gap-1.5 rounded-full bg-white/[0.05] py-0.5 pr-2.5 pl-0.5"
              >
                <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="sm" />
                <span className="text-[11px] text-slate-200">{person.name.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto px-4 py-3">
        {messages.map((m) => {
          const author = people.find((p) => p.id === m.authorId);
          return (
            <div key={m.id}>
              <p className="text-[11px] font-medium text-slate-500">
                {author?.name}
                {m.private ? " · private" : ""}
              </p>
              <p className="mt-1 rounded-[12px] bg-white/[0.04] px-3 py-2 text-[13px] leading-5 text-slate-200">
                {m.body}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 border-t border-white/[0.06] p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Message the room…"
          className="h-9 flex-1 rounded-[10px] border border-white/10 bg-white/[0.05] px-3 text-[13px] outline-none transition-[border-color,box-shadow] focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        />
        <Button size="sm" onClick={onSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
