"use client";

import { useMemo } from "react";
import { filterRowsByMemberFilters, type OpsMemberFilterState } from "@/lib/ops/filters";
import { getQaRows, QA_REOPEN_LINKAGE_NOTE } from "@/lib/ops/qa";
import { OpsPeopleManagementStory } from "./OpsPeopleManagementStory";
import { OpsQaSamplingPanel } from "./OpsQaSamplingPanel";
import { OpsQaSignalCaption } from "./OpsQaSignalCaption";
import { OpsSlaPickupPanel } from "./OpsSlaPickupPanel";
import { OpsFilterEmptyState } from "./filters/OpsFilterEmptyState";

interface Props {
  memberFilters: OpsMemberFilterState;
  memberResultCount: number;
}

export function OpsRosterQaView({ memberFilters, memberResultCount }: Props) {
  const rows = useMemo(() => getQaRows(), []);
  const filteredRows = useMemo(
    () => filterRowsByMemberFilters(rows, memberFilters),
    [rows, memberFilters],
  );
  const fraudAnalysts = useMemo(
    () => filteredRows.filter((r) => r.role === "Fraud Analyst"),
    [filteredRows],
  );
  const juniorAnalysts = useMemo(
    () => filteredRows.filter((r) => r.role === "Junior Analyst"),
    [filteredRows],
  );

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">QA</h3>
        <div className="mt-1 space-y-2">
          <OpsQaSignalCaption />
        </div>
      </div>

      <OpsPeopleManagementStory />

      {memberResultCount === 0 ? (
        <OpsFilterEmptyState
          title="No analysts match the current filters."
          description="Clear filters or search for another analyst."
        />
      ) : (
        <>
          <OpsQaSamplingPanel fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
          <OpsSlaPickupPanel rows={filteredRows} />
        </>
      )}

      <p className="max-w-3xl border border-ourox-obsidianMid/50 bg-ourox-obsidian/15 px-3 py-2 text-[10px] leading-relaxed text-ourox-ink/50">
        {QA_REOPEN_LINKAGE_NOTE}
      </p>
    </div>
  );
}
