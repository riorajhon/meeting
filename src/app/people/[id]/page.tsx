import { PersonProfile } from "@/components/people/person-profile";
import { people } from "@/lib/data";

export function generateStaticParams() {
  return people.map((person) => ({ id: person.id }));
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PersonProfile id={id} />;
}
