"use client";

import type { VerityActionPlan } from "@/lib/verity/agent-types";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";

interface VerityAgentActionPlanProps {
  plan: VerityActionPlan;
}

export function VerityAgentActionPlan({ plan }: VerityAgentActionPlanProps) {
  const humanRequired = plan.actions.filter(
    (a) => a.eligibility === "Human-required"
  ).length;
  const reversible = plan.actions.filter(
    (a) => a.reversibility === "Reversible"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <p className="text-signal-body">
          <span className="font-medium text-signal-ink">{plan.actions.length}</span>{" "}
          actions proposed
        </p>
        <p className="text-signal-body">
          <span className="font-medium text-signal-ink">{humanRequired}</span>{" "}
          human-required
        </p>
        <p className="text-signal-body">
          <span className="font-medium text-signal-ink">{reversible}</span> reversible
        </p>
      </div>

      <p className="text-[13px] text-signal-slate">
        Proposed operational actions only. Nothing is executed automatically.
        Material or irreversible actions are flagged as human-required.
      </p>

      <VerityAgentDisclosureSection title="Action details">
        <ul className="space-y-3">
          {plan.actions.map((action) => (
            <li
              key={action.id}
              className={`rounded-signalSm border px-4 py-3 ${
                action.eligibility === "Human-required"
                  ? "border-signal-amberBorder bg-signal-amberSubtle"
                  : "border-signal-borderSubtle bg-signal-surface"
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
      </VerityAgentDisclosureSection>

      <VerityAgentDisclosureSection title="Pattern-library write-back proposal">
        <p className="text-[13px] text-signal-slate">
          Proposed feedback-loop update — requires human approval. Not
          automatically written to the pattern library.
        </p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div>
            <dt className="inline font-medium text-signal-body">Pattern: </dt>
            <dd className="inline text-signal-slate">
              {plan.patternWriteBack.patternName}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-signal-body">Scenario: </dt>
            <dd className="inline text-signal-slate">
              {plan.patternWriteBack.scenario}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-signal-body">Confidence: </dt>
            <dd className="inline text-signal-slate">
              {plan.patternWriteBack.confidence}
            </dd>
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
      </VerityAgentDisclosureSection>
    </div>
  );
}
