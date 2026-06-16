"use client";

import { TRACE_GOVERNANCE_COPY } from "@/lib/verity/onchain-trace";

export function VerityOnChainGovernanceNote() {
  return (
    <div className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-4 py-3 text-sm text-signal-slate">
      <h4 className="font-semibold text-signal-ink">How this trace works</h4>
      <p className="mt-2 leading-relaxed">{TRACE_GOVERNANCE_COPY.synthetic}</p>
      <p className="mt-2 leading-relaxed">{TRACE_GOVERNANCE_COPY.methods}</p>
    </div>
  );
}
