"use client";

import { useMemo, useState } from "react";
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
import { OpsRosterSubNav, type OpsRosterSubView } from "./OpsRosterSubNav";
import { OpsRosterFairnessView } from "./OpsRosterFairnessView";
import { OpsRosterPerformanceView } from "./OpsRosterPerformanceView";
import { OpsRosterQaView } from "./OpsRosterQaView";

interface Props {
  cases: OpsCase[];
}

const SUB_VIEW_HEADERS: Record<
  OpsRosterSubView,
  { title: string; description: string }
> = {
  roster: {
    title: "Roster",
    description:
      "Fraud Analysts and Junior Analysts with current load, capacity, and protected reserve.",
  },
  dailyOwnership: {
    title: "Daily Ownership",
    description:
      "Named queue owners, rotation, and single-day shift coverage for decision authority and intake.",
  },
  weeklySchedule: {
    title: "Weekly Schedule",
    description:
      "Planned shift and queue assignment for the week. Click a cell for full detail.",
  },
  fairness: {
    title: "Fairness",
    description:
      "Weekly workload-equity check based on assigned difficulty only — separate from volume or performance.",
  },
  performance: {
    title: "Performance",
    description:
      "Throughput for the synthetic review week — raw volume beside complexity-weighted output.",
  },
  qa: {
    title: "QA",
    description:
      "Sampled quality and SLA-pickup behaviour — separate from throughput and fairness.",
  },
};

export function OpsRosterWorkspace({ cases }: Props) {
  const [subView, setSubView] = useState<OpsRosterSubView>("roster");

  const teamWithLoad = useMemo(() => getTeamWithLoad(OPS_TEAM, cases), [cases]);
  const { fraudAnalysts, juniorAnalysts } = useMemo(
    () => partitionTeamByRole(teamWithLoad),
    [teamWithLoad],
  );
  const shiftCoverage = useMemo(
    () => getShiftCoverage(teamWithLoad, cases),
    [teamWithLoad, cases],
  );

  const header = SUB_VIEW_HEADERS[subView];

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Roster & Assignment</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Roster shows planned ownership, load, and reserve capacity. High-priority queues need
          named owners and backups; Fraud Analysts cannot be fully consumed by routine intake.
        </p>
      </div>

      <OpsRosterSubNav active={subView} onSelect={setSubView} />

      <div className="min-w-0 space-y-4">
        {subView !== "fairness" && subView !== "performance" && subView !== "qa" && (
          <div>
            <h3 className="text-xs font-semibold text-ourox-ink">{header.title}</h3>
            <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
              {header.description}
            </p>
          </div>
        )}

        {subView === "roster" && (
          <>
            <OpsProtectedCapacityNote />
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
          </>
        )}

        {subView === "dailyOwnership" && (
          <>
            <OpsQueueOwnershipTable rows={OPS_QUEUE_OWNERSHIP} />
            <OpsShiftCoverageGrid rows={shiftCoverage} />
          </>
        )}

        {subView === "weeklySchedule" && (
          <OpsWeeklyScheduleGrid
            fraudAnalysts={fraudAnalysts}
            juniorAnalysts={juniorAnalysts}
            teamWithLoad={teamWithLoad}
          />
        )}

        {subView === "fairness" && <OpsRosterFairnessView teamWithLoad={teamWithLoad} />}

        {subView === "performance" && <OpsRosterPerformanceView />}

        {subView === "qa" && <OpsRosterQaView />}
      </div>
    </div>
  );
}
