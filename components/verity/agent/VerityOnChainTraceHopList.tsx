"use client";

import type { VerityOnChainTraceHop } from "@/lib/verity/agent-types";
import { VerityOnChainMethodBadge } from "./VerityOnChainMethodBadge";

const HOP_TYPE_LABELS: Record<VerityOnChainTraceHop["hopType"], string> = {
  transfer: "Transfer",
  peel: "Peel",
  bridge: "Bridge",
  mixer: "Mixer",
  consolidation: "Consolidation",
  "cash-out": "Cash-out",
};

interface VerityOnChainTraceHopListProps {
  hops: VerityOnChainTraceHop[];
  cashOutHopIndex: number;
}

export function VerityOnChainTraceHopList({
  hops,
  cashOutHopIndex,
}: VerityOnChainTraceHopListProps) {
  return (
    <ol className="divide-y divide-signal-borderSubtle border-y border-signal-borderSubtle">
      {hops.map((hop) => {
        const isCashOut = hop.index === cashOutHopIndex;
        return (
          <li key={hop.index} className="py-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-xs font-semibold text-signal-indigo">
                Hop {hop.index}
              </span>
              <span className="rounded bg-signal-surfaceSubtle px-1.5 py-0.5 text-xs font-medium text-signal-body">
                {HOP_TYPE_LABELS[hop.hopType]}
              </span>
              {isCashOut && (
                <span className="text-xs font-semibold text-signal-indigo">
                  VASP cash-out
                </span>
              )}
            </div>

            <div className="mt-1.5 space-y-1">
              <p className="break-all font-mono text-xs text-signal-slate">
                <span title={hop.fromAddress}>{hop.fromAddress}</span>
                <span className="mx-1.5 text-signal-secondary" aria-hidden>
                  →
                </span>
                <span title={hop.toAddress}>{hop.toAddress}</span>
              </p>
              <p className="text-signal-body">
                <span className="tabular-nums font-medium">
                  {hop.amount.toLocaleString()}
                </span>{" "}
                {hop.asset} · {hop.chain}
              </p>
              <p className="text-signal-slate">
                <span className="font-medium text-signal-body">Attribution: </span>
                {hop.attributionLabel}
              </p>
              <p className="text-xs text-signal-secondary">
                Ledger: {hop.ledgerModel === "utxo" ? "UTXO" : "Account-based"}
              </p>
              {hop.isCoMingled && (
                <div className="mt-1">
                  <VerityOnChainMethodBadge
                    method={hop.tracingMethod}
                    methodNote={hop.methodNote}
                  />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
