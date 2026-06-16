"use client";

import type { VerityDecisionDraft } from "@/lib/verity/agent-types";
import { SCENARIO_COLORS } from "@/lib/scenario-utils";

interface VerityAgentDecisionDraftProps {
  draft: VerityDecisionDraft;
  displayStatement?: string;
}

export function VerityAgentDecisionDraft({
  draft,
  displayStatement,
}: VerityAgentDecisionDraftProps) {
  const statement = displayStatement ?? draft.decisionSupportStatement;

  return (
    <div className="space-y-5">
      <div className="rounded-signalSm border border-signal-amberBorder bg-signal-amberSubtle px-4 py-3">
        <p className="text-sm font-medium text-signal-ink">
          Decision-support draft — not an automated verdict
        </p>
        <p className="mt-1 text-[13px] text-signal-slate">
          The human analyst owns the final disposition. This output structures
          reasoning and cites Stage 2 evidence only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
            Proposed recommendation
          </h3>
          <p className="mt-1 text-lg font-semibold text-signal-ink">
            {draft.recommendation}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
            Confidence
          </h3>
          <p className="mt-1 text-lg font-semibold text-signal-ink">
            {draft.confidence}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-signal-ink">Reasoning chain</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-signal-slate">
          {draft.reasoningChain.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-signal-ink">Comparable seed cases</h3>
        <ul className="mt-2 space-y-2">
          {draft.comparableSeedCases.map((c) => (
            <li
              key={c.caseId}
              className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-3 py-2 text-sm"
            >
              <span className="font-mono font-medium text-signal-indigo">
                {c.caseId}
              </span>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${SCENARIO_COLORS[c.scenario]}`}
              >
                {c.scenario}
              </span>
              <p className="mt-1 text-signal-slate">{c.similarityReason}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-signal-ink">
          Evidence citations (Stage 2)
        </h3>
        <ul className="mt-2 space-y-1.5">
          {draft.evidenceCitations.map((c) => (
            <li key={c.evidenceId} className="text-sm">
              <span className="font-mono text-xs text-signal-indigo">
                {c.evidenceId}
              </span>
              <span className="text-signal-slate"> — {c.citationLabel}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-signalSm border border-signal-border bg-signal-surfaceSubtle px-4 py-3">
        <h3 className="text-sm font-semibold text-signal-ink">
          Decision-support statement
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-signal-slate">{statement}</p>
      </div>
    </div>
  );
}
