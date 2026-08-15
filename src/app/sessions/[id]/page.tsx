import { SessionDetailView } from "@/components/sessions/session-detail-view";
import { sessions } from "@/lib/data";

export function generateStaticParams() {
  return sessions.map((session) => ({ id: session.id }));
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SessionDetailView id={id} />;
}
