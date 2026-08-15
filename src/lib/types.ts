export type UserRole = "investor" | "client" | "candidate" | "company";

export type SessionType =
  | "investor"
  | "client_review"
  | "interview"
  | "freelancer"
  | "assessment";

export type SessionStatus = "draft" | "scheduled" | "live" | "completed" | "cancelled";

export type AssessmentModule =
  | "video"
  | "screen"
  | "coding"
  | "whiteboard"
  | "questions"
  | "scorecard"
  | "notes";

export type Person = {
  id: string;
  name: string;
  email: string;
  title: string;
  role: UserRole;
  companyId: string;
  location: string;
  timezone: string;
  bio: string;
  skills: string[];
  avatarHue: number;
  avatar: string;
};

export type Company = {
  id: string;
  name: string;
  kind: "startup" | "investor" | "enterprise" | "agency";
  industry: string;
  stage?: string;
  employees: string;
  location: string;
  website: string;
  summary: string;
  focus: string[];
};

export type SessionParticipant = {
  personId: string;
  meetingRole: "host" | "evaluator" | "candidate" | "observer" | "presenter";
  joined?: boolean;
  cameraOn?: boolean;
  micOn?: boolean;
  sharing?: boolean;
};

export type ScoreDimension = {
  id: string;
  label: string;
  score: number;
  max: number;
  notes?: string;
};

export type EvaluationQuestion = {
  id: string;
  prompt: string;
  kind: "scale" | "text" | "choice";
  options?: string[];
  answer?: string | number;
};

export type Session = {
  id: string;
  title: string;
  type: SessionType;
  status: SessionStatus;
  hostId: string;
  companyId: string;
  startsAt: string;
  durationMin: number;
  timezone: string;
  agenda: string[];
  modules: AssessmentModule[];
  participants: SessionParticipant[];
  location: "remote" | "hybrid";
  recordingEnabled: boolean;
};

export type Report = {
  id: string;
  sessionId: string;
  title: string;
  summary: string;
  recommendation: "strong_yes" | "yes" | "lean_yes" | "no" | "hold";
  overall: number;
  dimensions: ScoreDimension[];
  publishedAt: string;
  visibility: "private" | "shared";
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  authorId: string;
  body: string;
  at: string;
  private?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  at: string;
  href: string;
  read?: boolean;
};
