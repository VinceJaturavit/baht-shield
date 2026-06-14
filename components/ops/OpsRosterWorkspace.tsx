"use client";

import { useMemo } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { OPS_QUEUE_OWNERSHIP } from "@/data/ops/ops-queue-ownership";
import { getTeamWithLoad, partitionTeamByRole } from "@/lib/ops/roster";
import { getShiftCoverage } from "@/lib/ops/shift-coverage";
import { OpsProtectedCapacityNote } from "./OpsProtectedCapacityNote";
import { OpsRosterTable } from "./OpsRosterTable";
import { OpsQueueOwnershipTable } from "./OpsQueueOwnershipTable";
import { OpsShiftCoverageGrid } from "./OpsShiftCoverageGrid";
import { OpsWeeklyScheduleGrid } from "./OpsWeeklyScheduleGrid";

interface Props {
  cases: OpsCase[];
}

export function OpsRosterWorkspace({ cases }: Props) {
  const teamWithLoad = useMemo(() => getTeamWithLoad(OPS_TEAM, cases), [cases]);
  const { fraudAnalysts, juniorAnalysts } = useMemo(
    () => partitionTeamByRole(teamWithLoad),
    [teamWithLoad],
  );
  const shiftCoverage = useMemo(
    () => getShiftCoverage(teamWithLoad, cases),
    [teamWithLoad, cases],
  );

  return (
    <div className="min-w-0 flex-1 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Roster & Assignment</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Roster shows planned ownership, load, and reserve capacity. High-priority queues need
          named owners and backups; Fraud Analysts cannot be fully consumed by routine intake.
        </p>
      </div>

      <OpsProtectedCapacityNote />

      <div className="space-y-5">
        <OpsRosterTable
          members={fraudAnalysts}
          groupLabel="Fraud Analysts"
          caption="Fraud Analysts hold decision authority for RFR, LAR, Urgent, escalations, QA, and final sign-off."
        />
        <OpsRosterTable
          members={juniorAnalysts}
          groupLabel="Junior Analysts"
          caption="Junior Analysts handle structured intake and evidence preparation under SOP."
        />
        <OpsQueueOwnershipTable rows={OPS_QUEUE_OWNERSHIP} />
        <OpsShiftCoverageGrid rows={shiftCoverage} />
        <OpsWeeklyScheduleGrid
          fraudAnalysts={fraudAnalysts}
          juniorAnalysts={juniorAnalysts}
          teamWithLoad={teamWithLoad}
        />
      </div>
    </div>
  );
}
