"use client";

import type { VerityCashOutEndpoint } from "@/lib/verity/agent-types";
import {
  formatRecoveryPointLabel,
  RECOVERY_CHAIN_CAVEAT,
  RECOVERY_CHAIN_STAGES,
} from "@/lib/verity/onchain-trace-display";

interface VerityOnChainRecoveryPointProps {
  endpoint: VerityCashOutEndpoint;
}

const TONE_CLASSES = {
  watch: "border-signal-border text-signal-body bg-signal-surfaceSubtle",
  neutral: "border-signal-borderSubtle text-signal-body bg-signal-surface",
  good: "border-signal-indigo/30 text-signal-ink bg-signal-surfaceSubtle",
} as const;

const INDICATOR_CLASSES = {
  watch: "bg-signal-slate",
  neutral: "bg-signal-secondary",
  good: "bg-signal-indigo",
} as const;

function RecoveryChainInfographic() {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-signal-body">Recovery chain</p>
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0"
        role="list"
        aria-label="Recovery chain stages"
      >
        {RECOVERY_CHAIN_STAGES.map((stage, i) => (
          <div
            key={stage.label}
            className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center"
            role="listitem"
          >
            <div
              className={`flex min-w-0 flex-1 flex-col rounded-signalSm border px-3 py-2 ${TONE_CLASSES[stage.tone]}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${INDICATOR_CLASSES[stage.tone]}`}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-signal-ink">
                  {stage.label}
                </span>
              </div>
              <p className="mt-1 pl-4 text-xs text-signal-slate">{stage.gloss}</p>
            </div>
            {i < RECOVERY_CHAIN_STAGES.length - 1 && (
              <>
                <span
                  className="hidden shrink-0 px-2 text-signal-secondary sm:inline"
                  aria-hidden
                >
                  →
                </span>
                <span
                  className="py-0.5 text-center text-xs text-signal-secondary sm:hidden"
                  aria-hidden
                >
                  ↓
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-signal-secondary">{RECOVERY_CHAIN_CAVEAT}</p>
    </div>
  );
}

export function VerityOnChainRecoveryPoint({
  endpoint,
}: VerityOnChainRecoveryPointProps) {
  const displayLabel = formatRecoveryPointLabel(endpoint.recoveryPointLabel);

  return (
    <div className="rounded-signalSm border border-signal-indigo/40 bg-signal-surfaceSubtle px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-signal-indigo">
          {displayLabel}
        </span>
        <span className="text-sm font-medium text-signal-ink">
          Cash-out endpoint — {endpoint.vaspLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-signal-slate">
        This cash-out VASP is the practical recovery point because funds touch a
        regulated platform. In a real case, investigators would seek a freeze
        through legal process. This demo does not execute any action.
      </p>
      <dl className="mt-2 space-y-1.5 text-sm">
        <div>
          <dt className="inline font-medium text-signal-body">VASP attribution: </dt>
          <dd className="inline text-signal-slate">{endpoint.vaspLabel}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">Address: </dt>
          <dd
            className="inline break-all font-mono text-xs text-signal-indigo"
            title={endpoint.address}
          >
            {endpoint.address}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-signal-body">Amount: </dt>
          <dd className="inline tabular-nums text-signal-slate">
            {endpoint.amount.toLocaleString()} {endpoint.asset} ({endpoint.chain})
          </dd>
        </div>
      </dl>
      <RecoveryChainInfographic />
    </div>
  );
}
