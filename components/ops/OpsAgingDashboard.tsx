"use client";

import { useMemo, useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { groupAgingCases, type OpsAgingGroupBy } from "@/lib/ops/aging";
import { OpsAgingGroupToggle } from "./OpsAgingGroupToggle";
import { OpsAgingBucketTable } from "./OpsAgingBucketTable";
import { OpsAgingLegend } from "./OpsAgingLegend";
import { OpsWaitingSplitPanel } from "./OpsWaitingSplitPanel";

interface Props {
  cases: OpsCase[];
}

const GROUP_COLUMN_LABEL: Record<OpsAgingGroupBy, string> = {
  queue: "Queue",
  owner: "Owner",
  caseType: "Case type",
};

export function OpsAgingDashboard({ cases }: Props) {
  const [groupBy, setGroupBy] = useState<OpsAgingGroupBy>("queue");

  const rows = useMemo(() => groupAgingCases(cases, groupBy), [cases, groupBy]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          waitingOnUs: acc.waitingOnUs + row.waitingOnUs,
          waitingOnExternal: acc.waitingOnExternal + row.waitingOnExternal,
        }),
        { waitingOnUs: 0, waitingOnExternal: 0 },
      ),
    [rows],
  );

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Aging & SLA</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Aging is the early warning. Breach tells you the damage already happened; at-risk work is
          where the operation can still intervene.
        </p>
        <p className="mt-1 max-w-3xl text-[11px] text-ourox-ink/45">
          Buckets are based on percentage of each case&apos;s SLA consumed, not raw hours.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <OpsAgingGroupToggle value={groupBy} onChange={setGroupBy} />
      </div>

      <OpsAgingBucketTable rows={rows} groupLabel={GROUP_COLUMN_LABEL[groupBy]} />

      <OpsAgingLegend />

      <OpsWaitingSplitPanel
        waitingOnUs={totals.waitingOnUs}
        waitingOnExternal={totals.waitingOnExternal}
      />
    </div>
  );
}
