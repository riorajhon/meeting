import { cn } from "@/lib/cn";

type Variant = "dark" | "light";

export function BrandMark({
  size = 48,
  className,
  variant = "dark",
}: {
  size?: number;
  className?: string;
  variant?: Variant;
}) {
  const src = variant === "light" ? "/brand/mark-light.png" : "/brand/mark.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-[14px] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.28)]", className)}
    />
  );
}

export function BrandLockup({
  subtitle,
  size = 48,
  inverted = true,
  wordmarkClassName,
}: {
  subtitle?: string;
  size?: number;
  inverted?: boolean;
  wordmarkClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={size} variant={inverted ? "dark" : "light"} />
      <span>
        <span
          className={cn(
            "block font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
            wordmarkClassName ?? "text-[13px]",
          )}
        >
          Caliber
        </span>
        {subtitle ? (
          <span
            className={cn(
              "block text-[10px] leading-none",
              inverted ? "text-slate-500" : "text-muted",
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
