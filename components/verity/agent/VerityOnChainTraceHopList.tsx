"use client";

import type { VerityOnChainTraceHop } from "@/lib/verity/agent-types";
import {
  getHopDetailFields,
  getHopPrimaryLineParts,
  HOP_TYPE_LABELS,
} from "@/lib/verity/onchain-trace-display";

interface VerityOnChainTraceHopListProps {
  hops: VerityOnChainTraceHop[];
  cashOutHopIndex: number;
}

function HopTypeBadge({ hopType }: { hopType: VerityOnChainTraceHop["hopType"] }) {
  return (
    <span className="shrink-0 rounded bg-signal-surfaceSubtle px-1.5 py-0.5 text-xs font-medium text-signal-body">
      {HOP_TYPE_LABELS[hopType]}
    </span>
  );
}

function HopPrimaryLine({
  hop,
  isCashOut,
}: {
  hop: VerityOnChainTraceHop;
  isCashOut: boolean;
}) {
  const parts = getHopPrimaryLineParts(hop, isCashOut);

  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm text-signal-body">
      <HopTypeBadge hopType={hop.hopType} />
      <span className="tabular-nums font-medium text-signal-ink">
        {parts.amount} {parts.asset}
      </span>
      <span className="text-signal-secondary" aria-hidden>
        ·
      </span>
      <span className="text-signal-slate">{parts.attribution}</span>
      {parts.isCoMingled && (
        <>
          <span className="text-signal-secondary" aria-hidden>
            ·
          </span>
          <span className="text-xs font-medium text-signal-body">Co-mingled</span>
          {parts.tracingMethod && (
            <>
              <span className="text-signal-secondary" aria-hidden>
                ·
              </span>
              <span className="text-xs font-medium text-signal-indigo">
                Method: {parts.tracingMethod}
              </span>
            </>
          )}
        </>
      )}
      {parts.isCashOut && (
        <>
          <span className="text-signal-secondary" aria-hidden>
            ·
          </span>
          <span className="text-xs font-semibold text-signal-indigo">
            Recovery point
          </span>
        </>
      )}
    </div>
  );
}

function HopSecondaryDetail({ hop }: { hop: VerityOnChainTraceHop }) {
  const detail = getHopDetailFields(hop);

  return (
    <details className="mt-1.5 text-xs">
      <summary className="cursor-pointer font-medium text-signal-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo">
        Details
      </summary>
      <dl className="mt-2 space-y-1 pl-0.5 text-signal-slate">
        <div>
          <dt className="inline font-medium text-signal-body">From: </dt>
          <dd
            className="inline break-all font-mono text-[11px] text-signal-indigo"
            title={detail.fromAddress}
          >
            {detail.fromAddress}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">To: </dt>
          <dd
            className="inline break-all font-mono text-[11px] text-signal-indigo"
            title={detail.toAddress}
          >
            {detail.toAddress}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">Chain: </dt>
          <dd className="inline">{detail.chain}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">Ledger model: </dt>
          <dd className="inline">{detail.ledgerModel}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">Attribution: </dt>
          <dd className="inline">{detail.attributionLabel}</dd>
        </div>
        {detail.tracingMethod && (
          <div>
            <dt className="inline font-medium text-signal-body">
              Co-mingling method:{" "}
            </dt>
            <dd className="inline">{detail.tracingMethod}</dd>
          </div>
        )}
        {detail.methodNote && (
          <div>
            <dt className="inline font-medium text-signal-body">Method note: </dt>
            <dd className="inline">{detail.methodNote}</dd>
          </div>
        )}
        <div>
          <dt className="inline font-medium text-signal-body">Hop note: </dt>
          <dd className="inline">{detail.note}</dd>
        </div>
      </dl>
    </details>
  );
}

export function VerityOnChainTraceHopList({
  hops,
  cashOutHopIndex,
}: VerityOnChainTraceHopListProps) {
  return (
    <ol className="relative ml-1 space-y-0" aria-label="Trace hop sequence">
      {hops.map((hop, i) => {
        const isCashOut = hop.index === cashOutHopIndex;
        const isLast = i === hops.length - 1;

        return (
          <li key={hop.index} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[11px] top-6 bottom-0 w-px bg-signal-borderSubtle"
                aria-hidden
              />
            )}

            <div className="relative z-10 flex shrink-0 flex-col items-center">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border border-signal-indigo/50 bg-signal-surface text-xs font-semibold text-signal-indigo"
                aria-label={`Hop ${hop.index}`}
              >
                {hop.index}
              </span>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <HopPrimaryLine hop={hop} isCashOut={isCashOut} />
              <HopSecondaryDetail hop={hop} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
