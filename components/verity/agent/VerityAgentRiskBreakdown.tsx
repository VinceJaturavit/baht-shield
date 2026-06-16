"use client";

import type { VerityRiskScore } from "@/lib/verity/agent-types";
import { getRiskBandClasses } from "@/lib/verity/agent-risk";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";

const CATEGORY_LABELS: Record<string, string> = {
  account_history: "Account history",
  transaction_graph: "Transaction graph",
  device_ip_funding: "Device / IP / funding",
  onchain_exposure: "On-chain exposure",
  prior_flags: "Prior flags",
  pattern_match: "Pattern match",
};

interface VerityAgentRiskBreakdownProps {
  riskScore: VerityRiskScore;
}

export function VerityAgentRiskBreakdown({ riskScore }: VerityAgentRiskBreakdownProps) {
  return (
    <VerityAgentDisclosureSection title="Risk breakdown">
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold tabular-nums text-signal-ink">
            {riskScore.score}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBandClasses(riskScore.band)}`}
          >
            {riskScore.band}
          </span>
        </div>

        <p className="text-[13px] leading-relaxed text-signal-slate">
          {riskScore.ruleSummary}
        </p>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
            Evidence contributions
          </h4>
          <ul className="space-y-2">
            {riskScore.contributions.map((c) => (
              <li
                key={c.evidenceId}
                className="rounded-signalSm border border-signal-borderSubtle bg-signal-surface px-3 py-2.5 text-sm"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-xs text-signal-indigo">
                    {c.evidenceId}
                  </span>
                  <span className="font-medium text-signal-ink">{c.label}</span>
                </div>
                <dl className="mt-1.5 grid gap-1 text-xs text-signal-slate sm:grid-cols-2">
                  <div>
                    <dt className="inline font-medium text-signal-body">Category: </dt>
                    <dd className="inline">
                      {CATEGORY_LABELS[c.category] ?? c.category} (weight{" "}
                      {c.categoryWeight})
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-signal-body">
                      Confidence:{" "}
                    </dt>
                    <dd className="inline">
                      {c.confidence} (×{c.confidenceMultiplier})
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-signal-body">
                      Contribution:{" "}
                    </dt>
                    <dd className="inline tabular-nums">{c.contribution.toFixed(1)}</dd>
                  </div>
                </dl>
                <p className="mt-1 text-xs text-signal-secondary">{c.rationale}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VerityAgentDisclosureSection>
  );
}
