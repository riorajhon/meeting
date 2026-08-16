"use client";

import { Glyph, IconButton } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ArrowRightLeft,
  Database,
  Eraser,
  Globe,
  Highlighter,
  Layers,
  Minus,
  MousePointer2,
  PenTool,
  Server,
  Square,
  StickyNote,
  Trash2,
  Type,
  User,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Tool = "move" | "pen" | "highlight" | "erase" | "rect" | "line" | "connect";
type Kind = "actor" | "gateway" | "service" | "data" | "queue" | "cache" | "note";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: Kind;
  hint?: string;
};

type Edge = { id: string; from: string; to: string; label?: string };

const palettes = ["#14b8a6", "#f8fafc", "#f59e0b", "#38bdf8", "#a78bfa"];

const kindMeta: Record<
  Kind,
  { icon: LucideIcon; kicker: string; w: number; h: number; className: string }
> = {
  actor: {
    icon: User,
    kicker: "Actor",
    w: 168,
    h: 68,
    className: "border-sky-400/35 bg-sky-950/80 text-sky-100",
  },
  gateway: {
    icon: Globe,
    kicker: "Edge",
    w: 176,
    h: 68,
    className: "border-teal-400/40 bg-teal-950/80 text-teal-100",
  },
  service: {
    icon: Server,
    kicker: "Service",
    w: 188,
    h: 68,
    className: "border-indigo-400/35 bg-indigo-950/80 text-indigo-100",
  },
  data: {
    icon: Database,
    kicker: "Store",
    w: 168,
    h: 68,
    className: "border-amber-400/35 bg-amber-950/80 text-amber-100",
  },
  queue: {
    icon: Workflow,
    kicker: "Queue",
    w: 168,
    h: 68,
    className: "border-violet-400/35 bg-violet-950/80 text-violet-100",
  },
  cache: {
    icon: Layers,
    kicker: "Cache",
    w: 156,
    h: 68,
    className: "border-cyan-400/35 bg-cyan-950/80 text-cyan-100",
  },
  note: {
    icon: StickyNote,
    kicker: "Note",
    w: 188,
    h: 112,
    className: "border-amber-200/40 bg-[#f5e6b8] text-slate-800",
  },
};

const stamps: Array<{ label: string; kind: Kind; hint?: string }> = [
  { label: "Candidate", kind: "actor", hint: "Interviewee" },
  { label: "Client", kind: "actor" },
  { label: "API gateway", kind: "gateway" },
  { label: "Assessment service", kind: "service" },
  { label: "Scorecard API", kind: "service" },
  { label: "Postgres", kind: "data", hint: "Primary" },
  { label: "Redis", kind: "cache" },
  { label: "Eval queue", kind: "queue" },
  { label: "Trade-offs: consistency vs latency", kind: "note", hint: "Call out CAP / SLO choices" },
];

const seedNodes: Node[] = [
  { id: "n1", x: 36, y: 56, label: "Candidate client", kind: "actor", hint: "Browser" },
  { id: "n2", x: 240, y: 56, label: "API gateway", kind: "gateway", hint: "Auth + rate limit" },
  { id: "n3", x: 460, y: 40, label: "Assessment service", kind: "service", hint: "Live session" },
  { id: "n4", x: 700, y: 40, label: "Scorecard API", kind: "service" },
  { id: "n5", x: 460, y: 180, label: "Postgres", kind: "data", hint: "Sessions, scores" },
  { id: "n6", x: 700, y: 180, label: "Redis", kind: "cache", hint: "Presence" },
  { id: "n7", x: 240, y: 180, label: "Eval queue", kind: "queue" },
  {
    id: "n8",
    x: 36,
    y: 260,
    label: "Where do evaluators’ private notes live?",
    kind: "note",
    hint: "Don’t leak to candidate view",
  },
];

