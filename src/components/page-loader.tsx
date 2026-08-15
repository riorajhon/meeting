import { cn } from "@/lib/cn";

export function LoadingMark({
  size = 72,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("loader-mark", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <rect width="64" height="64" rx="14" fill="#0B1220" />
        <circle
          className="loader-ring"
          cx="32"
          cy="32"
          r="22"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="40 100"
        />
        <g className="loader-core">
          <path
            d="M47.5 17.2a19.2 19.2 0 1 0 2.4 26.8"
            fill="none"
            stroke="#14B8A6"
            strokeWidth="5.4"
            strokeLinecap="round"
          />
          <path
            d="M43.2 22.6a12.6 12.6 0 1 0 2.1 17.4"
            fill="none"
            stroke="#5EEAD4"
            strokeWidth="3.1"
            strokeLinecap="round"
          />
          <path d="M48.8 32 40.8 27.4v9.2L48.8 32Z" fill="#F8FAFC" />
          <path
            d="M42.6 16.8 49.2 10.4"
            stroke="#E8B84A"
            strokeWidth="3.1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

export function PageLoader({
  label = "Loading",
  variant = "app",
  overlay = false,
}: {
  label?: string;
  variant?: "app" | "dark";
  overlay?: boolean;
}) {
  const dark = variant === "dark";
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "grid place-items-center",
        overlay
          ? "fixed inset-0 z-[90] backdrop-blur-sm"
          : "min-h-[52vh] w-full py-24",
        overlay && (dark ? "bg-[#05070d]/70" : "bg-white/72"),
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingMark size={overlay ? 76 : 72} />
        <p
          className={cn(
            "loader-label text-[13px] font-medium tracking-[0.16em] uppercase",
            dark ? "text-slate-300" : "text-slate-500",
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
