"use client";

const STEPS = [
  { number: 1, label: "Outcome / label" },
  { number: 2, label: "Disagreement surfaces the miss" },
  { number: 3, label: "Pattern identified" },
  { number: 4, label: "Candidate rule proposed" },
  { number: 5, label: "Back-test result" },
  { number: 6, label: "Analyst decides" },
] as const;

export function FeedbackLoopStepper() {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-ourox-ink">
        Closing the loop
      </h3>

      <div className="hidden sm:block">
        <div className="flex items-start justify-between">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div className="h-px flex-1 bg-ourox-obsidianMid" aria-hidden="true" />
                )}
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ourox-orange/50 bg-ourox-obsidian text-xs font-semibold text-ourox-orange"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 bg-ourox-obsidianMid" aria-hidden="true" />
                )}
              </div>
              <p className="mt-2 max-w-[7rem] text-center text-[10px] leading-4 text-ourox-ink/50">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ol className="space-y-2 sm:hidden">
        {STEPS.map((step) => (
          <li key={step.number} className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ourox-orange/50 text-[10px] font-semibold text-ourox-orange"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {step.number}
            </span>
            <span className="text-xs text-ourox-ink/60">{step.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-3 border-t border-ourox-obsidianMid pt-4">
        <p className="text-sm leading-6 text-ourox-ink/60">
          The model proposes; the analyst disposes. Disagreement cases are signals for review,
          not automatic rule changes. A fraud strategy team would review the evidence, check the
          false-positive cost, and decide whether the simulated refinement is safe to promote
          into the auditable rule engine.
        </p>
        <p className="text-sm leading-6 text-ourox-ink/50">
          This is analyst-curated intelligence becoming structured input to scoring:
          investigation outcomes reveal a miss, the miss becomes a candidate rule, and the
          candidate is tested before any deployment decision.
        </p>
      </div>
    </div>
  );
}