const seedEdges: Edge[] = [
  { id: "e1", from: "n1", to: "n2", label: "HTTPS" },
  { id: "e2", from: "n2", to: "n3" },
  { id: "e3", from: "n3", to: "n4" },
  { id: "e4", from: "n3", to: "n5" },
  { id: "e5", from: "n3", to: "n6" },
  { id: "e6", from: "n2", to: "n7", label: "async" },
  { id: "e7", from: "n7", to: "n5" },
];

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>("move");
  const [color, setColor] = useState(palettes[0]);
  const [nodes, setNodes] = useState<Node[]>(seedNodes);
  const [edges, setEdges] = useState<Edge[]>(seedEdges);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; w: number; h: number; type: "rect" | "line" } | null>(
    null,
  );
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const shapeStart = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const selected = nodes.find((n) => n.id === selectedId);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedId(null);
        setConnectFrom(null);
        setEditingId(null);
      }
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId && editingId !== selectedId) {
        setNodes((prev) => prev.filter((n) => n.id !== selectedId));
        setEdges((prev) => prev.filter((ed) => ed.from !== selectedId && ed.to !== selectedId));
        setSelectedId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, editingId]);

  function pos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function commitShape(type: "rect" | "line", start: { x: number; y: number }, end: { x: number; y: number }) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    if (type === "rect") {
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  function down(e: React.MouseEvent<HTMLCanvasElement>) {
    if (tool === "move" || tool === "connect" || drag.current) return;
    const p = pos(e);
    if (tool === "rect" || tool === "line") {
      shapeStart.current = p;
      drawing.current = false;
      return;
    }
    drawing.current = true;
    last.current = p;
  }

  function move(e: React.MouseEvent<HTMLCanvasElement>) {
    const next = pos(e);
    if ((tool === "rect" || tool === "line") && shapeStart.current) {
      const s = shapeStart.current;
      setPreview({
        type: tool,
        x: Math.min(s.x, next.x),
        y: Math.min(s.y, next.y),
        w: Math.abs(next.x - s.x),
        h: Math.abs(next.y - s.y),
      });
      if (tool === "line") {
        setPreview({ type: "line", x: s.x, y: s.y, w: next.x - s.x, h: next.y - s.y });
      }
      return;
    }
    if (!drawing.current || tool === "move" || tool === "connect") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = tool === "erase" ? 18 : tool === "highlight" ? 16 : 2.2;
    ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
    ctx.strokeStyle = tool === "highlight" ? `${color}55` : color;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
  }

  function up(e: React.MouseEvent<HTMLCanvasElement>) {
    if ((tool === "rect" || tool === "line") && shapeStart.current) {
      commitShape(tool, shapeStart.current, pos(e));
      shapeStart.current = null;
      setPreview(null);
    }
    drawing.current = false;
    last.current = null;
  }

  function boardPoint(e: { clientX: number; clientY: number }) {
    const box = boardRef.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0, width: 0, height: 0 };
    return { x: e.clientX - box.left, y: e.clientY - box.top, width: box.width, height: box.height };
  }

  function onLabelPointerDown(e: React.PointerEvent<HTMLDivElement>, node: Node) {
    e.stopPropagation();
    if (tool === "connect") {
      e.preventDefault();
      if (!connectFrom || connectFrom === node.id) {
        setConnectFrom(node.id);
        setSelectedId(node.id);
        return;
      }
      setEdges((prev) =>
        prev.some((ed) => ed.from === connectFrom && ed.to === node.id)
          ? prev
          : [...prev, { id: `e${Date.now()}`, from: connectFrom, to: node.id }],
      );
      setConnectFrom(null);
      setSelectedId(node.id);
      return;
    }
    if (editingId === node.id) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = boardPoint(e);
    drag.current = { id: node.id, dx: point.x - node.x, dy: point.y - node.y };
    setDraggingId(node.id);
    setSelectedId(node.id);
    drawing.current = false;
  }

  function onLabelPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const meta = kindMeta[nodes.find((n) => n.id === drag.current?.id)?.kind ?? "service"];
    const point = boardPoint(e);
    const nextX = Math.max(8, Math.min(point.width - meta.w - 8, point.x - drag.current.dx));
    const nextY = Math.max(8, Math.min(point.height - meta.h - 8, point.y - drag.current.dy));
    const id = drag.current.id;
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x: nextX, y: nextY } : n)));
  }

  function onLabelPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current = null;
    setDraggingId(null);
  }

  function addStamp(stamp: (typeof stamps)[number]) {
    setNodes((prev) => [
      ...prev,
      {
        id: `n${Date.now()}`,
        x: 48 + (prev.length % 5) * 28,
        y: 320 + (prev.length % 3) * 16,
        label: stamp.label,
        kind: stamp.kind,
        hint: stamp.hint,
      },
    ]);
  }

  function clearAll() {
    const ctx = canvasRef.current?.getContext("2d");
    if (canvasRef.current && ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setNodes([]);
    setEdges([]);
    setSelectedId(null);
    setConnectFrom(null);
  }

  function restoreSeed() {
    const ctx = canvasRef.current?.getContext("2d");
    if (canvasRef.current && ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setNodes(seedNodes);
    setEdges(seedEdges);
    setSelectedId(null);
    setConnectFrom(null);
  }

  const tools: Array<[Tool, LucideIcon, string]> = [
    ["move", MousePointer2, "Move"],
    ["connect", ArrowRightLeft, "Connect"],
    ["pen", PenTool, "Pen"],
    ["highlight", Highlighter, "Highlight"],
    ["erase", Eraser, "Eraser"],
    ["rect", Square, "Rectangle"],
    ["line", Minus, "Line"],
  ];

  const paths = useMemo(() => {
    return edges
      .map((edge) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        const a = kindMeta[from.kind];
        const b = kindMeta[to.kind];
        const x1 = from.x + a.w / 2;
        const y1 = from.y + a.h / 2;
        const x2 = to.x + b.w / 2;
        const y2 = to.y + b.h / 2;
        const mx = (x1 + x2) / 2;
        return { edge, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
      })
      .filter(Boolean);
  }, [edges, nodes]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b121c]">
      <aside className="hidden w-[200px] shrink-0 flex-col border-r border-white/10 bg-[#0e1622] sm:flex">
        <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Stencils
        </p>
        <div className="flex-1 space-y-1 overflow-auto px-2 pb-3">
          {stamps.map((s) => {
            const Icon = kindMeta[s.kind].icon;
            return (
              <button
                key={`${s.kind}-${s.label}`}
                onClick={() => addStamp(s)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10"
              >
                <span className={cn("grid size-7 place-items-center rounded-md border", kindMeta[s.kind].className)}>
                  <Glyph icon={Icon} size="sm" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{s.label}</span>
                  <span className="block text-[10px] text-slate-500">{kindMeta[s.kind].kicker}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-white/10 p-2">
          <button
            onClick={restoreSeed}
            className="w-full rounded-lg px-2 py-1.5 text-[11px] font-medium text-teal-300 hover:bg-white/10"
          >
            Load reference architecture
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 px-3 py-2">
          {tools.map(([id, Icon, label]) => (
            <IconButton
              key={id}
              icon={Icon}
              label={label}
              size="sm"
              selected={tool === id}
              onClick={() => {
                setTool(id);
                if (id !== "connect") setConnectFrom(null);
              }}
            />
          ))}
          {palettes.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn("ui-press size-5 rounded-full border", color === c ? "ring-2 ring-white/80" : "border-white/20")}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
          <div className="mx-1 h-5 w-px bg-white/10" />
          {stamps.slice(0, 5).map((s) => (
            <Button key={s.label} size="sm" variant="dark" className="hidden lg:inline-flex" onClick={() => addStamp(s)}>
              <Glyph icon={StickyNote} size="xs" /> {s.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" className="ml-auto text-slate-300" onClick={clearAll}>
            <Glyph icon={Trash2} size="md" /> Clear
          </Button>
        </div>

        <div ref={boardRef} className="relative min-h-[420px] flex-1 overflow-hidden room-grid">
          <canvas
            ref={canvasRef}
            width={1400}
            height={780}
            onMouseDown={down}
            onMouseMove={move}
            onMouseUp={up}
            onMouseLeave={up}
            className={cn(
              "absolute inset-0 z-10 h-full w-full",
              tool === "move" || tool === "connect" ? "pointer-events-none cursor-default" : "cursor-crosshair",
            )}
          />
          <svg className="pointer-events-none absolute inset-0 z-[15] h-full w-full">
            <defs>
              <marker id="board-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#5eead4" />
              </marker>
            </defs>
            {paths.map((item) =>
              item ? (
                <g key={item.edge.id}>
                  <path
                    d={item.d}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="1.8"
                    strokeOpacity="0.7"
                    markerEnd="url(#board-arrow)"
                  />
                  {item.edge.label ? (
                    <text x={item.mx} y={item.my - 6} textAnchor="middle" className="fill-teal-200/80" fontSize="10">
                      {item.edge.label}
                    </text>
                  ) : null}
                </g>
              ) : null,
            )}
          </svg>
          {preview && preview.type === "rect" ? (
            <div
              className="pointer-events-none absolute z-30 border border-dashed border-teal-300/70"
              style={{ left: preview.x, top: preview.y, width: preview.w, height: preview.h }}
            />
          ) : null}
          {preview && preview.type === "line" ? (
            <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full">
              <line
                x1={preview.x}
                y1={preview.y}
                x2={preview.x + preview.w}
                y2={preview.y + preview.h}
                stroke={color}
                strokeWidth="2"
              />
            </svg>
          ) : null}
          {nodes.map((node) => {
            const meta = kindMeta[node.kind];
            const Icon = meta.icon;
            const isOn = selectedId === node.id || connectFrom === node.id;
            return (
              <div
                key={node.id}
                onPointerDown={(e) => onLabelPointerDown(e, node)}
                onPointerMove={onLabelPointerMove}
                onPointerUp={onLabelPointerUp}
                onPointerCancel={onLabelPointerUp}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingId(node.id);
                  setSelectedId(node.id);
                }}
                className={cn(
                  "absolute z-20 select-none rounded-[14px] border px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm",
                  meta.className,
                  draggingId === node.id ? "cursor-grabbing" : tool === "connect" ? "cursor-crosshair" : "cursor-grab",
                  isOn && "ring-2 ring-teal-300/70",
                )}
                style={{ left: node.x, top: node.y, width: meta.w, minHeight: meta.h }}
              >
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">
                  <Glyph icon={Icon} size="xs" /> {meta.kicker}
                </p>
                {editingId === node.id ? (
                  <input
                    autoFocus
                    defaultValue={node.label}
                    onPointerDown={(e) => e.stopPropagation()}
                    onBlur={(e) => {
                      setNodes((prev) =>
                        prev.map((n) => (n.id === node.id ? { ...n, label: e.target.value || n.label } : n)),
                      );
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    }}
                    className="w-full rounded bg-black/20 px-1 text-[12px] font-medium outline-none"
                  />
                ) : (
                  <p className="text-[12px] font-semibold leading-4">{node.label}</p>
                )}
                {node.hint && node.kind !== "note" ? (
                  <p className="mt-1 text-[10px] opacity-60">{node.hint}</p>
                ) : null}
                {node.kind === "note" && node.hint ? (
                  <p className="mt-1 text-[11px] leading-4 opacity-80">{node.hint}</p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex h-11 shrink-0 items-center gap-3 border-t border-white/10 px-3 text-[11px] text-slate-500">
          <Glyph icon={Type} size="sm" className="text-slate-500" />
          <span>
            {connectFrom
              ? "Click a second node to draw a connector"
              : selected
                ? `Selected · ${selected.label} · double-click to rename · Delete to remove`
                : "Drag nodes · Connect tool for arrows · Pen and highlight for sketching"}
          </span>
          <span className="ml-auto tabular-nums">
            {nodes.length} nodes · {edges.length} links
          </span>
        </div>
      </div>
    </div>
  );
}
