import { notFound } from "next/navigation";
import { OuroxShell } from "@/components/ourox/OuroxShell";
import { TraceCaseWorkspace } from "@/components/trace/TraceCaseWorkspace";
import { getTraceCaseById } from "@/data/trace/trace-cases";

interface TraceCasePageProps {
  params: { caseId: string };
}

export function generateMetadata({ params }: TraceCasePageProps) {
  const traceCase = getTraceCaseById(params.caseId);
  return {
    title: traceCase
      ? `${traceCase.caseId} — Trace Recovery · Ourox`
      : "Case not found — Trace · Ourox",
    description:
      "Ourox Trace recovery workflow workspace. Synthetic co-mingling method comparison and victim attribution.",
  };
}

export default function TraceCasePage({ params }: TraceCasePageProps) {
  const traceCase = getTraceCaseById(params.caseId);
  if (!traceCase) {
    notFound();
  }

  return (
    <OuroxShell currentProduct="Trace">
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <TraceCaseWorkspace traceCase={traceCase} />
      </div>
    </OuroxShell>
  );
}
