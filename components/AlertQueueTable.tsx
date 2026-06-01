"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SeverityBadge } from "./SeverityBadge";
import { severityRank } from "@/lib/metrics";
import { getEnrichedAlertRows, getAlertQueueKpis, applyAlertSavedView } from "@/lib/alert-queue";
import { AlertQueueKpiStrip } from "./alerts/AlertQueueKpiStrip";
import { SavedViewTabs } from "./alerts/SavedViewTabs";
import { AlertQueueFilterChips } from "./alerts/AlertQueueFilterChips";
import { ScenarioChip } from "./alerts/ScenarioChip";
import type { AlertSavedView } from "@/lib/types";

type SortDir = "desc" | "asc";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_review: "In Review",
  escalated: "Escalated",
  closed: "Closed",
};

function formatTHB(amount: number): string {
  if (amount <= 0) return "—";
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(0)}K`;
  return `฿${amount.toLocaleString("th-TH")}`;
}

// All enriched rows computed once at module level (pure derivation from seed)
const ALL_ENRICHED_ROWS = getEnrichedAlertRows();
const ALL_KPIS = getAlertQueueKpis(ALL_ENRICHED_ROWS);
const ALL_STATUSES = Array.from(new Set(ALL_ENRICHED_ROWS.map((r) => r.status))).sort();

export function AlertQueueTable() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [savedView, setSavedView] = useState<AlertSavedView>("all");

  const filtered = useMemo(() => {
    // 1. Apply saved view preset
    let rows = applyAlertSavedView(ALL_ENRICHED_ROWS, savedView);

    // 2. Apply status filter
    if (statusFilter !== "all") {
      rows = rows.filter((r) => r.status === statusFilter);
    }

    // 3. Apply severity sort
    return [...rows].sort((a, b) => {
      const diff = severityRank(b.severity) - severityRank(a.severity);
      return sortDir === "desc" ? diff : -diff;
    });
  }, [statusFilter, sortDir, savedView]);

  const handleClearView = () => setSavedView("all");
  const handleClearStatus = () => setStatusFilter("all");

  return (
    <div>
      {/* KPI strip */}
      <AlertQueueKpiStrip kpis={ALL_KPIS} />

      {/* Saved views */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SavedViewTabs activeView={savedView} onViewChange={setSavedView} />
      </div>

      {/* Active filter chips */}
      <div className="mb-3">
        <AlertQueueFilterChips
          activeView={savedView}
          statusFilter={statusFilter}
          onClearView={handleClearView}
          onClearStatus={handleClearStatus}
        />
      </div>

      {/* Controls — status filter + severity sort */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-signal-secondary">
            Status
          </span>
          <div className="flex flex-wrap gap-1">
            {["all", ...ALL_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent ${
                  statusFilter === s
                    ? "bg-signal-accentSubtle text-signal-accent ring-1 ring-signal-accentBorder"
                    : "bg-signal-muted text-signal-secondary hover:bg-signal-border/60 hover:text-signal-heading"
                }`}
              >
                {s === "all" ? "All" : (STATUS_LABELS[s] ?? s)}
              </button>
            ))}
          </div>
        </div>

        {/* Severity sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-signal-secondary">
            Severity
          </span>
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1 rounded-signalSm border border-signal-border bg-white px-3 py-1.5 text-xs font-medium text-signal-body transition-colors hover:bg-signal-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent"
          >
            {sortDir === "desc" ? "High → Low" : "Low → High"}
            <span className="text-signal-faint">{sortDir === "desc" ? "↓" : "↑"}</span>
          </button>
        </div>
      </div>

      {/* Count summary */}
      <p className="mb-3 text-[13px] text-signal-secondary">
        Showing{" "}
        <span className="font-semibold tabular-nums text-signal-heading">{filtered.length}</span>
        {" "}of{" "}
        <span className="font-semibold tabular-nums text-signal-heading">{ALL_ENRICHED_ROWS.length}</span>
        {" "}alerts
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-signal border border-signal-border bg-white shadow-signal">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full">
            <thead>
              <tr className="border-b border-signal-border bg-signal-muted">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Alert
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary hover:text-signal-heading focus:outline-none focus-visible:underline"
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                    }
                  }}
                  aria-sort={sortDir === "desc" ? "descending" : "ascending"}
                >
                  Severity {sortDir === "desc" ? "↓" : "↑"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Scenario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Linked Pattern
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Links
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Case Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Next Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.alert_id}
                  onClick={() => router.push(`/wallet/${row.wallet_id}`)}
                  className="cursor-pointer border-b border-signal-borderSubtle last:border-0 transition-colors hover:bg-signal-bg"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/wallet/${row.wallet_id}`);
                    }
                  }}
                  aria-label={`Alert ${row.alert_id}, wallet ${row.wallet_id}`}
                >
                  {/* ALERT — stacked: alert_id, wallet_id · rule_name */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs font-medium text-signal-heading">
                        {row.alert_id}
                      </span>
                      <span className="font-mono text-[11px] text-signal-accent">
                        {row.wallet_id}
                      </span>
                      <span
                        className="max-w-[200px] truncate text-[11px] text-signal-secondary"
                        title={row.rule_name}
                      >
                        {row.rule_name}
                      </span>
                    </div>
                  </td>

                  {/* SEVERITY */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <SeverityBadge severity={row.severity} />
                  </td>

                  {/* SCENARIO */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <ScenarioChip scenario={row.scenario} />
                  </td>

                  {/* LINKED PATTERN */}
                  <td className="px-4 py-3.5">
                    {row.linked_pattern_id ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs text-signal-body">
                          {row.linked_pattern_id}
                        </span>
                        {row.linked_pattern_name && (
                          <span className="text-[11px] text-signal-secondary">
                            {row.linked_pattern_name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-signal-faint">—</span>
                    )}
                  </td>

                  {/* LINKS */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-signal-body">
                    <span>{row.linked_wallet_count} wallet{row.linked_wallet_count !== 1 ? "s" : ""}</span>
                    <span className="mx-1 text-signal-faint">/</span>
                    <span>{row.linked_case_count} case{row.linked_case_count !== 1 ? "s" : ""}</span>
                  </td>

                  {/* CASE AGE */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {row.alert_age_label ? (
                      <span
                        className="text-xs text-signal-body"
                        title="Source: linked case opened_at"
                      >
                        {row.alert_age_label}
                      </span>
                    ) : (
                      <span className="text-sm text-signal-faint">—</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* NEXT ACTION */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-signal-body">
                      {row.next_action_hint}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-signal-secondary">
            No alerts match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const dotStyles: Record<string, string> = {
    new: "bg-signal-accent",
    in_review: "bg-severity-medium",
    escalated: "bg-severity-high",
    closed: "bg-signal-faint",
  };
  const key = (status ?? "").toLowerCase();
  const dot = dotStyles[key] ?? "bg-signal-faint";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-white px-2.5 py-0.5 text-xs font-medium text-signal-body">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[key] ?? status}
    </span>
  );
}
