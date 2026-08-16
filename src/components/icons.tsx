"use client";

import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
  caption,
  selected = false,
  on = true,
  surface = "room",
  size = "md",
  shape = "square",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  label: string;
  caption?: string;
  selected?: boolean;
  on?: boolean;
  surface?: "room" | "light";
  size?: IconButtonSize;
  shape?: "square" | "round";
}) {
  const off = !on;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected || off}
      title={label}
      className={cn(
        "ui-press grid place-items-center disabled:pointer-events-none disabled:opacity-40",
        hit[size],
        shape === "round" && "rounded-full",
        surface === "room" &&
          (off
            ? "bg-rose-500/18 text-rose-200 hover:bg-rose-500/28"
            : selected
              ? "bg-white text-ink hover:bg-white"
              : "bg-white/[0.07] text-slate-200 hover:bg-white/[0.12] hover:text-white"),
        surface === "light" &&
          (off
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
            : selected
              ? "bg-ink text-white hover:bg-slate-800"
              : "border border-line bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-ink"),
        className,
      )}
      {...props}
    >
      {icon ? <Glyph icon={icon} size={glyphFor[size]} /> : children}
      {caption ? <span className="sr-only">{caption}</span> : null}
    </button>
  );
}

export function LabeledControl({
  icon,
  label,
  selected,
  on = true,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  on?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected || !on}
      className={cn(
        "ui-press group flex min-w-[52px] flex-col items-center gap-1 rounded-[12px] px-2 py-1.5 disabled:pointer-events-none disabled:opacity-40",
        "text-slate-500 hover:text-slate-200",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-[11px] transition-[background-color,color,box-shadow] duration-150",
          !on
            ? "bg-rose-500/18 text-rose-200 group-hover:bg-rose-500/28"
            : selected
              ? "bg-white text-ink shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
              : "bg-white/[0.07] text-slate-200 group-hover:bg-white/[0.12] group-hover:text-white",
        )}
      >
        <Glyph icon={icon} size="md" />
      </span>
      <span className="text-[10px] font-medium tracking-[0.04em]">{label}</span>
    </button>
  );
}

export function ModeButton({
  icon,
  label,
  selected,
  onClick,
  compact = false,
  className,
}: {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "ui-press group relative text-left",
        compact
          ? "flex h-9 items-center gap-2 rounded-[10px] px-2.5"
          : "flex w-full flex-col items-center gap-1.5 rounded-[14px] px-1.5 py-2.5 sm:px-1",
        selected
          ? "bg-white/[0.09] text-white"
          : "text-slate-500 hover:bg-white/[0.045] hover:text-slate-200",
        className,
      )}
    >
      {selected ? (
        <span
          className={cn(
            "absolute rounded-full bg-accent",
            compact ? "inset-y-1.5 left-0 w-[2px]" : "left-1 top-2 bottom-2 w-[2px] sm:left-0.5",
          )}
        />
      ) : null}
      <span
        className={cn(
          "grid place-items-center rounded-[10px] transition-[background-color,color] duration-150",
          compact ? "size-7" : "size-8",
          selected
            ? "bg-accent text-white"
            : "bg-white/[0.05] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-slate-100",
        )}
      >
        <Glyph icon={icon} size={compact ? "sm" : "md"} />
      </span>
      <span
        className={cn(
          "font-medium tracking-[0.02em]",
          compact ? "text-[12px]" : "text-[10px] leading-none",
        )}
      >
        {label}
      </span>
    </button>
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
