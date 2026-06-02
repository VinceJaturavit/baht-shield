"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getEnrichedCaseRows,
  getCasesKpis,
  applyCaseSavedView,
  applyCaseDecisionFilter,
  applyDefaultCaseOrdering,
} from "@/lib/cases";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ScenarioChip } from "@/components/alerts/ScenarioChip";
import { CasesKpiStrip } from "./CasesKpiStrip";
import { CaseSavedViews } from "./CaseSavedViews";
import { CaseFilterChips } from "./CaseFilterChips";
import type { CaseSavedView } from "@/lib/types";

function formatTHB(amount: number): string {
  if (amount <= 0) return "—";
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(0)}K`;
  return `฿${amount.toLocaleString("th-TH")}`;
}

const DECISION_STATUS_DOT: Record<string, string> = {
  escalated: "bg-signal-amber",
  needs_closure: "bg-signal-accent",
  open: "bg-signal-indigo",
  resolved: "bg-signal-slate",
  closed: "bg-signal-faintSlate",
};

const DECISION_STATUS_LABEL: Record<string, string> = {
  escalated: "Escalated",
  needs_closure: "Needs closure",
  open: "Open",
  resolved: "Resolved",
  closed: "Closed",
};

// Compute once at module level — pure derivation from seed
const ALL_ROWS = getEnrichedCaseRows();
const ALL_KPIS = getCasesKpis(ALL_ROWS);
const ALL_DECISIONS = Array.from(new Set(ALL_ROWS.map((r) => (r.decision ?? "").toLowerCase()))).sort();

export function CasesTable() {
  const router = useRouter();
  const [savedView, setSavedView] = useState<CaseSavedView>("open_needs_closure");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let rows = applyCaseSavedView(ALL_ROWS, savedView);
    rows = applyCaseDecisionFilter(rows, decisionFilter);
    return applyDefaultCaseOrdering(rows);
  }, [savedView, decisionFilter]);

  const handleClearView = () => setSavedView("all");
  const handleClearDecision = () => setDecisionFilter("all");

  return (
    <div>
      {/* KPI strip */}
      <CasesKpiStrip kpis={ALL_KPIS} />

      {/* Saved views */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <CaseSavedViews activeView={savedView} onViewChange={setSavedView} />
      </div>

      {/* Active filter chips */}
      <div className="mb-3">
        <CaseFilterChips
          activeView={savedView}
          decisionFilter={decisionFilter}
          onClearView={handleClearView}
          onClearDecision={handleClearDecision}
        />
      </div>

      {/* Decision filter */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-signal-secondary">
          Decision
        </span>
        <div className="flex flex-wrap gap-2">
          {["all", ...ALL_DECISIONS].map((d) => (
            <button
              key={d}
              onClick={() => setDecisionFilter(d)}
              className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent ${
                decisionFilter === d
                  ? "border border-signal-accentBorder bg-signal-accentSubtle text-signal-accent"
                  : "border border-signal-border bg-signal-muted text-signal-secondary hover:bg-signal-border/60 hover:text-signal-heading"
              }`}
            >
              {d === "all" ? "All decisions" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Count summary */}
      <p className="mb-3 text-[13px] text-signal-secondary">
        Showing{" "}
        <span className="font-semibold tabular-nums text-signal-heading">{filtered.length}</span>
        {" "}of{" "}
        <span className="font-semibold tabular-nums text-signal-heading">{ALL_ROWS.length}</span>
        {" "}cases
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
            <thead>
              <tr className="border-b border-signal-border bg-signal-surfaceSubtle">
                <th className="w-36 px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Case
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Scenario
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Linked Wallet
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Linked Pattern
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Owner
                </th>
                <th className="w-32 whitespace-nowrap px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Decision / Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Synthetic Loss
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Opened / Age
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-signal-meta">
                  Next Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.case_id}
                  onClick={() => router.push(`/cases/${row.case_id}`)}
                  className="cursor-pointer border-b border-signal-borderSubtle last:border-0 transition-colors hover:bg-signal-surfaceSubtle focus:outline-none focus-visible:bg-signal-indigoSubtle focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal-indigoBorder"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/cases/${row.case_id}`);
                    }
                  }}
                  aria-label={`Case ${row.case_id}, decision ${row.decision}, status ${row.investigation_status}`}
                >
                  {/* CASE */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5 max-w-[132px]">
                      <span className="font-mono text-xs font-semibold text-signal-heading truncate">
                        {row.case_id}
                      </span>
                      <span className="font-mono text-[11px] text-signal-secondary truncate">
                        {row.alert_id}
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

                  {/* LINKED WALLET */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {row.wallet_id ? (
                      <Link
                        href={`/wallet/${row.wallet_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
                        aria-label={`Open wallet ${row.wallet_id}`}
                      >
                        {row.wallet_id}
                      </Link>
                    ) : (
                      <span className="text-sm text-signal-faint">—</span>
                    )}
                  </td>

                  {/* LINKED PATTERN */}
                  <td className="px-4 py-3.5">
                    {row.linked_pattern_id ? (
                      <Link
                        href={`/patterns?patternId=${row.linked_pattern_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col gap-0.5 focus:outline-none focus-visible:underline"
                        aria-label={`Open pattern ${row.linked_pattern_id}`}
                      >
                        <span className="font-mono text-xs text-signal-indigo hover:underline">
                          {row.linked_pattern_id}
                        </span>
                        {row.linked_pattern_name && (
                          <span className="text-[11px] text-signal-secondary">
                            {row.linked_pattern_name}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-sm text-signal-faint">—</span>
                    )}
                  </td>

                  {/* OWNER */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-signal-body">
                    {row.owner || (
                      <span className="text-signal-faint">Unassigned</span>
                    )}
                  </td>

                  {/* DECISION / STATUS */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-signal-body">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${DECISION_STATUS_DOT[row.investigation_status] ?? "bg-signal-faintSlate"}`}
                      />
                      {DECISION_STATUS_LABEL[row.investigation_status] ?? row.investigation_status}
                    </span>
                  </td>

                  {/* SYNTHETIC LOSS */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold tabular-nums text-signal-heading">
                    {formatTHB(row.loss_amount)}
                  </td>

                  {/* OPENED / AGE */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-signal-body">{row.opened_at}</span>
                      {row.age_label ? (
                        <span
                          className="text-[11px] text-signal-secondary"
                          title="Age from case opened_at"
                        >
                          {row.age_label}
                        </span>
                      ) : (
                        <span className="text-[11px] text-signal-faint">—</span>
                      )}
                    </div>
                  </td>

                  {/* NEXT ACTION */}
                  <td className="px-4 py-3.5 text-xs text-signal-body">
                    {row.next_action_hint}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-signal-slate">
            No cases match the current filter. Clear a filter or saved view to see more.
          </div>
        )}
      </div>
    </div>
  );
}
