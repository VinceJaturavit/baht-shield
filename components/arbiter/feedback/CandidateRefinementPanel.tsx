"use client";

import type { FeedbackCandidateRule } from "@/lib/arbiter/feedback-backtest";

interface Props {
  candidate: FeedbackCandidateRule;
}

function formatCondition(
  c: FeedbackCandidateRule["conditions"][number],
): string {
  if (c.operator === "gt") return `${c.featureKey} > ${c.threshold}`;
  if (c.operator === "lt") return `${c.featureKey} < ${c.threshold}`;
  if (c.operator === "eq") return `${c.featureKey} == ${String(c.threshold)}`;
  if (c.operator === "in") return `${c.featureKey} in [${(c.threshold as string[]).join(", ")}]`;
  return c.featureKey;
}

export function CandidateRefinementPanel({ candidate }: Props) {
  return (
    <div className="rounded-lg border border-ourox-orange/30 bg-ourox-obsidianLight/40 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold tracking-wide text-ourox-ink">
          Candidate refinement
        </h3>
        <span
          className="rounded border border-ourox-orange/40 bg-ourox-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ourox-orange"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Simulation only
        </span>
      </div>

      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        This candidate is not deployed. It is a proposed analyst refinement generated from
        synthetic disagreement analysis and tested against the labelled set.
      </p>

      <div className="space-y-3 rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/60 p-4 font-mono text-xs text-ourox-ink/80">
        <div>
          <span className="text-ourox-ink/40">Rule name</span>
          <div className="mt-0.5 text-ourox-orange">{candidate.name}</div>
        </div>
        <div>
          <span className="text-ourox-ink/40">IF</span>
          <div className="mt-1 space-y-1 pl-2">
            {candidate.conditions.map((c) => (
              <div key={c.featureKey}>{formatCondition(c)}</div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-ourox-ink/40">THEN</span>
          <div className="mt-0.5">{candidate.action}</div>
        </div>
        <div>
          <span className="text-ourox-ink/40">Reason</span>
          <div className="mt-0.5">{candidate.reasonCode}</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-ourox-ink/60">{candidate.rationale}</p>
    </div>
  );
}
