"use client";

import { useMemo } from "react";
import { getPerformanceRowsByRole } from "@/lib/ops/performance";
import { OpsPeopleManagementStory } from "./OpsPeopleManagementStory";
import { OpsPerformanceSignalCaption } from "./OpsPerformanceSignalCaption";
import { OpsPerformanceTable } from "./OpsPerformanceTable";

export function OpsRosterPerformanceView() {
  const fraudAnalysts = useMemo(
    () => getPerformanceRowsByRole("Fraud Analyst"),
    [],
  );
  const juniorAnalysts = useMemo(
    () => getPerformanceRowsByRole("Junior Analyst"),
    [],
  );

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Performance</h3>
        <div className="mt-1 space-y-2">
          <OpsPerformanceSignalCaption />
        </div>
      </div>

      <OpsPeopleManagementStory />
      <OpsPerformanceTable fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
    </div>
  );
}
