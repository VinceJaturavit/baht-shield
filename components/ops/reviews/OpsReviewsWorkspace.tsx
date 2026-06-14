"use client";

import { useMemo, useState } from "react";
import { getReviewAnalystList } from "@/lib/ops/reviews";
import { OpsReviewsLanding } from "./OpsReviewsLanding";
import { OpsReviewPack } from "./OpsReviewPack";

export function OpsReviewsWorkspace() {
  const analysts = useMemo(() => getReviewAnalystList(), []);
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);

  if (selectedAnalystId) {
    return (
      <OpsReviewPack
        analystId={selectedAnalystId}
        onBack={() => setSelectedAnalystId(null)}
      />
    );
  }

  return <OpsReviewsLanding analysts={analysts} onOpenReview={setSelectedAnalystId} />;
}
