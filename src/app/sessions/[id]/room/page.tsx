import { MeetingRoom } from "@/components/meeting/meeting-room";
import { sessions } from "@/lib/data";

export function generateStaticParams() {
  return sessions.map((session) => ({ id: session.id }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MeetingRoom sessionId={id} />;
}
