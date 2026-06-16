"use client";

import type { VerityOnChainTrace } from "@/lib/verity/agent-types";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { VerityOnChainTraceSummary } from "./VerityOnChainTraceSummary";
import { VerityOnChainTraceHopList } from "./VerityOnChainTraceHopList";
import { VerityOnChainRecoveryPoint } from "./VerityOnChainRecoveryPoint";
import { VerityOnChainRoadmapPanel } from "./VerityOnChainRoadmapPanel";
import { VerityOnChainGovernanceNote } from "./VerityOnChainGovernanceNote";

interface VerityOnChainTraceViewProps {
  trace: VerityOnChainTrace;
}

export function VerityOnChainTraceView({ trace }: VerityOnChainTraceViewProps) {
  return (
    <section
      aria-label="Forward on-chain trace"
      className="space-y-4 rounded-signalSm border border-signal-border bg-signal-surface px-4 py-4"
    >
      <VerityOnChainTraceSummary trace={trace} />

      <VerityAgentDisclosureSection title="Trace hop detail" defaultOpen={false}>
        <p className="mb-3 text-[13px] text-signal-slate">{trace.summary}</p>
        <p className="mb-3 text-xs text-signal-secondary">
          {trace.ledgerAwarenessNote}
        </p>
        <VerityOnChainTraceHopList
          hops={trace.hops}
          cashOutHopIndex={trace.cashOutEndpoint.hopIndex}
        />
      </VerityAgentDisclosureSection>

      <VerityOnChainRecoveryPoint endpoint={trace.cashOutEndpoint} />

      <VerityOnChainRoadmapPanel />

      <VerityOnChainGovernanceNote />
    </section>
  );
}
