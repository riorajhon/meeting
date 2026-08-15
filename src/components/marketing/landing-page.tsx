"use client";

import { BrandMark } from "@/components/brand-mark";
import { LoadingMark } from "@/components/page-loader";
import { Reveal } from "@/components/marketing/reveal";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { people } from "@/lib/data";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Globe2,
  LayoutGrid,
  Menu,
  MessageSquare,
  MonitorUp,
  PenTool,
  Radio,
  ShieldCheck,
  Sparkles,
  Video,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const person = (id: string) => people.find((p) => p.id === id)!;

const products = [
  {
    id: "meet",
    label: "Meeting rooms",
    title: "Participant layouts that feel like a real session",
    body: "Gallery and speaker views, presence, chat, and simulated screen share — without third-party meeting SDKs.",
    href: "/sessions/s2/room",
    icon: Video,
  },
  {
    id: "code",
    label: "Coding tests",
    title: "A live assessment workspace in the same room",
    body: "Problem prompt, editor, language switch, and mocked test results so hiring loops stay in one surface.",
    href: "/sessions/s2/room",
    icon: Code2,
  },
  {
    id: "board",
    label: "Whiteboard",
    title: "System design without leaving the call",
    body: "Draw, stamp architecture nodes, and walk a design with evaluators watching in real time.",
    href: "/sessions/s2/room",
    icon: PenTool,
  },
  {
    id: "score",
    label: "Scorecards",
    title: "Private notes, ratings, and published reports",
    body: "Structured questions, recommendation, and a report the hiring committee or investment team can share.",
    href: "/reports",
    icon: LayoutGrid,
  },
];

const useCases = [
  {
    title: "Investor meetings",
    kicker: "Diligence",
    text: "Founder walkthroughs, architecture reviews, and investment memos in one session.",
    href: "/sessions/s1",
    image: "/marketing/investor.png",
  },
  {
    title: "Client reviews",
    kicker: "Enterprise",
    text: "Technical due diligence, SLAs, and expansion decisions with vendors.",
    href: "/sessions/s3",
    image: "/marketing/client.png",
  },
  {
    title: "Hiring loops",
    kicker: "Interviews",
    text: "Coding, system design, evaluation, and debrief — without extra tools.",
    href: "/sessions/s2",
    image: "/marketing/hiring.png",
  },
  {
    title: "Agency evaluations",
    kicker: "Partners",
    text: "Portfolio, workshop, commercials, and a scored recommendation.",
    href: "/sessions/s4",
    image: "/marketing/agency.png",
  },
];

const logos = [
  "Meridian Labs",
  "Northbridge",
  "Helix Health",
  "Brightline",
  "Lumen Pay",
  "Caliber Cloud",
  "Atlas Ventures",
  "Forge Systems",
];

