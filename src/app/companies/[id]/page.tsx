import { CompanyProfile } from "@/components/companies/company-profile";
import { companies } from "@/lib/data";

export function generateStaticParams() {
  return companies.map((company) => ({ id: company.id }));
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyProfile id={id} />;
}
