"use client";

import { useState } from "react";
import type { OpsReviewPack } from "@/lib/ops/reviews-types";
import { generateMockCopilotReview } from "@/lib/ops/reviews-copilot";
import type { OpsCopilotReview } from "@/lib/ops/reviews-copilot-types";
import { OpsIndicatorLabel, type OpsIndicatorTone } from "../OpsIndicatorLabel";

interface Props {
  pack: OpsReviewPack;
}

function dispositionTone(
  disposition: OpsCopilotReview["managerDecisionSummary"]["disposition"],
): OpsIndicatorTone {
  switch (disposition) {
    case "Strong — recognise":
      return "good";
    case "Solid — maintain":
      return "good";
    case "Developing — coach":
      return "watch";
    case "Watch — review":
      return "risk";
  }
}

const PRIMARY_BUTTON =
  "rounded bg-ourox-orange px-4 py-2 text-xs font-semibold text-ourox-obsidian hover:bg-ourox-orange/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian disabled:cursor-not-allowed disabled:opacity-50";

const SECONDARY_BUTTON =
  "rounded border border-ourox-obsidianMid bg-ourox-obsidian/30 px-3 py-1.5 text-xs font-medium text-ourox-ink/80 hover:border-ourox-orange/40 hover:bg-ourox-orange/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange";

export function OpsMockCopilotPanel({ pack }: Props) {
  const [review, setReview] = useState<OpsCopilotReview | null>(null);

  function handleGenerate() {
    setReview(generateMockCopilotReview(pack));
  }

  function handleClear() {
    setReview(null);
  }

  return (
    <section className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/25 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-sm font-semibold text-ourox-ink">
            AI-assisted review (synthetic demo)
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
            Deterministic mock review using the embedded rubric and synthetic analyst data. Not a
            live AI call.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!review ? (
            <button type="button" onClick={handleGenerate} className={PRIMARY_BUTTON}>
              Generate review
            </button>
          ) : (
            <>
              <button type="button" onClick={handleGenerate} className={PRIMARY_BUTTON}>
                Regenerate review
              </button>
              <button type="button" onClick={handleClear} className={SECONDARY_BUTTON}>
                Clear review
              </button>
            </>
          )}
        </div>
      </div>

      {review && (
        <article className="mt-4 space-y-5 border-t border-ourox-obsidianMid/60 pt-4">
          <section>
            <h4 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-xs font-semibold uppercase tracking-wide text-ourox-ink/70">
              Scorecard
            </h4>
            <ul className="mt-2 space-y-1.5 [font-family:var(--font-space-mono),monospace] text-xs leading-relaxed text-ourox-ink/85">
              <li>{review.scorecard.workloadContext}</li>
              <li>{review.scorecard.throughput}</li>
              <li>{review.scorecard.quality}</li>
              <li>{review.scorecard.behaviour}</li>
              <li>{review.scorecard.reliability}</li>
            </ul>
          </section>

          <section>
            <h4 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-sm font-semibold text-ourox-ink">
              Analyst-facing summary
            </h4>
            <p className="mt-0.5 text-[11px] text-ourox-ink/50">
              Written to the analyst for a developmental 1:1 conversation.
            </p>

            <div className="mt-3 space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-ourox-ink/75">What went well</h5>
                <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-ourox-ink/90">
                  {review.analystFacingSummary.whatWentWell.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-ourox-ink/75">What to improve</h5>
                <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-ourox-ink/90">
                  {review.analystFacingSummary.whatToImprove.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-ourox-ink/75">Workload context</h5>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ourox-ink/90">
                  {review.analystFacingSummary.workloadReassurance}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-ourox-ink/75">
                  Suggested focus next cycle
                </h5>
                <ol className="mt-1.5 list-decimal space-y-1.5 pl-4 text-[13px] leading-relaxed text-ourox-ink/90">
                  {review.analystFacingSummary.suggestedFocusActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="border border-ourox-obsidianMid/60 bg-ourox-obsidian/20 px-4 py-3">
            <h4 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-sm font-semibold text-ourox-ink">
              Manager decision summary
            </h4>
            <p className="mt-0.5 text-[11px] text-ourox-ink/50">
              Decision-support draft for the reviewing manager.
            </p>

            <div className="mt-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-ourox-ink/55">
                Disposition
              </span>
              <div className="mt-1.5">
                <OpsIndicatorLabel
                  label={review.managerDecisionSummary.disposition}
                  tone={dispositionTone(review.managerDecisionSummary.disposition)}
                  className="text-sm"
                />
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ourox-ink/85">
                {review.managerDecisionSummary.dispositionReason}
              </p>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold text-ourox-ink/75">Strongest evidence</h5>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-ourox-ink/90">
                {review.managerDecisionSummary.strongestEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold text-ourox-ink/75">
                Main risk or coaching point
              </h5>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ourox-ink/90">
                {review.managerDecisionSummary.mainRiskOrCoachingPoint}
              </p>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold text-ourox-ink/75">Manager actions</h5>
              <ol className="mt-1.5 list-decimal space-y-1.5 pl-4 text-[13px] leading-relaxed text-ourox-ink/90">
                {review.managerDecisionSummary.managerActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold text-ourox-ink/75">Confidence and caveats</h5>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ourox-ink/70">
                {review.managerDecisionSummary.confidenceAndCaveats.map((caveat) => (
                  <li key={caveat}>{caveat}</li>
                ))}
              </ul>
            </div>

            <p className="mt-4 border-t border-ourox-obsidianMid/50 pt-3 text-[13px] leading-relaxed text-ourox-ink/80">
              {review.managerDecisionSummary.humanInLoopClosingLine}
            </p>
          </section>

          <p className="[font-family:var(--font-space-mono),monospace] text-[10px] text-ourox-ink/40">{review.generatedBy}</p>
        </article>
      )}
    </section>
  );
}