export function LandingPage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(products[0].id);
  const active = products.find((p) => p.id === tab) ?? products[0];
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="border-b border-white/10 bg-[#0a1224]/80 text-center text-[13px] text-slate-300">
        <Link
          href="/sessions/s2/room"
          className="inline-flex items-center gap-2 px-4 py-2.5 hover:text-white"
        >
          <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
            Live
          </span>
          Staff Engineer loop with Sam Okonkwo is in progress
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070d]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-5">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size={52} className="rounded-[14px]" />
            <span className="text-lg font-semibold tracking-tight">Caliber</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <a href="#product" className="hover:text-white">
              Product
            </a>
            <a href="#solutions" className="hover:text-white">
              Solutions
            </a>
            <a href="#stories" className="hover:text-white">
              Customers
            </a>
            <Link href="/sessions" className="hover:text-white">
              Sessions
            </Link>
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-full bg-[#2f8cff] px-5 text-sm font-semibold text-white hover:bg-[#4b9dff]"
            >
              Get started
            </Link>
          </div>
          <button
            className="ml-auto grid size-10 place-items-center rounded-full border border-white/15 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {open ? (
          <div className="grid gap-2 border-t border-white/10 px-5 py-4 text-sm lg:hidden">
            <a href="#product">Product</a>
            <a href="#solutions">Solutions</a>
            <Link href="/dashboard">Open workspace</Link>
            <Link
              href="/dashboard"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#2f8cff] font-semibold"
            >
              Get started
            </Link>
          </div>
        ) : null}
      </header>

      <section className="relative min-h-[100svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-55 ken-in"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/50 via-[#05070d]/55 to-[#05070d]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="orb-drift absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="orb-drift-delay absolute right-[-80px] top-32 h-[520px] w-[520px] rounded-full bg-blue-600/30 blur-[140px]" />
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-[88rem] flex-col px-5 pb-16 pt-12 text-center sm:pt-16">
          <div className="mark-in mb-7 flex justify-center">
            <LoadingMark size={96} />
          </div>
          <p className="hero-rise mb-5 text-sm font-medium text-cyan-300" style={{ animationDelay: "120ms" }}>
            Professional meetings & assessments
          </p>
          <h1
            className="hero-rise mx-auto max-w-5xl text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[84px]"
            style={{ animationDelay: "200ms" }}
          >
            Build real-time
            <br />
            interviews, reviews
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
              &amp; live assessments
            </span>
          </h1>
          <p
            className="hero-rise mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
            style={{ animationDelay: "340ms" }}
          >
            The workspace powering investor meetings, client technical reviews, hiring loops, and
            agency evaluations — with rooms, coding, whiteboard, and scorecards in one place.
          </p>
          <div className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "460ms" }}>
            <Link
              href="/dashboard"
              className="cta-glow inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Open workspace <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sessions/s2/room"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Join a live room
            </Link>
          </div>

          <div className="hero-rise mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3" style={{ animationDelay: "560ms" }}>
            {[
              { icon: Zap, value: "One room", hint: "Video, chat, share, code, board" },
              { icon: Globe2, value: "Four views", hint: "Investor, client, company, candidate" },
              { icon: ShieldCheck, value: "Ready later", hint: "Mocked now, API-shaped for your stack" },
            ].map((item) => (
              <div key={item.value} className="flex gap-3">
                <item.icon className="mt-0.5 size-5 text-cyan-300" />
                <div>
                  <p className="font-semibold">{item.value}</p>
                  <p className="text-sm text-slate-400">{item.hint}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-rise mt-12 w-full" style={{ animationDelay: "640ms" }}>
            <HeroStage large />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 py-8">
        <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Trusted in workflows like these organizations
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max gap-16 pr-16 text-lg font-semibold tracking-tight text-slate-500">
            {[...logos, ...logos].map((name, i) => (
              <span key={`${name}-${i}`} className="whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-semibold text-cyan-300">Live session footage</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Real video in the room — not placeholders
          </h2>
        </Reveal>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-[24px] lg:col-span-2">
            <div className="aspect-video">
              <LoopVideo src="/videos/hero.mp4" />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold">
              LIVE
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-sm">
              Staff Engineer loop
            </span>
          </div>
          <div className="grid gap-3">
            {[
              ["/videos/call-1.mp4", "Interviewer"],
              ["/videos/call-2.mp4", "Observer"],
              ["/videos/call-3.mp4", "Hiring manager"],
            ].map(([src, label]) => (
              <div key={label} className="relative overflow-hidden rounded-[24px]">
                <div className="aspect-video">
                  <LoopVideo src={src} />
                </div>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <p className="text-sm font-semibold text-cyan-300">Caliber Real-Time Workspace</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Deploy sessions on infrastructure-shaped UI — without a meeting SDK
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              This phase is frontend: rooms, assessments, and evaluation chrome with mock media.
              Layouts are structured so your own backend, media plane, and AI layer can connect later.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Investor and client rooms with private evaluator notes",
                "Coding tests and system-design boards in the same session",
                "Role-aware dashboards for every participant type",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140} className="float-slow">
            <HeroStage />
          </Reveal>
        </div>
      </section>

      <section id="product" className="bg-[#f4f6fa] text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <Reveal className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Easily run live communication and evaluation
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Modular surfaces — video, screen, coding, whiteboard, questions, scorecards — compose
              into each session type.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setTab(p.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium",
                  tab === p.id
                    ? "bg-[#05070d] text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-6 overflow-hidden rounded-[28px] bg-[#0b1220] p-6 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <ActiveIcon className="size-8 text-cyan-300" />
              <h3 className="mt-5 text-3xl font-semibold tracking-tight">{active.title}</h3>
              <p className="mt-3 max-w-lg text-slate-300">{active.body}</p>
              <Link
                href={active.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Open this surface <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <ProductPreview id={active.id} />
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <Reveal className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Use cases
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Bring any professional session to life
              </h2>
            </div>
            <Link href="/sessions" className="hidden text-sm font-semibold text-sky-700 sm:block">
              View all sessions
            </Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {useCases.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <Link
                  href={item.href}
                  className="group block overflow-hidden rounded-[24px] bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                      {item.kicker}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition-all group-hover:gap-2">
                      Open session <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#05070d]">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Grow with the leading workspace
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Powering live evaluation
              <br />
              <span className="text-slate-500">for interviews, diligence, and reviews</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ["Simulated media", "Video, share, and recording chrome with no vendor SDK."],
              ["Typed domain", "People, companies, sessions, scorecards — swap mocks for APIs."],
              ["Role-aware UI", "Investor, client, company, and candidate views from day one."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.08]">
                  <Sparkles className="size-5 text-cyan-300" />
                  <p className="mt-4 font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="bg-[#f4f6fa] text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight">People on Caliber</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                quote:
                  "We needed founder sessions and technical diligence in the same place. Caliber’s room plus scorecard is the briefing we actually use.",
                id: "u2",
              },
              {
                quote:
                  "Vendor architecture reviews used to live in five tools. The Helix loop now has agenda, whiteboard, and a shared report.",
                id: "u3",
              },
              {
                quote:
                  "The coding workspace in the interview room is enough to run a staff loop without sending candidates somewhere else.",
                id: "u6",
              },
            ].map((item, i) => {
              const p = person(item.id);
              return (
                <Reveal key={item.id} delay={i * 90}>
                  <figure className="h-full rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-slate-200/80 transition-transform duration-500 hover:-translate-y-1">
                    <blockquote className="text-[17px] leading-8 text-slate-700">“{item.quote}”</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <Avatar name={p.name} hue={p.avatarHue} src={p.avatar} />
                      <span>
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block text-xs text-slate-500">{p.title}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="get-started" className="bg-[#05070d]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="rounded-[32px] bg-gradient-to-br from-[#1d4ed8] via-[#0e7490] to-[#134e4a] p-10 sm:p-14">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Get started with a live workspace
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Open the dashboard, join the Staff Engineer room, or create a session. You do not need
              a meeting vendor to explore the UI.
            </p>
            <Link
              href="/dashboard"
              className="cta-glow mt-8 inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950"
            >
              Try the platform
            </Link>
          </Reveal>
          <Reveal delay={120} className="grid gap-4">
            <Link href="/sessions/new" className="rounded-[28px] border border-white/10 bg-white/5 p-7 hover:bg-white/10">
              <p className="font-semibold">Create a session</p>
              <p className="mt-2 text-sm text-slate-400">Wizard for type, people, and modules.</p>
            </Link>
            <Link href="/sessions/s2/room" className="rounded-[28px] border border-white/10 bg-white/5 p-7 hover:bg-white/10">
              <p className="font-semibold">Talk to a live room</p>
              <p className="mt-2 text-sm text-slate-400">Join the in-progress engineering loop.</p>
            </Link>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#05070d]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-3 font-semibold">
              <BrandMark size={44} />
              Caliber
            </p>
            <p className="mt-3 text-sm text-slate-500">Meetings and assessments for professional teams.</p>
          </div>
          {[
            {
              title: "Product",
              links: [
                ["Dashboard", "/dashboard"],
                ["Sessions", "/sessions"],
                ["Reports", "/reports"],
                ["People", "/people"],
              ],
            },
            {
              title: "Solutions",
              links: [
                ["Investor meetings", "/sessions/s1"],
                ["Client reviews", "/sessions/s3"],
                ["Interviews", "/sessions/s2"],
                ["Agencies", "/sessions/s4"],
              ],
            },
            {
              title: "Workspace",
              links: [
                ["Settings", "/settings"],
                ["Companies", "/companies"],
                ["Live room", "/sessions/s2/room"],
                ["New session", "/sessions/new"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-7xl px-5 pb-10 text-xs text-slate-600">
          Frontend phase. Media, code execution, and AI are simulated. © 2026 Caliber.
        </p>
      </footer>
    </div>
  );
}

function LoopVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <video
      src={src}
      className={cn("h-full w-full object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

function HeroStage({ large = false }: { large?: boolean }) {
  return (
    <div
      className={cn(
        "border border-white/10 bg-[#0b1220] shadow-[0_40px_120px_rgba(15,23,42,0.45)]",
        large ? "rounded-[28px] p-3 sm:p-5" : "rounded-[32px] p-4",
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <Radio className="size-3 text-rose-400" /> Staff Engineer — live
        </span>
        <span>Real video · 12:18</span>
      </div>
      <div className="relative overflow-hidden rounded-2xl">
        <div className={large ? "aspect-[16/8] min-h-[280px] sm:min-h-[420px] lg:min-h-[520px]" : "aspect-video"}>
          <LoopVideo src="/videos/hero.mp4" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] text-white">
          Sam Okonkwo · Candidate
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-semibold">
          LIVE
        </span>
        <div className={cn("absolute bottom-3 right-3 flex gap-2", large && "bottom-4 right-4 gap-3")}>
          {[
            ["/videos/call-1.mp4", "Marcus"],
            ["/videos/call-2.mp4", "Hannah"],
            ["/videos/call-3.mp4", "Alex"],
          ].map(([src, name]) => (
            <div
              key={name}
              className={cn(
                "relative overflow-hidden rounded-xl ring-1 ring-white/20",
                large ? "h-28 w-40 sm:h-32 sm:w-48" : "h-20 w-28",
              )}
            >
              <LoopVideo src={src} />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[10px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {[Video, MessageSquare, MonitorUp, Radio].map((Icon, i) => (
          <span key={i} className="grid size-9 place-items-center rounded-full bg-white/10">
            <Icon className="size-4" />
          </span>
        ))}
        <Link
          href="/sessions/s2/room"
          className="grid h-9 place-items-center rounded-full bg-rose-600 px-4 text-xs font-medium"
        >
          Join room
        </Link>
      </div>
    </div>
  );
}

function ProductPreview({ id }: { id: string }) {
  if (id === "code") {
    return (
      <pre className="overflow-auto font-mono text-[12px] leading-6 text-cyan-100/90">
{`function mergeIntervals(items) {
  const sorted = [...items].sort((a, b) => a[0] - b[0]);
  const out = [sorted[0]];
  // run tests — simulated
}`}
      </pre>
    );
  }
  if (id === "board") {
    return (
      <div className="grid h-48 grid-cols-3 gap-2 room-grid rounded-2xl p-3">
        {["Client", "API", "Scorecard"].map((n) => (
          <div key={n} className="h-14 rounded-xl border border-cyan-400/30 bg-[#102033] px-2 py-3 text-xs">
            {n}
          </div>
        ))}
      </div>
    );
  }
  if (id === "score") {
    return (
      <div className="space-y-4 p-2">
        {["Signal", "Communication", "Role fit"].map((label, i) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-slate-300">
              <span>{label}</span>
              <span>{[4, 5, 4][i]} / 5</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${[80, 100, 80][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="aspect-video">
        <LoopVideo src="/videos/hero.mp4" />
      </div>
    </div>
  );
}
