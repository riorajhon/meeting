"use client";

import { Glyph } from "@/components/icons";
import { AppProvider, useApp } from "@/context/app-context";
import { cn } from "@/lib/cn";
import { roleLabel } from "@/lib/format";
import { notifications } from "@/lib/data";
import { BrandLockup, BrandMark } from "@/components/brand-mark";
import { NavigationLoader } from "@/components/navigation-loader";
import { Avatar, Button, Input } from "@/components/ui";
import type { UserRole } from "@/lib/types";
import { formatTime } from "@/lib/format";
import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LucideProvider,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/people", label: "People", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/reports", label: "Reports", icon: ClipboardCheck },
];

const roles: UserRole[] = ["company", "investor", "client", "candidate"];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <LucideProvider strokeWidth={1.75} absoluteStrokeWidth>
      <AppProvider>
        <NavigationLoader />
        <ShellFrame>{children}</ShellFrame>
      </AppProvider>
    </LucideProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isRoom = pathname.includes("/room");
  const isMarketing = pathname === "/";
  if (isRoom) return <div className="h-full min-h-screen bg-[#070b12]">{children}</div>;
  if (isMarketing) return <>{children}</>;
  return <PlatformFrame>{children}</PlatformFrame>;
}

function PlatformFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { me, role, setRole } = useApp();
  const [open, setOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const router = useRouter();

  const active = useMemo(() => {
    return nav.find((item) =>
      item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href),
    )?.href;
  }, [pathname]);

  const settingsActive = pathname.startsWith("/settings");

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-ink text-slate-200 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-white/5">
            <BrandLockup subtitle="Meetings & assessments" size={48} wordmarkClassName="text-[15px]" />
          </Link>
          <button
            className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Glyph icon={X} size="md" />
          </button>
        </div>

        <p className="kicker px-5 pb-2 pt-3 text-slate-500">Workspace</p>
        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "ui-press relative flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px]",
                  isActive
                    ? "bg-white/[0.08] font-medium text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
                )}
              >
                {isActive ? (
                  <span className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-accent" />
                ) : null}
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-[8px]",
                    isActive ? "bg-accent/20 text-white" : "text-slate-400",
                  )}
                >
                  <Glyph icon={Icon} size="md" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-2">
          <Link
            href="/settings"
            className={cn(
              "ui-press flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px]",
              settingsActive
                ? "bg-white/[0.08] font-medium text-white"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
            )}
          >
            <Glyph icon={Settings} size="md" />
            Settings
          </Link>
        </div>

        <div className="border-t border-white/10 p-3">
          <p className="kicker mb-2 px-1 text-slate-500">View as</p>
          <div className="grid grid-cols-2 gap-1">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "h-7 rounded-lg px-2 text-[11px] font-medium transition-colors",
                  role === r
                    ? "bg-accent text-white"
                    : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white",
                )}
              >
                {roleLabel[r]}
              </button>
            ))}
          </div>
          <Link
            href={`/people/${me.id}`}
            className="mt-3 flex items-center gap-2.5 rounded-[10px] p-1.5 hover:bg-white/[0.05]"
          >
            <Avatar name={me.name} hue={me.avatarHue} src={me.avatar} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-medium text-white">{me.name}</span>
              <span className="block truncate text-[11px] text-slate-500">{me.title}</span>
            </span>
          </Link>
        </div>
      </aside>

      {open ? (
        <button
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close overlay"
        />
      ) : null}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <button
            className="grid size-9 place-items-center rounded-[10px] border border-line text-slate-600 hover:bg-slate-50 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Glyph icon={Menu} size="md" />
          </button>
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <BrandMark size={40} />
            <span className="text-[15px] font-semibold tracking-tight text-ink">Caliber</span>
          </Link>
          <div className="relative max-w-md flex-1">
            <Glyph
              icon={Search}
              size="md"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search sessions, people, companies…"
              className="h-9 border-slate-200/80 bg-slate-50/80 pl-9 focus:bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push("/sessions");
              }}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setNotesOpen((v) => !v)}
                aria-label="Notifications"
                className={notesOpen ? "border-slate-300 bg-slate-50" : ""}
              >
                <Glyph icon={Bell} size="md" />
              </Button>
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
              {notesOpen ? (
                <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_16px_40px_rgba(17,19,24,0.12)]">
                  <div className="border-b border-line px-3.5 py-2.5">
                    <p className="text-[13px] font-semibold">Notifications</p>
                  </div>
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setNotesOpen(false)}
                      className="block px-3.5 py-3 hover:bg-slate-50"
                    >
                      <p className="text-[13px] font-medium text-slate-800">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{formatTime(n.at)}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href="/sessions/new">
              <Button>
                <Glyph icon={Plus} size="md" />
                <span className="hidden sm:inline">New session</span>
              </Button>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
