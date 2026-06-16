"use client";

import type { VerityCashOutEndpoint } from "@/lib/verity/agent-types";

interface VerityOnChainRecoveryPointProps {
  endpoint: VerityCashOutEndpoint;
}

export function VerityOnChainRecoveryPoint({
  endpoint,
}: VerityOnChainRecoveryPointProps) {
  return (
    <div className="rounded-signalSm border border-signal-indigo/40 bg-signal-surfaceSubtle px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-signal-indigo">
          {endpoint.recoveryPointLabel}
        </span>
        <span className="text-sm font-medium text-signal-ink">
          Cash-out endpoint — {endpoint.vaspLabel}
        </span>
      </div>
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
        <div>
          <dt className="inline font-medium text-signal-body">Why actionable: </dt>
          <dd className="inline text-signal-slate">{endpoint.whyActionable}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-signal-secondary">
        Recovery chain: freeze → seize → restitution — explanatory only; no action
        executed in this demo.
      </p>
    </div>
  );
}
