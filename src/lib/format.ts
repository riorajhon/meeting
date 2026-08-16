import type { SessionStatus, SessionType, UserRole } from "./types";

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const roleLabel: Record<UserRole, string> = {
  investor: "Investor",
  client: "Client",
  candidate: "Candidate",
  company: "Company",
};

export const typeLabel: Record<SessionType, string> = {
  investor: "Investor meeting",
  client_review: "Client review",
  interview: "Candidate interview",
  freelancer: "Freelancer / agency",
  assessment: "Technical assessment",
};

export const statusLabel: Record<SessionStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  live: "Live",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function statusTone(
  status: SessionStatus,
): "slate" | "teal" | "amber" | "rose" {
  if (status === "live") return "rose";
  if (status === "draft" || status === "cancelled") return "amber";
  if (status === "completed" || status === "cancelled") return "slate";
  return "teal";
}

export function avatarColor(hue: number) {
  return `hsl(${hue} 42% 36%)`;
}

export const recLabel: Record<
  "strong_yes" | "yes" | "lean_yes" | "no" | "hold",
  string
> = {
  strong_yes: "Strong yes",
  yes: "Yes",
  lean_yes: "Lean yes",
  no: "No",
  hold: "Hold",
};

export const recTone: Record<
  "strong_yes" | "yes" | "lean_yes" | "no" | "hold",
  "slate" | "teal" | "amber" | "rose" | "blue" | "violet" | "emerald"
> = {
  strong_yes: "emerald",
  yes: "teal",
  lean_yes: "blue",
  no: "rose",
  hold: "amber",
};
