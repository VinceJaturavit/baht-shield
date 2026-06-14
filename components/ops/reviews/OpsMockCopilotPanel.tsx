"use client";

import { useState } from "react";
import type { OpsReviewPack } from "@/lib/ops/reviews-types";
import { generateMockCopilotReview } from "@/lib/ops/reviews-copilot";
import type { OpsCopilotReview } from "@/lib/ops/reviews-copilot-types";
import { OpsIndicatorLabel, type OpsIndicatorTone } from "../OpsIndicatorLabel";

interface Props {
  pack: OpsReviewPack;
}

function dispositionTone(disposition: OpsCopilotReview["disposition"]): OpsIndicatorTone {
  switch (disposition) {
    case "Strong — recognise":
      return "good";
    case "Solid — maintain":
      return "neutral";
    case "Developing — coach":
      return "watch";
    case "Watch — review":
      return "risk";
  }
}

export function OpsMockCopilotPanel({ pack }: Props) {
  const [review, setReview] = useState<OpsCopilotReview | null>(null);

  function handleGenerate() {
    setReview(generateMockCopilotReview(pack));
  }

  return (
    <section className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20 px-3 py-3">
      <h3 className="text-[11px] font-semibold text-ourox-ink">
        AI-assisted review (synthetic demo)
      </h3>
      <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-ourox-ink/50">
        This is a deterministic mock review using the embedded rubric and synthetic analyst data. It
        is not a live AI call.
      </p>

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-2 rounded border border-ourox-orange/35 bg-ourox-orange/[0.08] px-3 py-1.5 text-[11px] font-medium text-ourox-ink hover:bg-ourox-orange/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
      >
        Generate review
      </button>

      {review && (
        <div className="mt-3 space-y-3 border-t border-ourox-obsidianMid/60 pt-3">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              Five-line scorecard
            </h4>
            <ul className="mt-1.5 space-y-1 text-[10px] leading-relaxed text-ourox-ink/70">
              <li>{review.scorecard.workloadContext}</li>
              <li>{review.scorecard.throughput}</li>
              <li>{review.scorecard.quality}</li>
              <li>{review.scorecard.behaviour}</li>
              <li>{review.scorecard.reliability}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              Overall disposition
            </h4>
            <div className="mt-1.5">
              <OpsIndicatorLabel
                label={review.disposition}
                tone={dispositionTone(review.disposition)}
              />
            </div>
            <p className="mt-1 text-[10px] text-ourox-ink/60">{review.dispositionReason}</p>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              Manager actions
            </h4>
            <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[10px] leading-relaxed text-ourox-ink/70">
              {review.managerActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
          </div>

          <p className="border border-ourox-obsidianMid/50 bg-ourox-obsidian/15 px-2.5 py-2 text-[10px] leading-relaxed text-ourox-ink/55">
            {review.closingLine}
          </p>

          <p className="text-[9px] text-ourox-ink/35">{review.generatedBy}</p>
        </div>
      )}
    </section>
  );
}
