import { OuroxShell } from "@/components/ourox/OuroxShell";
import { OpsGuidePage } from "@/components/ops/guide/OpsGuidePage";

export const metadata = {
  title: "Ops Guide — Fraud Operations · Ourox",
  description:
    "How Ourox Ops works: intake streams, queue priority, SLA and aging, roster coverage, fair KPIs, and synthetic boundaries.",
};

export default function OpsGuideRoute() {
  return (
    <OuroxShell currentProduct="Ops">
      <OpsGuidePage />
    </OuroxShell>
  );
}
