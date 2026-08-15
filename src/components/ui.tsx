import { cn } from "@/lib/cn";
import { avatarColor, initials } from "@/lib/format";
import type { SessionStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Card({
  children,
  className,
  padded = true,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-card shadow-[0_1px_0_rgba(17,19,24,0.03)]",
        padded && "p-5",
        hover &&
          "transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[0_10px_28px_rgba(17,19,24,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dark" | "light";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "icon";
}) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-45",
        size === "sm" && "h-8 rounded-lg px-3 text-xs",
        size === "md" && "h-9 rounded-[10px] px-3.5 text-[13px]",
        size === "lg" && "h-11 rounded-[11px] px-5 text-sm",
        size === "icon" && "size-9 rounded-[10px]",
        variant === "primary" &&
          "bg-accent text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset] hover:bg-[#0b6b63]",
        variant === "secondary" &&
          "border border-line bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
        variant === "dark" && "bg-ink text-white hover:bg-slate-800",
        variant === "light" && "bg-white text-slate-950 hover:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "slate",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: "slate" | "teal" | "amber" | "rose" | "blue" | "violet" | "emerald";
  className?: string;
  dot?: boolean;
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    teal: "bg-accent-soft text-[#0b6b63]",
    amber: "bg-amber-50 text-amber-800",
    rose: "bg-rose-50 text-rose-700",
    blue: "bg-sky-50 text-sky-800",
    violet: "bg-violet-50 text-violet-800",
    emerald: "bg-emerald-50 text-emerald-800",
  };
  const dots = {
    slate: "bg-slate-400",
    teal: "bg-accent",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    blue: "bg-sky-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
  };
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "size-1.5 rounded-full",
            dots[tone],
            tone === "rose" && "live-dot",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: SessionStatus }) {
  const map = {
    live: { tone: "rose" as const, label: "Live" },
    scheduled: { tone: "teal" as const, label: "Scheduled" },
    draft: { tone: "amber" as const, label: "Draft" },
    completed: { tone: "slate" as const, label: "Completed" },
    cancelled: { tone: "amber" as const, label: "Cancelled" },
  };
  const item = map[status];
  return (
    <Badge tone={item.tone} dot>
      {item.label}
    </Badge>
  );
}

export function Avatar({
  name,
  hue,
  src,
  size = "md",
  className,
}: {
  name: string;
  hue: number;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ring-1 ring-black/10",
        size === "sm" && "size-7 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-11 text-sm",
        size === "xl" && "size-16 text-lg",
        size === "2xl" && "size-24 text-xl",
        className,
      )}
      style={src ? undefined : { background: avatarColor(hue) }}
    >
      {src ? (
        <Image src={src} alt={name} width={112} height={112} className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-medium text-slate-600">{children}</label>
  );
}

const fieldClass =
  "h-10 w-full rounded-[10px] border border-line bg-white px-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/15";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldClass, "h-auto min-h-[96px] py-2.5", className)} {...props} />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, className)} {...props} />;
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("kicker", className)}>{children}</p>;
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[13px] font-semibold tracking-tight text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  kicker,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? <Kicker className="mb-2">{kicker}</Kicker> : null}
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-6 text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-line bg-white px-6 py-16 text-center">
      {Icon ? (
        <span className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-slate-50 text-slate-500">
          <Icon size={20} />
        </span>
      ) : null}
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-6 text-muted">{body}</p>
    </div>
  );
}

export function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium tabular-nums text-slate-600">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export function IconTile({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-[10px] bg-slate-50 text-slate-600",
        className,
      )}
    >
      <Icon size={16} />
    </span>
  );
}
