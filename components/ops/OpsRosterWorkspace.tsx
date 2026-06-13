"use client";

import { useMemo } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { OPS_QUEUE_OWNERSHIP } from "@/data/ops/ops-queue-ownership";
import { getTeamWithLoad, partitionTeamByRole } from "@/lib/ops/roster";
import { OpsProtectedCapacityNote } from "./OpsProtectedCapacityNote";
import { OpsRosterTable } from "./OpsRosterTable";
import { OpsQueueOwnershipTable } from "./OpsQueueOwnershipTable";

interface Props {
  cases: OpsCase[];
}

export function OpsRosterWorkspace({ cases }: Props) {
  const teamWithLoad = useMemo(() => getTeamWithLoad(OPS_TEAM, cases), [cases]);
  const { officers, contractors } = useMemo(
    () => partitionTeamByRole(teamWithLoad),
    [teamWithLoad],
  );

  return (
    <div className="min-w-0 flex-1 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Roster & Assignment</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Roster shows planned ownership, load, and reserve capacity. High-priority queues need named
          owners and backups; officers cannot be fully consumed by routine intake.
        </p>
      </div>

      <OpsProtectedCapacityNote />

      <div className="space-y-5">
        <OpsRosterTable members={officers} groupLabel="Officers" />
        <OpsRosterTable members={contractors} groupLabel="Contractors" />
        <OpsQueueOwnershipTable rows={OPS_QUEUE_OWNERSHIP} />
      </div>
    </div>
  );
}
