"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SeverityBadge } from "./SeverityBadge";
import { severityRank } from "@/lib/metrics";
import type { Alert } from "@/lib/types";

interface AlertQueueTableProps {
  alerts: Alert[];
}

type SortDir = "desc" | "asc";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_review: "In Review",
  escalated: "Escalated",
  closed: "Closed",
};

export function AlertQueueTable({ alerts }: AlertQueueTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Unique statuses from data
  const allStatuses = useMemo(
    () => Array.from(new Set(alerts.map((a) => a.status))).sort(),
    [alerts]
  );

  const filtered = useMemo(() => {
    const base =
      statusFilter === "all"
        ? alerts
        : alerts.filter((a) => a.status === statusFilter);

    return [...base].sort((a, b) => {
      const diff = severityRank(b.severity) - severityRank(a.severity);
      return sortDir === "desc" ? diff : -diff;
    });
  }, [alerts, statusFilter, sortDir]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-signal-secondary">
            Status
          </span>
          <div className="flex flex-wrap gap-1">
            {["all", ...allStatuses].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
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
            className="flex items-center gap-1 rounded-signalSm border border-signal-border bg-white px-3 py-1.5 text-xs font-medium text-signal-body transition-colors hover:bg-signal-muted"
          >
            {sortDir === "desc" ? "High → Low" : "Low → High"}
            <span className="text-signal-faint">{sortDir === "desc" ? "↓" : "↑"}</span>
          </button>
        </div>
      </div>

      {/* Count summary */}
      <p className="mb-3 text-[13px] text-signal-secondary">
        Showing{" "}
        <span className="font-semibold tabular-nums text-signal-heading">
          {filtered.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold tabular-nums text-signal-heading">
          {alerts.length}
        </span>{" "}
        alerts
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-signal border border-signal-border bg-white shadow-signal">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-signal-border bg-signal-muted">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Alert ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Rule / Pattern
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary hover:text-signal-heading"
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                >
                  Severity {sortDir === "desc" ? "↓" : "↑"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Wallet ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-signal-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr
                  key={alert.alert_id}
                  onClick={() => router.push(`/wallet/${alert.wallet_id}`)}
                  className="cursor-pointer border-b border-signal-borderSubtle last:border-0 transition-colors hover:bg-signal-bg"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-signal-secondary">
                    {alert.alert_id}
                  </td>
                  <td className="max-w-xs px-4 py-3.5 text-sm text-signal-body">
                    <span className="block truncate" title={alert.rule_name}>
                      {alert.rule_name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-signal-accent">
                    {alert.wallet_id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <StatusBadge status={alert.status} />
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
