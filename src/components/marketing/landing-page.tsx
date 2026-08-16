"use client";

import { Glyph, IconWell } from "@/components/icons";
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
  ClipboardCheck,
  Code2,
  FileText,
  Menu,
  MessageSquare,
  MonitorUp,
  Radio,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const person = (id: string) => people.find((p) => p.id === id)!;

const products = [
  {
    id: "meet",
    step: "01",
    label: "Meeting",
    title: "A professional room — not a generic video call",
    body: "Gallery and speaker layouts, presence, chat, and simulated share, designed for diligence and interviews rather than social meetings.",
    href: "/sessions/s2/room",
    icon: Video,
  },
  {
    id: "code",
    step: "02",
    label: "Assessment",
    title: "Code and system design stay in the same session",
    body: "Live coding, a structured whiteboard, and the candidate feed in one stage so hiring and review loops do not split across tools.",
    href: "/sessions/s2/room",
    icon: Code2,
  },
  {
    id: "eval",
    step: "03",
    label: "Evaluation",
    title: "Private scorecards while the room is still live",
    body: "Questions, ratings, and evaluator notes sit beside the meeting — visible to the committee, hidden from the candidate.",
    href: "/sessions/s2/room",
    icon: ClipboardCheck,
  },
  {
    id: "score",
    step: "04",
    label: "Decision",
    title: "A brief the committee can actually use",
    body: "Scores, findings, risks, and a recommendation publish as a decision document — not a dashboard widget.",
    href: "/reports",
    icon: FileText,
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
          <Glyph icon={ArrowRight} size="sm" />
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
            {open ? <Glyph icon={X} size="md" /> : <Glyph icon={Menu} size="md" />}
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
          <p className="hero-rise mb-5 text-sm font-medium text-teal-300" style={{ animationDelay: "120ms" }}>
            Professional meeting → Assessment → Evaluation → Decision
          </p>
          <h1
            className="hero-rise mx-auto max-w-5xl text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[80px]"
            style={{ animationDelay: "200ms" }}
          >
            The assessment room
            <br />
            for decisions that
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-sky-200 to-white bg-clip-text text-transparent">
              have to hold up
            </span>
          </h1>
          <p
            className="hero-rise mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
            style={{ animationDelay: "340ms" }}
          >
            Run a professional meeting, complete the assessment, capture evaluation, and publish a
            decision — in one workspace for hiring, diligence, and client reviews.
          </p>
          <div className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "460ms" }}>
            <Link
              href="/dashboard"
              className="cta-glow inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Open workspace <Glyph icon={ArrowRight} size="md" />
            </Link>
            <Link
              href="/sessions/s2/room"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Join a live room
            </Link>
          </div>

          <div className="hero-rise mx-auto mt-12 w-full max-w-4xl" style={{ animationDelay: "560ms" }}>
            <FlowStrip />
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
          <p className="text-sm font-semibold text-teal-300">01 · Professional meeting</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            The room is the work surface
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Live footage sits in the meeting stage. Assessment and evaluation attach to the same session.
          </p>
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
            <p className="text-sm font-semibold text-teal-300">How it connects</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              One session, from the room to the brief
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              This phase is frontend: rooms, assessments, and evaluation chrome with mock media.
              Layouts are structured so your own backend, media plane, and AI layer can connect later.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Professional meeting rooms with presence, share, and chat",
                "Assessment surfaces — coding and system design — in the same session",
                "Evaluation that publishes as a decision brief",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Glyph icon={CheckCircle2} size="md" className="mt-0.5 shrink-0 text-teal-400" />
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
            <p className="text-sm font-semibold tracking-[0.14em] text-teal-700 uppercase">
              Product flow
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Meeting, assessment, evaluation, decision
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Four stages in one product. Each session type composes the same surfaces — people,
              share, code, board, chat, and evaluate.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setTab(p.id)}
                className={cn(
                  "ui-press inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                  tab === p.id
                    ? "bg-[#05070d] text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900",
                )}
              >
                <span className={cn("tabular-nums text-[11px]", tab === p.id ? "text-teal-300" : "text-slate-400")}>
                  {p.step}
                </span>
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-6 overflow-hidden rounded-[28px] bg-[#0b1220] p-6 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <IconWell
                icon={ActiveIcon}
                size="lg"
                className="bg-white/[0.07] text-teal-300"
              />
              <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-teal-300 uppercase">
                {active.step} · {active.label}
              </p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight">{active.title}</h3>
              <p className="mt-3 max-w-lg text-slate-300">{active.body}</p>
              <Link
                href={active.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200"
              >
                Open this surface <Glyph icon={ArrowUpRight} size="md" />
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
                      Open session <Glyph icon={ArrowRight} size="md" />
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-400">
              The path to a decision
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Meet, assess, evaluate,
              <br />
              <span className="text-slate-500">then publish the brief</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ["Professional meeting", "Video, presence, share, and chat in a room built for assessment."],
              ["Assessment", "Coding and whiteboard stay on the same stage as the conversation."],
              ["Evaluation to decision", "Scorecards become a brief with findings, risks, and a recommendation."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.08]">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-400 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
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
            Open the dashboard, join a live room, or create a session. Follow the same path:
            professional meeting → assessment → evaluation → decision.
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

function FlowStrip() {
  const steps = [
    { n: "01", label: "Professional meeting", hint: "People, share, chat" },
    { n: "02", label: "Assessment", hint: "Code and board" },
    { n: "03", label: "Evaluation", hint: "Score while live" },
    { n: "04", label: "Decision", hint: "Publish the brief" },
  ];
  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.n}
          className="relative rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left"
        >
          {i < steps.length - 1 ? (
            <span className="flow-step-line absolute top-1/2 right-[-6px] hidden h-px w-3 sm:block" />
          ) : null}
          <p className="text-[10px] font-semibold tracking-[0.16em] text-teal-300">{step.n}</p>
          <p className="mt-1.5 text-[13px] font-semibold text-white">{step.label}</p>
          <p className="mt-0.5 text-[12px] text-slate-400">{step.hint}</p>
        </li>
      ))}
    </ol>
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
          <Glyph icon={Radio} size="xs" className="text-rose-400" /> Staff Engineer — live
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
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {(
          [
            [Video, "People"],
            [MessageSquare, "Chat"],
            [MonitorUp, "Share"],
            [ClipboardCheck, "Evaluate"],
          ] as const
        ).map(([Icon, label], i) => (
          <span
            key={label}
            className={cn(
              "grid size-9 place-items-center rounded-[10px] bg-white/10 text-slate-200",
              i === 0 && "bg-white text-ink",
            )}
            title={label}
          >
            <Glyph icon={Icon} size="md" />
          </span>
        ))}
        <Link
          href="/sessions/s2/room"
          className="ml-1 grid h-9 place-items-center rounded-[10px] bg-rose-600 px-4 text-xs font-medium"
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
  if (id === "eval") {
    return (
      <div className="space-y-3 p-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Live scorecard</span>
          <span className="text-teal-300">3.8 / 5</span>
        </div>
        {["Problem framing", "Architecture", "Trade-offs"].map((label, i) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-slate-300">
              <span>{label}</span>
              <span>{[4, 4, 3][i]} / 5</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-teal-400" style={{ width: `${[80, 80, 60][i]}%` }} />
            </div>
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
              <div className="h-full rounded-full bg-teal-400" style={{ width: `${[80, 100, 80][i]}%` }} />
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
