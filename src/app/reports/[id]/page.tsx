import { ReportDetail } from "@/components/reports/report-detail";
import { reports } from "@/lib/data";

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportDetail id={id} />;
}
