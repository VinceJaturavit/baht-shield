"use client";

import { useState } from "react";

const FAILURE_MODES = [
  {
    mode: "Hallucinated narratives",
    fix: "Atomic evidence steps",
  },
  {
    mode: "Over-escalation",
    fix: "Grounding context and scenario-aware scope",
  },
  {
    mode: "Black box",
    fix: "Deterministic evidence chains and audit trail",
  },
] as const;

export function VerityAgentHowItWorks() {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="rounded-signal border border-signal-border bg-signal-surface p-5 shadow-signalSubtle">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-signalSm"
        aria-expanded={expanded}
      >
        <h2 className="text-lg font-semibold text-signal-ink">
          How this agent works
        </h2>
        <span className="text-signal-secondary text-sm">
          {expanded ? "Hide" : "Show"}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-5 text-sm text-signal-slate">
          <blockquote className="border-l-2 border-signal-indigo pl-4 text-signal-ink font-medium leading-relaxed">
            AI compresses the work around a decision, not the decision itself.
          </blockquote>
          <p>
            The agent assembles, structures, and cites evidence. The human
            reviews the scope, evidence pack, judgment draft, and action set
            before anything moves forward.
          </p>

          <div>
            <h3 className="font-semibold text-signal-ink">Operating mode</h3>
            <p className="mt-1">
              <span className="font-medium text-signal-body">Deterministic now:</span>{" "}
              this route uses a stable mock engine over synthetic Verity seed data.
              No live model call, no API key.
            </p>
            <p className="mt-2">
              <span className="font-medium text-signal-body">Real-API roadmap:</span>{" "}
              a future version could replace the deterministic generator with a
              one-time model call per stage. The request would send the same stage
              contract, the selected synthetic case context, and the approved
              prior-stage evidence as structured input. The response would still
              pass through the same human approval gate and audit trail. That
              future version would require a server API route and a server-side
              model API key on deployment. No key is stored and no live model call
              is made in this loop.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-signal-ink">Human gates</h3>
            <p className="mt-1">
              Every stage — Intake, Investigate, Decide, Action — requires explicit
              Approve, Deny, or Edit. Stages do not auto-advance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-signal-ink">Failure modes and fixes</h3>
            <ul className="mt-2 space-y-2">
              {FAILURE_MODES.map((row) => (
                <li
                  key={row.mode}
                  className="flex flex-wrap gap-x-2 rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-3 py-2"
                >
                  <span className="font-medium text-signal-body">{row.mode}</span>
                  <span className="text-signal-secondary" aria-hidden="true">
                    &rarr;
                  </span>
                  <span>{row.fix}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-3 py-3">
            <h3 className="font-semibold text-signal-ink">Synthetic data boundary</h3>
            <p className="mt-1">
              This demo uses synthetic Verity seed data only: generated alerts,
              cases, entities, patterns, and scenarios. It does not use real
              customer data, employer data, production workflows, or live vendor
              enrichment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
