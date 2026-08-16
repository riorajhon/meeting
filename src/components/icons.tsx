"use client";

import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export const ICON_STROKE = 1.75;

export const ICON_PX = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
} as const;

export type IconScale = keyof typeof ICON_PX;

export function Glyph({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  size?: IconScale | number;
  className?: string;
}) {
  const px = typeof size === "number" ? size : ICON_PX[size];
  return (
    <Icon
      size={px}
      strokeWidth={ICON_STROKE}
      absoluteStrokeWidth
      className={cn("shrink-0", className)}
    />
  );
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 280,
  className,
}: {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(0);

  function place() {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    setPos({
      x: box.left + box.width / 2,
      y: side === "top" ? box.top : box.bottom,
    });
    setOpen(true);
  }

  function show() {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(place, delay);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={ref}
      className={cn("inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open
        ? createPortal(
            <span
              role="tooltip"
              className="ui-tooltip pointer-events-none fixed z-[120] max-w-[220px] -translate-x-1/2 rounded-[8px] px-2 py-1 text-center text-[11px] font-medium tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
              style={{
                left: pos.x,
                top: pos.y,
                marginTop: side === "bottom" ? 8 : undefined,
                marginBottom: side === "top" ? 8 : undefined,
                transform:
                  side === "top"
                    ? "translate(-50%, calc(-100% - 8px))"
                    : "translate(-50%, 8px)",
              }}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}

type IconButtonSize = "sm" | "md" | "lg";

const hit = {
  sm: "size-8 rounded-[9px]",
  md: "size-10 rounded-[11px]",
  lg: "size-11 rounded-[12px]",
} as const;

const glyphFor: Record<IconButtonSize, IconScale> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export function IconButton({
  icon,
  label,
  selected = false,
  on = true,
  surface = "room",
  size = "md",
  shape = "square",
  tooltip,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  label: string;
  selected?: boolean;
  on?: boolean;
  surface?: "room" | "light";
  size?: IconButtonSize;
  shape?: "square" | "round";
  tooltip?: string;
}) {
  const off = !on;
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected || off}
      disabled={disabled}
      className={cn(
        "ui-press grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-45",
        hit[size],
        shape === "round" && "rounded-full",
        surface === "room" &&
          (off
            ? "bg-rose-500/18 text-rose-200 hover:bg-rose-500/28"
            : selected
              ? "bg-accent text-white shadow-[0_0_0_3px_rgba(14,124,114,0.28)] hover:bg-accent"
              : "bg-white/[0.07] text-slate-200 hover:bg-white/[0.12] hover:text-white"),
        surface === "light" &&
          (off
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
            : selected
              ? "bg-accent text-white shadow-[0_0_0_3px_rgba(14,124,114,0.18)] hover:bg-accent"
              : "border border-line bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-ink"),
        className,
      )}
      {...props}
    >
      {icon ? <Glyph icon={icon} size={glyphFor[size]} /> : children}
    </button>
  );

  if (disabled) return button;
  return <Tooltip content={tooltip ?? label}>{button}</Tooltip>;
}

export function LabeledControl({
  icon,
  label,
  hint,
  selected,
  on = true,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  selected?: boolean;
  on?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const id = useId();
  const button = (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      aria-label={hint ?? label}
      aria-pressed={selected || !on}
      className={cn(
        "ui-press group flex min-w-[56px] flex-col items-center gap-1 rounded-[12px] px-1.5 py-1 disabled:pointer-events-none disabled:opacity-45",
        selected || !on ? "text-white" : "text-slate-500 hover:text-slate-200",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-[11px] transition-[background-color,color,box-shadow] duration-150",
          !on
            ? "bg-rose-500/18 text-rose-200 shadow-[0_0_0_3px_rgba(244,63,94,0.16)] group-hover:bg-rose-500/28"
            : selected
              ? "bg-accent text-white shadow-[0_0_0_3px_rgba(14,124,114,0.28)]"
              : "bg-white/[0.07] text-slate-200 group-hover:bg-white/[0.12] group-hover:text-white",
        )}
      >
        <Glyph icon={icon} size="md" />
      </span>
      <span className="text-[10px] font-medium tracking-[0.04em]">{label}</span>
    </button>
  );

  if (disabled) return button;
  return <Tooltip content={hint ?? label} side="top">{button}</Tooltip>;
}

export function ModeButton({
  icon,
  label,
  hint,
  selected,
  onClick,
  compact = false,
  className,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Tooltip content={hint ?? label} className={cn(compact ? className : "w-full")}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={hint ?? label}
        className={cn(
          "ui-press group relative text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          compact
            ? "flex h-10 w-full items-center gap-2 rounded-[12px] px-2.5"
            : "flex w-full flex-col items-center gap-1.5 rounded-[14px] px-1 py-2",
          selected
            ? "bg-accent/18 text-white ring-1 ring-accent/45"
            : "text-slate-500 ring-1 ring-transparent hover:bg-white/[0.05] hover:text-slate-200",
          !compact && className,
        )}
      >
      <span
        className={cn(
          "grid place-items-center rounded-[10px] transition-[background-color,color,box-shadow] duration-150",
          compact ? "size-7" : "size-8",
          selected
            ? "bg-accent text-white shadow-[0_0_0_3px_rgba(14,124,114,0.28)]"
            : "bg-white/[0.05] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-slate-100",
        )}
      >
        <Glyph icon={icon} size={compact ? "sm" : "md"} />
      </span>
      <span
        className={cn(
          "font-medium tracking-[0.02em]",
          compact ? "text-[12px]" : "text-[10px] leading-none",
          selected && "text-white",
        )}
      >
        {label}
      </span>
      </button>
    </Tooltip>
  );
}

export function IconWell({
  icon,
  size = "md",
  className,
  children,
}: {
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "grid place-items-center text-slate-600",
        size === "sm" && "size-8 rounded-[9px]",
        size === "md" && "size-9 rounded-[10px]",
        size === "lg" && "size-11 rounded-[12px]",
        className,
      )}
    >
      {icon ? (
        <Glyph icon={icon} size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"} />
      ) : (
        children
      )}
    </span>
  );
}
