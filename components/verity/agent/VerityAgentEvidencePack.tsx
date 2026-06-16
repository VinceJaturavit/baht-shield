"use client";

import type { VerityEvidencePack } from "@/lib/verity/agent-types";
import { getRiskBandClasses } from "@/lib/verity/agent-risk";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { VerityAgentRiskBreakdown } from "./VerityAgentRiskBreakdown";

interface VerityAgentEvidencePackProps {
  pack: VerityEvidencePack;
  displaySummary?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  account_history: "Account history",
  transaction_graph: "Transaction graph",
  device_ip_funding: "Device / IP / funding",
  onchain_exposure: "On-chain exposure",
  prior_flags: "Prior flags",
  pattern_match: "Pattern match",
};

export function VerityAgentEvidencePack({
  pack,
  displaySummary,
}: VerityAgentEvidencePackProps) {
  const summary = displaySummary ?? pack.summary;
  const { riskScore } = pack;

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

      <VerityAgentDisclosureSection title="Evidence items">
        <ul className="space-y-3">
          {pack.evidenceItems.map((item) => (
            <li
              key={item.id}
              className="rounded-signalSm border border-signal-borderSubtle bg-signal-surface px-3 py-2.5 text-sm"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-xs text-signal-indigo">{item.id}</span>
                <span className="text-xs font-medium text-signal-body">
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
                <span className="text-xs text-signal-secondary">
                  Confidence: {item.confidence}
                </span>
              </div>
              <p className="mt-1 text-signal-slate">{item.finding}</p>
              <p className="mt-1 font-mono text-xs text-signal-secondary">
                {item.sourceRef}
              </p>
            </li>
          ))}
        </ul>
      </VerityAgentDisclosureSection>
    </div>
  );
}
