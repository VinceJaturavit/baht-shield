"use client";

import type { VerityEvidencePack } from "@/lib/verity/agent-types";
import { getRiskBandClasses } from "@/lib/verity/agent-risk";
import {
  getEvidenceCategoryLabel,
  getEvidenceContributionForItem,
  getTopCompellingEvidence,
} from "@/lib/verity/agent-evidence-display";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { VerityAgentRiskBreakdown } from "./VerityAgentRiskBreakdown";
import { VerityAgentConfidenceChip } from "./VerityAgentConfidenceChip";
import { VerityAgentContributionChip } from "./VerityAgentContributionChip";
import { VerityOnChainTraceView } from "./VerityOnChainTraceView";

interface VerityAgentEvidencePackProps {
  pack: VerityEvidencePack;
  displaySummary?: string;
}

export function VerityAgentEvidencePack({
  pack,
  displaySummary,
}: VerityAgentEvidencePackProps) {
  const summary = displaySummary ?? pack.summary;
  const { riskScore } = pack;
  const compellingEvidence = getTopCompellingEvidence(
    pack.evidenceItems,
    riskScore
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-sm font-medium text-signal-body">
          {pack.evidenceItems.length} evidence items
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBandClasses(riskScore.band)}`}
        >
          Risk {riskScore.score} — {riskScore.band}
        </span>
      </div>

      <div className="rounded-signalSm border border-signal-border bg-signal-surfaceSubtle px-4 py-3">
        <h3 className="text-sm font-semibold text-signal-ink">Evidence summary</h3>
        <p className="mt-2 text-sm leading-relaxed text-signal-slate">{summary}</p>
      </div>

      <section
        aria-label="Compelling evidence"
        className="rounded-signalSm border border-signal-border bg-signal-surface px-4 py-3"
      >
        <h3 className="text-sm font-semibold text-signal-ink">Compelling evidence</h3>
        <ul className="mt-2 space-y-2">
          {compellingEvidence.map(({ item, contribution }) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
            >
              <span className="font-medium text-signal-body">
                {getEvidenceCategoryLabel(item.category)}
              </span>
              <span className="text-signal-secondary" aria-hidden>
                ·
              </span>
              <span className="min-w-0 flex-1 text-signal-slate">{item.finding}</span>
              {contribution && (
                <VerityAgentContributionChip contribution={contribution.contribution} />
              )}
              <VerityAgentConfidenceChip confidence={item.confidence} />
            </li>
          ))}
        </ul>
      </section>

      {pack.onChainTrace && (
        <VerityOnChainTraceView trace={pack.onChainTrace} />
      )}

      <VerityAgentRiskBreakdown riskScore={riskScore} />

      <VerityAgentDisclosureSection title="Atomic evidence steps">
        <p className="mb-3 text-[13px] text-signal-slate">
          Each step is a discrete, auditable evidence assembly action — not a
          single narrative paragraph.
        </p>
        <ol className="space-y-3">
          {pack.atomicSteps.map((step, i) => (
            <li
              key={step.id}
              className="rounded-signalSm border border-signal-borderSubtle bg-signal-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium text-signal-ink">
                  {i + 1}. {step.label}
                </span>
                <span className="text-xs font-medium text-signal-indigo">
                  {step.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-signal-slate">{step.output}</p>
              <p className="mt-1 text-xs text-signal-secondary">
                Evidence refs: {step.evidenceRefs.join(", ")}
              </p>
            </li>
          ))}
        </ol>
      </VerityAgentDisclosureSection>

      <VerityAgentDisclosureSection title="Full evidence">
        <div className="overflow-x-auto">
          <table className="w-full min-w-0 border-collapse text-sm">
            <thead>
              <tr className="border-b border-signal-borderSubtle text-left text-xs font-semibold uppercase tracking-wide text-signal-secondary">
                <th className="pb-2 pr-3 font-semibold">ID</th>
                <th className="pb-2 pr-3 font-semibold">Category</th>
                <th className="pb-2 pr-3 font-semibold">Confidence</th>
                <th className="pb-2 pr-3 font-semibold">Contribution</th>
                <th className="pb-2 font-semibold">Finding</th>
              </tr>
            </thead>
            <tbody>
              {pack.evidenceItems.map((item) => {
                const contribution = getEvidenceContributionForItem(item, riskScore);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-signal-borderSubtle align-top last:border-b-0"
                  >
                    <td className="py-2.5 pr-3">
                      <details className="group">
                        <summary className="cursor-pointer list-none font-mono text-xs text-signal-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo [&::-webkit-details-marker]:hidden">
                          {item.id}
                          <span className="ml-1 text-[10px] text-signal-secondary group-open:hidden">
                            ▾
                          </span>
                        </summary>
                        {contribution && (
                          <div className="mt-1.5 space-y-1 text-xs text-signal-secondary">
                            <p className="font-mono">{item.sourceRef}</p>
                            <p>{contribution.rationale}</p>
                            <p>
                              Category weight {contribution.categoryWeight} ×
                              confidence multiplier {contribution.confidenceMultiplier}{" "}
                              = {contribution.contribution.toFixed(1)} contribution
                            </p>
                          </div>
                        )}
                      </details>
                    </td>
                    <td className="py-2.5 pr-3 text-signal-body">
                      {getEvidenceCategoryLabel(item.category)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <VerityAgentConfidenceChip confidence={item.confidence} />
                    </td>
                    <td className="py-2.5 pr-3">
                      {contribution ? (
                        <VerityAgentContributionChip
                          contribution={contribution.contribution}
                        />
                      ) : (
                        <span className="text-xs text-signal-secondary">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-signal-slate">{item.finding}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </VerityAgentDisclosureSection>
    </div>
  );
}
