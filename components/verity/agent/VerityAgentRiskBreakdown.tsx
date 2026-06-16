"use client";

import type { VerityRiskScore } from "@/lib/verity/agent-types";
import { getRiskBandClasses } from "@/lib/verity/agent-risk";
import {
  getEvidenceCategoryLabel,
  sortContributionsByScore,
} from "@/lib/verity/agent-evidence-display";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { VerityAgentConfidenceChip } from "./VerityAgentConfidenceChip";
import { VerityAgentContributionChip } from "./VerityAgentContributionChip";

interface VerityAgentRiskBreakdownProps {
  riskScore: VerityRiskScore;
}

export function VerityAgentRiskBreakdown({ riskScore }: VerityAgentRiskBreakdownProps) {
  const rankedContributions = sortContributionsByScore(riskScore.contributions);

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

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
            Evidence contributions (ranked)
          </h4>
          <ul className="divide-y divide-signal-borderSubtle border-y border-signal-borderSubtle">
            {rankedContributions.map((c) => (
              <li key={c.evidenceId} className="py-2.5 text-sm">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium text-signal-ink">{c.label}</span>
                  <span className="text-xs text-signal-secondary">
                    {getEvidenceCategoryLabel(c.category)}
                  </span>
                  <VerityAgentConfidenceChip confidence={c.confidence} />
                  <VerityAgentContributionChip contribution={c.contribution} />
                </div>
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-xs font-medium text-signal-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo">
                    Scoring detail
                  </summary>
                  <dl className="mt-1.5 space-y-1 text-xs text-signal-slate">
                    <div>
                      <dt className="inline font-medium text-signal-body">
                        Category weight:{" "}
                      </dt>
                      <dd className="inline tabular-nums">{c.categoryWeight}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-signal-body">
                        Confidence multiplier:{" "}
                      </dt>
                      <dd className="inline tabular-nums">
                        {c.confidenceMultiplier}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-signal-body">
                        Contribution:{" "}
                      </dt>
                      <dd className="inline tabular-nums">
                        Category weight {c.categoryWeight} × confidence multiplier{" "}
                        {c.confidenceMultiplier} = {c.contribution.toFixed(1)}{" "}
                        contribution
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-signal-body">
                        Evidence ID:{" "}
                      </dt>
                      <dd className="inline font-mono text-signal-indigo">
                        {c.evidenceId}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-signal-body">
                        Rationale:{" "}
                      </dt>
                      <dd className="inline">{c.rationale}</dd>
                    </div>
                  </dl>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VerityAgentDisclosureSection>
  );
}
