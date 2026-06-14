"use client";

import { useMemo } from "react";
import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import { filterRowsByMemberFilters, type OpsMemberFilterState } from "@/lib/ops/filters";
import { getFairnessResult } from "@/lib/ops/fairness";
import { OpsFairnessLegend } from "./OpsFairnessLegend";
import { OpsFairnessSummary } from "./OpsFairnessSummary";
import { OpsFairnessTable } from "./OpsFairnessTable";
import { OpsFilterEmptyState } from "./filters/OpsFilterEmptyState";

interface Props {
  teamWithLoad: OpsTeamMemberWithLoad[];
  memberFilters: OpsMemberFilterState;
  memberResultCount: number;
}

export function OpsRosterFairnessView({
  teamWithLoad,
  memberFilters,
  memberResultCount,
}: Props) {
  const result = useMemo(() => getFairnessResult(teamWithLoad), [teamWithLoad]);

  const fraudAnalysts = useMemo(
    () => filterRowsByMemberFilters(result.fraudAnalysts, memberFilters),
    [result.fraudAnalysts, memberFilters],
  );
  const juniorAnalysts = useMemo(
    () => filterRowsByMemberFilters(result.juniorAnalysts, memberFilters),
    [result.juniorAnalysts, memberFilters],
  );

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

      {memberResultCount === 0 ? (
        <OpsFilterEmptyState
          title="No analysts match the current filters."
          description="Clear filters or search for another analyst."
        />
      ) : (
        <OpsFairnessTable fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
      )}

      <OpsFairnessLegend />
    </div>
  );
}
