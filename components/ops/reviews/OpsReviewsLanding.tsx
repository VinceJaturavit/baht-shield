import type { OpsReviewPack } from "@/lib/ops/reviews-types";
import { getReviewHeadline } from "@/lib/ops/reviews";
import { OpsReviewAnalystList } from "./OpsReviewAnalystList";

interface Props {
  analysts: OpsReviewPack[];
  onOpenReview: (analystId: string) => void;
}

export function OpsReviewsLanding({ analysts, onOpenReview }: Props) {
  const fraudAnalysts = analysts.filter((a) => a.role === "Fraud Analyst");
  const juniorAnalysts = analysts.filter((a) => a.role === "Junior Analyst");

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Reviews</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Review packs bring workload, performance, quality, behaviour, and reliability into one
          read-only view for fair analyst conversations.
        </p>
      </div>

      <OpsReviewAnalystList
        groupLabel="Fraud Analysts"
        analysts={fraudAnalysts}
        getHeadline={getReviewHeadline}
        onOpenReview={onOpenReview}
      />
      <OpsReviewAnalystList
        groupLabel="Junior Analysts"
        analysts={juniorAnalysts}
        getHeadline={getReviewHeadline}
        onOpenReview={onOpenReview}
      />
    </div>
  );
}
