"use client";

import type { VerityOnChainTrace } from "@/lib/verity/agent-types";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { VerityOnChainTraceSummary } from "./VerityOnChainTraceSummary";
import { VerityOnChainTraceHopList } from "./VerityOnChainTraceHopList";
import { VerityOnChainRecoveryPoint } from "./VerityOnChainRecoveryPoint";
import { VerityOnChainRoadmapPanel } from "./VerityOnChainRoadmapPanel";
import { VerityOnChainGovernanceNote } from "./VerityOnChainGovernanceNote";
import { VerityOnChainTracingMethodologyPanel } from "./VerityOnChainTracingMethodologyPanel";

interface VerityOnChainTraceViewProps {
  trace: VerityOnChainTrace;
}

export function VerityOnChainTraceView({ trace }: VerityOnChainTraceViewProps) {
  return (
    <section
      aria-label="Forward trace"
      className="space-y-4 rounded-signalSm border border-signal-border bg-signal-surface px-4 py-4"
    >
      <VerityOnChainTraceSummary trace={trace} />

      <VerityAgentDisclosureSection title="Trace hop detail" defaultOpen={false}>
        <p className="mb-3 text-[13px] text-signal-slate">{trace.summary}</p>
        <p className="mb-3 text-xs text-signal-secondary">
          <span className="font-medium text-signal-body">Ledger note: </span>
          {trace.ledgerAwarenessNote}
        </p>
        <VerityOnChainTraceHopList
          hops={trace.hops}
          cashOutHopIndex={trace.cashOutEndpoint.hopIndex}
        />
      </VerityAgentDisclosureSection>

      <VerityOnChainRecoveryPoint endpoint={trace.cashOutEndpoint} />

      <VerityOnChainRoadmapPanel />

      <VerityOnChainTracingMethodologyPanel />

      <VerityOnChainGovernanceNote />
    </section>
  );
}
