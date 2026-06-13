import { OuroxShell } from "@/components/ourox/OuroxShell";
import { OpsWorkspace } from "@/components/ops/OpsWorkspace";

export const metadata = {
  title: "Ops — Fraud Operations · Ourox",
  description:
    "Ourox Ops: post-alert fraud operations queue board with SLA teaching. Synthetic data only.",
};

export default function OpsPage() {
  return (
    <OuroxShell currentProduct="Ops">
      <OpsWorkspace />
    </OuroxShell>
  );
}
