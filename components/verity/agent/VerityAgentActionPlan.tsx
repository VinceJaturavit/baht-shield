"use client";

import type { VerityActionPlan } from "@/lib/verity/agent-types";

interface VerityAgentActionPlanProps {
  plan: VerityActionPlan;
}

export function VerityAgentActionPlan({ plan }: VerityAgentActionPlanProps) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-signal-slate">
        Proposed operational actions only. Nothing is executed automatically.
        Material or irreversible actions are flagged as human-required.
      </p>

      <ul className="space-y-3">
        {plan.actions.map((action) => (
          <li
            key={action.id}
            className={`rounded-signalSm border px-4 py-3 ${
              action.eligibility === "Human-required"
                ? "border-signal-amberBorder bg-signal-amberSubtle"
                : "border-signal-borderSubtle bg-signal-surfaceSubtle"
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold text-signal-ink">
                {action.label}
              </span>
              <span className="rounded-full border border-signal-border px-2 py-0.5 text-xs text-signal-body">
                {action.reversibility}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  action.eligibility === "Human-required"
                    ? "bg-signal-amber text-white"
                    : "bg-signal-indigoSubtle text-signal-indigo"
                }`}
              >
                {action.eligibility}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-signal-slate">{action.description}</p>
            <p className="mt-1 text-xs text-signal-secondary">
              Rationale: {action.rationale}
            </p>
          </li>
        ))}
      </ul>

      <div className="rounded-signalSm border border-signal-indigo/30 bg-signal-indigoSubtle px-4 py-3">
        <h3 className="text-sm font-semibold text-signal-ink">
          Pattern-library write-back proposal
        </h3>
        <p className="mt-1 text-[13px] text-signal-slate">
          Proposed feedback-loop update — requires human approval. Not
          automatically written to the pattern library.
        </p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div>
            <dt className="inline font-medium text-signal-body">Pattern: </dt>
            <dd className="inline text-signal-slate">{plan.patternWriteBack.patternName}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-signal-body">Scenario: </dt>
            <dd className="inline text-signal-slate">{plan.patternWriteBack.scenario}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-signal-body">Confidence: </dt>
            <dd className="inline text-signal-slate">{plan.patternWriteBack.confidence}</dd>
          </div>
          <div>
            <dt className="font-medium text-signal-body">Evidence indicators:</dt>
            <dd className="mt-1">
              <ul className="list-disc pl-5 text-signal-slate">
                {plan.patternWriteBack.evidenceIndicators.map((ind, i) => (
                  <li key={i} className="text-xs">
                    {ind}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
