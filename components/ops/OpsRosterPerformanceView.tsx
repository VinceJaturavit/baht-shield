"use client";

import { useMemo } from "react";
import { filterRowsByMemberFilters, type OpsMemberFilterState } from "@/lib/ops/filters";
import { getPerformanceRowsByRole } from "@/lib/ops/performance";
import { OpsPeopleManagementStory } from "./OpsPeopleManagementStory";
import { OpsPerformanceSignalCaption } from "./OpsPerformanceSignalCaption";
import { OpsPerformanceTable } from "./OpsPerformanceTable";
import { OpsFilterEmptyState } from "./filters/OpsFilterEmptyState";

interface Props {
  memberFilters: OpsMemberFilterState;
  memberResultCount: number;
}

export function OpsRosterPerformanceView({ memberFilters, memberResultCount }: Props) {
  const fraudAnalysts = useMemo(() => {
    const rows = getPerformanceRowsByRole("Fraud Analyst");
    return filterRowsByMemberFilters(rows, memberFilters);
  }, [memberFilters]);

  const juniorAnalysts = useMemo(() => {
    const rows = getPerformanceRowsByRole("Junior Analyst");
    return filterRowsByMemberFilters(rows, memberFilters);
  }, [memberFilters]);

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Performance</h3>
        <div className="mt-1 space-y-2">
          <OpsPerformanceSignalCaption />
        </div>
      </div>

      <OpsPeopleManagementStory />

      {memberResultCount === 0 ? (
        <OpsFilterEmptyState
          title="No analysts match the current filters."
          description="Clear filters or search for another analyst."
        />
      ) : (
        <OpsPerformanceTable fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
      )}
    </div>
  );
}
