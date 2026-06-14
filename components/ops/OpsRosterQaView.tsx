"use client";

import { useMemo } from "react";
import { getQaRows, QA_REOPEN_LINKAGE_NOTE } from "@/lib/ops/qa";
import { OpsPeopleManagementStory } from "./OpsPeopleManagementStory";
import { OpsQaSamplingPanel } from "./OpsQaSamplingPanel";
import { OpsQaSignalCaption } from "./OpsQaSignalCaption";
import { OpsSlaPickupPanel } from "./OpsSlaPickupPanel";

export function OpsRosterQaView() {
  const rows = useMemo(() => getQaRows(), []);
  const fraudAnalysts = useMemo(
    () => rows.filter((r) => r.role === "Fraud Analyst"),
    [rows],
  );
  const juniorAnalysts = useMemo(
    () => rows.filter((r) => r.role === "Junior Analyst"),
    [rows],
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
      <OpsQaSamplingPanel fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
      <OpsSlaPickupPanel rows={rows} />

      <p className="max-w-3xl border border-ourox-obsidianMid/50 bg-ourox-obsidian/15 px-3 py-2 text-[10px] leading-relaxed text-ourox-ink/50">
        {QA_REOPEN_LINKAGE_NOTE}
      </p>
    </div>
  );
}
