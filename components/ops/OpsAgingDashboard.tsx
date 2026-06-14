"use client";

import { useMemo, useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { groupAgingCases, type OpsAgingGroupBy } from "@/lib/ops/aging";
import {
  EMPTY_CASE_FILTERS,
  filterOpsCases,
  OPS_AGING_BUCKET_OPTIONS,
  OPS_AGING_STREAM_OPTIONS,
  type OpsAgingBucketFilter,
  type OpsStreamFilter,
} from "@/lib/ops/filters";
import { OpsAgingGroupToggle } from "./OpsAgingGroupToggle";
import { OpsAgingBucketTable } from "./OpsAgingBucketTable";
import { OpsAgingLegend } from "./OpsAgingLegend";
import { OpsWaitingSplitPanel } from "./OpsWaitingSplitPanel";
import { OpsFilterBar } from "./filters/OpsFilterBar";
import { OpsFilterSelect } from "./filters/OpsFilterSelect";
import { OpsFilterEmptyState } from "./filters/OpsFilterEmptyState";

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
  const [filters, setFilters] = useState(EMPTY_CASE_FILTERS);

  const filteredCases = useMemo(() => filterOpsCases(cases, filters), [cases, filters]);

  const rows = useMemo(
    () => groupAgingCases(filteredCases, groupBy),
    [filteredCases, groupBy],
  );

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

  const resultCount = useMemo(
    () => rows.reduce((sum, row) => sum + row.total, 0),
    [rows],
  );

  const clearAll = () => setFilters(EMPTY_CASE_FILTERS);

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Aging & SLA</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/55">
          Aging is the early warning. Breach tells you the damage already happened; at-risk work is
          where the operation can still intervene.
        </p>
        <p className="mt-1 max-w-3xl text-[11px] text-ourox-ink/45">
          Buckets are based on percentage of each case&apos;s SLA consumed, not raw hours.
        </p>
      </div>

      <OpsFilterBar
        searchId="ops-aging-search"
        searchValue={filters.text}
        onSearchChange={(text) => setFilters((prev) => ({ ...prev, text }))}
        searchPlaceholder="Search aging records…"
        searchLabel="Search aging records"
        resultCount={resultCount}
        resultLabel={resultCount === 1 ? "case" : "cases"}
        filterValues={{
          stream: filters.stream,
          bucket: filters.bucket,
        }}
        onClearAll={clearAll}
      >
        <OpsFilterSelect<OpsStreamFilter>
          id="ops-aging-stream"
          label="Stream"
          value={filters.stream === "Urgent" ? "all" : filters.stream}
          options={OPS_AGING_STREAM_OPTIONS}
          onChange={(stream) => setFilters((prev) => ({ ...prev, stream }))}
        />
        <OpsFilterSelect<OpsAgingBucketFilter>
          id="ops-aging-bucket"
          label="Aging bucket"
          value={filters.bucket}
          options={OPS_AGING_BUCKET_OPTIONS}
          onChange={(bucket) => setFilters((prev) => ({ ...prev, bucket }))}
        />
      </OpsFilterBar>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <OpsAgingGroupToggle value={groupBy} onChange={setGroupBy} />
      </div>

      {resultCount === 0 ? (
        <OpsFilterEmptyState
          title="No aging records match the current filters."
          description="Clear filters or select another bucket to review active work."
        />
      ) : (
        <OpsAgingBucketTable rows={rows} groupLabel={GROUP_COLUMN_LABEL[groupBy]} />
      )}

      <OpsAgingLegend />

      <OpsWaitingSplitPanel
        waitingOnUs={totals.waitingOnUs}
        waitingOnExternal={totals.waitingOnExternal}
      />
    </div>
  );
}
