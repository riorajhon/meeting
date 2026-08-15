"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  people,
  roleUsers,
  seedChat,
  sessions as seedSessions,
} from "@/lib/data";
import type {
  ChatMessage,
  Person,
  Session,
  UserRole,
} from "@/lib/types";

type AppState = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  me: Person;
  sessions: Session[];
  addSession: (session: Session) => void;
  chat: ChatMessage[];
  sendChat: (message: Omit<ChatMessage, "id" | "at">) => void;
  notes: Record<string, string>;
  setNote: (sessionId: string, value: string) => void;
};

const AppContext = createContext<AppState | null>(null);

const defaultNotes: Record<string, string> = {
  s2: "Sam is structured. Watch time management on the coding exercise. Strong clarifying questions so far.",
  s1: "Northbridge cares most about retention cohorts and infra moat. Keep demo tight.",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("company");
  const [sessions, setSessions] = useState<Session[]>(seedSessions);
  const [chat, setChat] = useState<ChatMessage[]>(seedChat);
  const [notes, setNotes] = useState<Record<string, string>>(defaultNotes);

  const me = useMemo(
    () => people.find((p) => p.id === roleUsers[role]) ?? people[0],
    [role],
  );

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => [session, ...prev]);
  }, []);

  const sendChat = useCallback((message: Omit<ChatMessage, "id" | "at">) => {
    setChat((prev) => [
      ...prev,
      {
        ...message,
        id: `m${Date.now()}`,
        at: new Date().toISOString(),
      },
    ]);
  }, []);

  const setNote = useCallback((sessionId: string, value: string) => {
    setNotes((prev) => ({ ...prev, [sessionId]: value }));
  }, []);

  const value = useMemo(
    () => ({ role, setRole, me, sessions, addSession, chat, sendChat, notes, setNote }),
    [role, me, sessions, addSession, chat, sendChat, notes, setNote],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
