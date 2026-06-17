import { OuroxShell } from "@/components/ourox/OuroxShell";
import { TraceLanding } from "@/components/trace/TraceLanding";

export const metadata = {
  title: "Trace — Recovery Workflow · Ourox",
  description:
    "Ourox Trace: AI-assisted post-vendor recovery tracing workflow. Synthetic data only.",
};

export default function TracePage() {
  return (
    <OuroxShell currentProduct="Trace">
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <TraceLanding />
      </div>
    </OuroxShell>
  );
}
