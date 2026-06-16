"use client";

import type { VerityOnChainTrace } from "@/lib/verity/agent-types";
import { getTraceSummary } from "@/lib/verity/onchain-trace";

interface VerityOnChainTraceSummaryProps {
  trace: VerityOnChainTrace;
}

export function VerityOnChainTraceSummary({ trace }: VerityOnChainTraceSummaryProps) {
  const summaryLine = getTraceSummary(trace);

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-signal-indigo">
        Forward trace
      </p>
      <p className="text-sm font-medium text-signal-ink">{summaryLine}</p>
      <p className="text-xs text-signal-secondary">{trace.traceLabel}</p>
    </div>
  );
}
