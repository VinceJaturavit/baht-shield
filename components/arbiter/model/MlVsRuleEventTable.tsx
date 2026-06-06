"use client";

// MlVsRuleEventTable — side-by-side ML vs rule score for all events.
// Sortable, filterable. Scenario label shown only as evaluation metadata.

import { useState, useMemo } from "react";
import type { MlVsRuleRecord, ComparisonType } from "@/lib/arbiter/ml-artifacts";

interface Props {
  records: MlVsRuleRecord[];
}

type SortKey = "ml_probability" | "rule_weighted_score" | "disagreement";

const COMPARISON_COLORS: Record<ComparisonType, string> = {
  AGREE_HIGH:       "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  AGREE_LOW:        "text-ourox-ink/40 bg-ourox-obsidianMid/40 border-ourox-obsidianMid",
  ML_HIGH_RULE_LOW: "text-ourox-orange bg-ourox-orange/10 border-ourox-orange/20",
  ML_LOW_RULE_HIGH: "text-sky-400 bg-sky-400/10 border-sky-400/20",
};

const DECISION_COLORS: Record<string, string> = {
  APPROVE:  "text-emerald-400",
  STEP_UP:  "text-sky-400",
  REVIEW:   "text-amber-400",
  BLOCK:    "text-red-400",
};

const ALL_SCENARIOS = [
  "all",
  "onboarding_mule_farm",
  "sleeper_activation",
  "app_scam_cashout",
  "background",
] as const;

const ALL_COMPARISON_TYPES: Array<ComparisonType | "all"> = [
  "all",
  "ML_HIGH_RULE_LOW",
  "ML_LOW_RULE_HIGH",
  "AGREE_HIGH",
  "AGREE_LOW",
];

export function MlVsRuleEventTable({ records }: Props) {
  const [scenarioFilter, setScenarioFilter]     = useState<string>("all");
  const [comparisonFilter, setComparisonFilter] = useState<ComparisonType | "all">("all");
  const [sortKey, setSortKey]                   = useState<SortKey>("ml_probability");
  const [page, setPage]                         = useState(0);
  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    let rows = records;
    if (scenarioFilter !== "all")   rows = rows.filter((r) => r.scenario_label === scenarioFilter);
    if (comparisonFilter !== "all") rows = rows.filter((r) => r.comparison_type === comparisonFilter);

    rows = [...rows].sort((a, b) => {
      if (sortKey === "ml_probability")   return b.ml_probability - a.ml_probability;
      if (sortKey === "rule_weighted_score") return b.rule_weighted_score - a.rule_weighted_score;
      // Sort by disagreement: ML_HIGH_RULE_LOW and ML_LOW_RULE_HIGH first
      const disagree = (r: MlVsRuleRecord) =>
        r.comparison_type === "ML_HIGH_RULE_LOW" || r.comparison_type === "ML_LOW_RULE_HIGH" ? 0 : 1;
      return disagree(a) - disagree(b) || Math.abs(b.ml_probability - (b.rule_weighted_score / 100)) - Math.abs(a.ml_probability - (a.rule_weighted_score / 100));
    });

    return rows;
  }, [records, scenarioFilter, comparisonFilter, sortKey]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">
        ML vs rule — all events
      </div>
      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        Side-by-side comparison of ML probability and rule-weighted score for
        every event in the evaluation set. Scenario label is shown as
        evaluation metadata only — it is not a runtime feature.
      </p>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-xs text-ourox-ink/40">Scenario</label>
          <select
            value={scenarioFilter}
            onChange={(e) => { setScenarioFilter(e.target.value); setPage(0); }}
            className="rounded border border-ourox-obsidianMid bg-ourox-obsidian px-2 py-1 text-xs text-ourox-ink/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
          >
            {ALL_SCENARIOS.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All scenarios" : s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ourox-ink/40">Comparison type</label>
          <select
            value={comparisonFilter}
            onChange={(e) => { setComparisonFilter(e.target.value as ComparisonType | "all"); setPage(0); }}
            className="rounded border border-ourox-obsidianMid bg-ourox-obsidian px-2 py-1 text-xs text-ourox-ink/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
          >
            {ALL_COMPARISON_TYPES.map((t) => (
              <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ourox-ink/40">Sort</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded border border-ourox-obsidianMid bg-ourox-obsidian px-2 py-1 text-xs text-ourox-ink/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
          >
            <option value="ml_probability">ML probability desc</option>
            <option value="rule_weighted_score">Rule score desc</option>
            <option value="disagreement">Disagreements first</option>
          </select>
        </div>
      </div>

      <p className="mb-2 text-xs text-ourox-ink/30">
        Showing {rows.length} of {filtered.length} events
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid">
              {["Event", "Wallet", "Scenario", "ML %", "Rule score", "Decision", "Type", "Top ML driver"].map(
                (h) => (
                  <th
                    key={h}
                    className="pb-2 pr-4 text-left font-medium text-ourox-ink/40"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.event_id}
                className="border-b border-ourox-obsidianMid/40 hover:bg-ourox-obsidianLight/20"
              >
                <td className="py-2 pr-4 font-mono text-ourox-ink/60">
                  {r.event_id}
                </td>
                <td className="py-2 pr-4 font-mono text-ourox-ink/50">
                  {r.wallet_id}
                </td>
                <td className="py-2 pr-4 text-ourox-ink/50">
                  {r.scenario_label}
                </td>
                <td className="py-2 pr-4 font-mono">
                  <span
                    className={
                      r.ml_probability >= 0.5
                        ? "text-ourox-orange"
                        : "text-ourox-ink/50"
                    }
                  >
                    {Math.round(r.ml_probability * 100)}%
                  </span>
                </td>
                <td className="py-2 pr-4 font-mono text-ourox-ink/60">
                  {r.rule_weighted_score.toFixed(1)}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      DECISION_COLORS[r.rule_decision] ?? "text-ourox-ink/50"
                    }
                  >
                    {r.rule_decision}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-xs ${
                      COMPARISON_COLORS[r.comparison_type]
                    }`}
                  >
                    {r.comparison_type.replace("_", " ")}
                  </span>
                </td>
                <td className="py-2 pr-4 text-ourox-ink/50">
                  {r.top_ml_drivers[0]?.feature ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-ourox-obsidianMid px-2 py-1 text-xs text-ourox-ink/50 hover:text-ourox-ink/80 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-xs text-ourox-ink/40">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-ourox-obsidianMid px-2 py-1 text-xs text-ourox-ink/50 hover:text-ourox-ink/80 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
