"use client";

import { useMemo } from "react";
import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import { getFairnessResult } from "@/lib/ops/fairness";
import { OpsFairnessLegend } from "./OpsFairnessLegend";
import { OpsFairnessSummary } from "./OpsFairnessSummary";
import { OpsFairnessTable } from "./OpsFairnessTable";

interface Props {
  teamWithLoad: OpsTeamMemberWithLoad[];
}

export function OpsRosterFairnessView({ teamWithLoad }: Props) {
  const result = useMemo(() => getFairnessResult(teamWithLoad), [teamWithLoad]);

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Weekly Fairness</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
          Fairness here means no analyst is being handed disproportionately harder work. It is a
          workload-equity check based on assigned difficulty, separate from volume, speed, or
          performance.
        </p>
      </div>

      <OpsFairnessSummary summaries={result.roleSummaries} />
      <OpsFairnessTable
        fraudAnalysts={result.fraudAnalysts}
        juniorAnalysts={result.juniorAnalysts}
      />
      <OpsFairnessLegend />
    </div>
  );
}
