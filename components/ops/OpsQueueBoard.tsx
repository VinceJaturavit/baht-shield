"use client";

import { useMemo, useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { buildSortedQueueSections } from "@/lib/ops/queue";
import { sortByImpactThenSla } from "@/lib/ops/impact";
import {
  EMPTY_CASE_FILTERS,
  filterOpsCases,
  OPS_AGING_BUCKET_OPTIONS,
  OPS_IMPACT_TIER_OPTIONS,
  OPS_QUEUE_STREAM_OPTIONS,
  type OpsAgingBucketFilter,
  type OpsImpactTierFilter,
  type OpsStreamFilter,
} from "@/lib/ops/filters";
import { OpsFilterBar } from "./filters/OpsFilterBar";
import { OpsFilterSelect } from "./filters/OpsFilterSelect";
import { OpsFilterEmptyState } from "./filters/OpsFilterEmptyState";
import { OpsQueueList } from "./OpsQueueList";

interface Props {
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
}

type QueueView = "urgent" | "by-stream" | "impact";

export function OpsQueueBoard({ cases, selectedId, onSelect }: Props) {
  const [view, setView] = useState<QueueView>("by-stream");
  const [filters, setFilters] = useState(EMPTY_CASE_FILTERS);

  const filteredCases = useMemo(() => filterOpsCases(cases, filters), [cases, filters]);

  const { urgentCases, mainQueueCases } = useMemo(
    () => buildSortedQueueSections(filteredCases, "all"),
    [filteredCases],
  );

  const impactCases = useMemo(
    () => sortByImpactThenSla(filteredCases),
    [filteredCases],
  );

  const visibleCases =
    view === "urgent" ? urgentCases : view === "impact" ? impactCases : mainQueueCases;

  const clearAll = () => setFilters(EMPTY_CASE_FILTERS);

  return (
    <div className="space-y-4">
      <OpsFilterBar
        searchId="ops-queue-search"
        searchValue={filters.text}
        onSearchChange={(text) => setFilters((prev) => ({ ...prev, text }))}
        searchPlaceholder="Search cases…"
        searchLabel="Search cases"
        resultCount={visibleCases.length}
        resultLabel={visibleCases.length === 1 ? "case" : "cases"}
        filterValues={{
          stream: filters.stream,
          bucket: filters.bucket,
          impactTier: filters.impactTier,
        }}
        onClearAll={clearAll}
      >
        <OpsFilterSelect<OpsStreamFilter>
          id="ops-queue-stream"
          label="Stream"
          value={filters.stream}
          options={OPS_QUEUE_STREAM_OPTIONS}
          onChange={(stream) => setFilters((prev) => ({ ...prev, stream }))}
        />
        <OpsFilterSelect<OpsAgingBucketFilter>
          id="ops-queue-bucket"
          label="SLA state"
          value={filters.bucket}
          options={OPS_AGING_BUCKET_OPTIONS}
          onChange={(bucket) => setFilters((prev) => ({ ...prev, bucket }))}
        />
        <OpsFilterSelect<OpsImpactTierFilter>
          id="ops-queue-impact"
          label="Impact tier"
          value={filters.impactTier}
          options={OPS_IMPACT_TIER_OPTIONS}
          onChange={(impactTier) => setFilters((prev) => ({ ...prev, impactTier }))}
        />
      </OpsFilterBar>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-1 rounded border border-ourox-obsidianMid p-0.5"
          role="group"
          aria-label="Queue view"
        >
          <button
            type="button"
            onClick={() => setView("by-stream")}
            aria-pressed={view === "by-stream"}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              view === "by-stream"
                ? "bg-ourox-orange/10 text-ourox-orange"
                : "text-ourox-ink/60 hover:text-ourox-ink"
            }`}
          >
            By stream
          </button>
          <button
            type="button"
            onClick={() => setView("urgent")}
            aria-pressed={view === "urgent"}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              view === "urgent"
                ? "bg-ourox-orange/10 text-ourox-orange"
                : "text-ourox-ink/60 hover:text-ourox-ink"
            }`}
          >
            Urgent
          </button>
          <button
            type="button"
            onClick={() => setView("impact")}
            aria-pressed={view === "impact"}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              view === "impact"
                ? "bg-ourox-orange/10 text-ourox-orange"
                : "text-ourox-ink/60 hover:text-ourox-ink"
            }`}
          >
            Impact
          </button>
        </div>
      </div>

      {visibleCases.length === 0 ? (
        <OpsFilterEmptyState
          title="No cases match the current filters."
          description="Clear filters or broaden the search to return more cases."
        />
      ) : view === "urgent" ? (
        <section aria-labelledby="ops-urgent-overlay">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded border border-ourox-orange/50 text-[9px] font-bold text-ourox-orange"
              aria-hidden="true"
            >
              !
            </span>
            <h3
              id="ops-urgent-overlay"
              className="text-xs font-semibold uppercase tracking-wider text-ourox-ink"
            >
              Urgent overlay
            </h3>
            <span className="text-[11px] tabular-nums text-ourox-ink/50">
              {urgentCases.length} cases
            </span>
          </div>
          <p className="mb-3 max-w-2xl text-xs leading-relaxed text-ourox-ink/55">
            Cross-stream cases routed above standard queues because cost of delay is high.
          </p>

          <OpsQueueList
            cases={urgentCases}
            selectedId={selectedId}
            onSelect={onSelect}
            labelledBy="ops-urgent-overlay"
          />
        </section>
      ) : view === "impact" ? (
        <section aria-labelledby="ops-impact-overlay">
          <div className="mb-2 flex items-center gap-2">
            <h3
              id="ops-impact-overlay"
              className="text-xs font-semibold uppercase tracking-wider text-ourox-ink"
            >
              Impact overlay
            </h3>
            <span className="text-[11px] tabular-nums text-ourox-ink/50">
              {impactCases.length} cases
            </span>
          </div>
          <p className="mb-3 max-w-2xl text-xs leading-relaxed text-ourox-ink/55">
            Impact shows consequence-of-delay: money at risk, reputational pressure, and incident
            severity. SLA pressure shows time-to-breach. A manager triages on both.
          </p>

          <OpsQueueList
            cases={impactCases}
            selectedId={selectedId}
            onSelect={onSelect}
            labelledBy="ops-impact-overlay"
          />
        </section>
      ) : (
        <section aria-labelledby="ops-main-queue">
          <div className="mb-3">
            <h3
              id="ops-main-queue"
              className="text-xs font-semibold uppercase tracking-wider text-ourox-ink/70"
            >
              Stream queue — priority then SLA pressure
            </h3>
            <p className="mt-1 text-[11px] text-ourox-ink/45">
              {mainQueueCases.length} cases · urgent overlay excluded
            </p>
          </div>

          <OpsQueueList
            cases={mainQueueCases}
            selectedId={selectedId}
            onSelect={onSelect}
            labelledBy="ops-main-queue"
          />
        </section>
      )}
    </div>
  );
}
