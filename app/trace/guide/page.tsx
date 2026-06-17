import { OuroxShell } from "@/components/ourox/OuroxShell";
import { TraceGuidePage } from "@/components/trace/guide/TraceGuidePage";

export const metadata = {
  title: "Reviewer Guide — Trace Recovery · Ourox",
  description:
    "Ourox Trace reviewer guide: recovery mindset, co-mingling methods, VASP attribution, AI assist boundaries, and synthetic demo scope.",
};

export default function TraceGuideRoute() {
  return (
    <OuroxShell currentProduct="Trace">
      <div className="flex-1 bg-trace-page">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <TraceGuidePage />
        </div>
      </div>
    </OuroxShell>
  );
}
