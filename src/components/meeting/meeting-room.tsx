"use client";

import { BrandMark } from "@/components/brand-mark";
import { CodeWorkspace } from "@/components/assessment/code-workspace";
import { EvaluationPanel } from "@/components/assessment/evaluation-panel";
import { Whiteboard } from "@/components/assessment/whiteboard";
import { Avatar, Button } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/cn";
import { people } from "@/lib/data";
import { typeLabel } from "@/lib/format";
import type { Session } from "@/lib/types";
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
  Radio,
  ScreenShare,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Center = "gallery" | "speaker" | "screen" | "code" | "board";
type Side = "chat" | "eval";

export function MeetingRoom({ sessionId }: { sessionId: string }) {
  const { sessions, me, chat, sendChat } = useApp();
  const session = sessions.find((s) => s.id === sessionId);
  const [center, setCenter] = useState<Center>(session?.status === "live" ? "gallery" : "gallery");
  const [side, setSide] = useState<Side>("chat");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(session?.recordingEnabled ?? false);
  const [elapsed, setElapsed] = useState(12 * 60 + 18);
  const [draft, setDraft] = useState("");
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");

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
      <div className="grid min-h-screen place-items-center text-slate-300">
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

  function send() {
    if (!draft.trim()) return;
    sendChat({ sessionId, authorId: me.id, body: draft.trim() });
    setDraft("");
  }

  return (
    <div className="flex h-screen min-h-screen flex-col bg-[#0a0d12] text-slate-100">
      <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
        <Link href="/" className="shrink-0" aria-label="Caliber home">
          <BrandMark size={40} />
        </Link>
        <Link
          href={`/sessions/${session.id}`}
          className="rounded-lg px-2 py-1 text-[13px] text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          Exit
        </Link>
        <div className="h-4 w-px bg-white/10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{session.title}</p>
          <p className="text-[11px] text-slate-500">{typeLabel[session.type]}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[12px] tabular-nums text-slate-300 sm:flex">
          <Radio size={12} className="text-rose-400" /> {clock}
        </span>
        {recording ? (
          <span className="flex items-center gap-1.5 rounded-full bg-rose-500/12 px-2.5 py-1 text-[11px] font-medium text-rose-300">
            <Circle size={8} className="fill-rose-400 text-rose-400" /> Rec
          </span>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col p-3">
          <div className="mb-3 flex flex-wrap gap-1 rounded-[10px] bg-white/[0.04] p-1">
            {(
              [
                ["gallery", "People", Users],
                ["screen", "Share", ScreenShare],
                ...(session.modules.includes("coding") ? [["code", "Code", Code2]] : []),
                ...(session.modules.includes("whiteboard") ? [["board", "Board", PenTool]] : []),
              ] as Array<[Center, string, typeof Users]>
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => {
                  setCenter(id);
                  if (id === "screen") setSharing(true);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                  center === id
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
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
        </section>

        <aside className="hidden w-[320px] shrink-0 border-l border-white/[0.07] bg-[#0c1018] md:flex md:flex-col">
          <div className="flex gap-1 border-b border-white/[0.07] p-2">
            <button
              onClick={() => setSide("chat")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium",
                side === "chat" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
              )}
            >
              <MessageSquare size={14} /> Chat
            </button>
            <button
              onClick={() => setSide("eval")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium",
                side === "eval" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
              )}
            >
              <ClipboardCheck size={14} /> Evaluate
            </button>
          </div>
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
        </aside>
      </div>

      <footer className="flex h-[68px] shrink-0 items-center justify-center gap-1.5 border-t border-white/[0.07] bg-[#0c1018] px-3">
        <IconToggle on={mic} onClick={() => setMic((v) => !v)} label="Microphone">
          {mic ? <Mic size={16} /> : <MicOff size={16} />}
        </IconToggle>
        <IconToggle on={cam} onClick={() => setCam((v) => !v)} label="Camera">
          {cam ? <Video size={16} /> : <VideoOff size={16} />}
        </IconToggle>
        <IconToggle
          on={sharing}
          onClick={() => {
            setSharing((v) => !v);
            setCenter((c) => (c === "screen" ? "gallery" : "screen"));
          }}
          label="Share screen"
        >
          {sharing ? <MonitorUp size={16} /> : <ScreenShare size={16} />}
        </IconToggle>
        <IconToggle
          on={layout === "grid"}
          onClick={() => setLayout((l) => (l === "grid" ? "speaker" : "grid"))}
          label="Layout"
        >
          <LayoutGrid size={16} />
        </IconToggle>
        <IconToggle on={recording} onClick={() => setRecording((v) => !v)} label="Record">
          <Circle size={16} />
        </IconToggle>
        <button
          className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-slate-200 hover:bg-white/[0.12] md:hidden"
          onClick={() => setSide("chat")}
          aria-label="Chat"
        >
          <MessageSquare size={16} />
        </button>
        <Link href={`/sessions/${session.id}`}>
          <button className="ml-3 inline-flex h-10 items-center gap-2 rounded-full bg-rose-600 px-4 text-[13px] font-medium text-white hover:bg-rose-500">
            <PhoneOff size={16} /> Leave
          </button>
        </Link>
      </footer>
    </div>
  );
}

function IconToggle({
  on,
  onClick,
  children,
  label,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-10 place-items-center rounded-full transition-colors",
        on
          ? "bg-white/[0.08] text-white hover:bg-white/[0.12]"
          : "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30",
      )}
    >
      {children}
    </button>
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
        "grid h-full gap-3",
        tiles.length === 1 && "grid-cols-1",
        tiles.length === 2 && "grid-cols-1 md:grid-cols-2",
        tiles.length >= 3 && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2",
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
              "relative overflow-hidden rounded-[16px] bg-[#121820]",
              speaking ? "ring-1 ring-teal-400/50" : "ring-1 ring-white/[0.06]",
            )}
          >
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3">
              {camera ? (
                <div
                  className="relative grid size-24 place-items-center rounded-full"
                  style={{ boxShadow: speaking ? "0 0 0 6px rgba(20,184,166,0.25)" : undefined }}
                >
                  <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="2xl" />
                </div>
              ) : (
                <div className="grid size-24 place-items-center rounded-full bg-white/5 text-slate-500">
                  <VideoOff size={22} />
                </div>
              )}
              <p className="text-sm font-medium">
                {person.name}
                {isMe ? " (you)" : ""}
              </p>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-2 py-1 text-[11px]">
              {p.micOn === false ? <MicOff size={12} className="text-rose-300" /> : <Mic size={12} />}
              {p.meetingRole}
            </div>
            {speaking ? (
              <span className="absolute right-3 top-3 text-[11px] text-teal-300">Speaking</span>
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
      <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 text-slate-400">
        Screen share is simulated. Toggle share in the control bar.
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-xs text-slate-500">
        <span>Presenting · Meridian Labs — architecture overview.pdf</span>
        <span>Simulated share</span>
      </div>
      <div className="grid flex-1 gap-4 bg-slate-50 p-6 md:grid-cols-3">
        {["Ingest", "Evaluate", "Decide"].map((col, i) => (
          <div key={col} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-teal-800">{col}</p>
            <p className="mt-2 text-lg font-semibold">{["Sessions", "Assessments", "Scorecards"][i]}</p>
            <p className="mt-2 text-sm text-slate-500">
              Mock diagram tile for investor and client screen-share walkthroughs.
            </p>
          </div>
        ))}
        <div className="rounded-2xl bg-[#0b1220] p-4 text-slate-200 md:col-span-3">
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
      <div className="border-b border-white/10 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">In this room</p>
        <div className="flex flex-wrap gap-2">
          {session.participants.map((p) => {
            const person = people.find((x) => x.id === p.personId);
            if (!person) return null;
            return (
              <div key={p.personId} className="flex items-center gap-2 rounded-full bg-white/5 pr-3">
                <Avatar name={person.name} hue={person.avatarHue} src={person.avatar} size="sm" />
                <span className="text-xs">{person.name.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
        {messages.map((m) => {
          const author = people.find((p) => p.id === m.authorId);
          return (
            <div key={m.id} className="text-sm">
              <p className="text-[11px] text-slate-500">
                {author?.name} {m.private ? "· private" : ""}
              </p>
              <p className="mt-0.5 text-slate-200">{m.body}</p>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Message the room…"
          className="h-9 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none"
        />
        <Button size="sm" onClick={onSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
