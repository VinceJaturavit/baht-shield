"use client";

// DisagreementCasesPanel — shows ML_HIGH_RULE_LOW and ML_LOW_RULE_HIGH cases.
// For each case, exposes feature values, ML probability, rule decision,
// and top drivers to answer: what did each system weight differently?

import { useState } from "react";
import type { MlVsRuleRecord } from "@/lib/arbiter/ml-artifacts";

interface Props {
  cases: MlVsRuleRecord[];
}

type FilterType = "all" | "ML_HIGH_RULE_LOW" | "ML_LOW_RULE_HIGH";

const DECISION_COLORS: Record<string, string> = {
  APPROVE:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  STEP_UP:  "text-sky-400 bg-sky-400/10 border-sky-400/20",
  REVIEW:   "text-amber-400 bg-amber-400/10 border-amber-400/20",
  BLOCK:    "text-red-400 bg-red-400/10 border-red-400/20",
};

function DecisionChip({ decision }: { decision: string }) {
  const cls = DECISION_COLORS[decision] ?? "text-ourox-ink/50 bg-ourox-obsidianMid border-transparent";
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 font-mono text-xs ${cls}`}>
      {decision}
    </span>
  );
}

function CaseCard({ c }: { c: MlVsRuleRecord }) {
  const [open, setOpen] = useState(false);
  const mlHighRuleLow = c.comparison_type === "ML_HIGH_RULE_LOW";

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-inset"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-ourox-ink/60">{c.event_id}</span>
          <span className="text-xs text-ourox-ink/40">{c.wallet_id}</span>
          <span
            className={`inline-block rounded px-1.5 py-0.5 font-mono text-xs ${
              mlHighRuleLow
                ? "bg-ourox-orange/10 text-ourox-orange border border-ourox-orange/20"
                : "bg-sky-400/10 text-sky-400 border border-sky-400/20"
            }`}
          >
            {c.comparison_type}
          </span>
          <span className="text-xs text-ourox-ink/40">{c.scenario_label}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <span className="text-xs text-ourox-ink/50">
            ML: <span className="font-mono text-ourox-ink/80">{Math.round(c.ml_probability * 100)}%</span>
          </span>
          <span className="text-xs text-ourox-ink/50">
            Rule score: <span className="font-mono text-ourox-ink/80">{c.rule_weighted_score}</span>
          </span>
          <DecisionChip decision={c.rule_decision} />
        </div>
      </button>

      {open && (
        <div className="border-t border-ourox-obsidianMid px-4 pb-4 pt-3">
          {/* Question framing */}
          <p className="mb-3 text-xs italic text-ourox-ink/50">
            {mlHighRuleLow
              ? "What did the model see that the rules did not?"
              : "What rule or policy signal did the model underweight?"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* ML drivers */}
            <div>
              <div className="mb-1.5 text-xs font-medium text-ourox-ink/60">
                Top ML drivers
              </div>
              <div className="space-y-1">
                {c.top_ml_drivers.map((d) => (
                  <div key={d.feature} className="flex items-center justify-between">
                    <span className="text-xs text-ourox-ink/70">{d.feature}</span>
                    <span
                      className={`font-mono text-xs ${
                        d.contribution >= 0 ? "text-ourox-orange/80" : "text-emerald-400"
                      }`}
                    >
                      {d.contribution >= 0 ? "+" : ""}{d.contribution.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule drivers */}
            <div>
              <div className="mb-1.5 text-xs font-medium text-ourox-ink/60">
                Top rule drivers
              </div>
              <div className="space-y-1">
                {c.top_rule_drivers.map((feat) => (
                  <div key={feat} className="text-xs text-ourox-ink/70">
                    {feat}
                  </div>
                ))}
                {c.rule_reason_codes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.rule_reason_codes.map((code) => (
                      <span
                        key={code}
                        className="rounded border border-ourox-obsidianMid bg-ourox-obsidianMid/60 px-1.5 py-0.5 font-mono text-xs text-ourox-ink/50"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature summary */}
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 border-t border-ourox-obsidianMid/50 pt-3 sm:grid-cols-3">
            {Object.entries(c.features)
              .filter(([, v]) => {
                const n = Number(v);
                return !isNaN(n) ? n !== 0 : Boolean(v);
              })
              .slice(0, 6)
              .map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-1.5">
                  <span className="text-xs text-ourox-ink/40">{k}:</span>
                  <span className="font-mono text-xs text-ourox-ink/70">
                    {typeof v === "boolean"
                      ? String(v)
                      : typeof v === "number"
                      ? v.toFixed(2)
                      : String(v)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DisagreementCasesPanel({ cases }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  const mlHighRuleLow = cases.filter((c) => c.comparison_type === "ML_HIGH_RULE_LOW");
  const mlLowRuleHigh = cases.filter((c) => c.comparison_type === "ML_LOW_RULE_HIGH");
  const displayed = filter === "all"
    ? cases
    : filter === "ML_HIGH_RULE_LOW"
    ? mlHighRuleLow
    : mlLowRuleHigh;

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">
        Disagreement cases
      </div>
      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        Cases where the ML model and the rule engine reach different assessments.
        These are the most analytically interesting events — they show where the
        two systems weighted signals differently.
      </p>

      {/* Summary counts */}
      <div className="mb-4 flex flex-wrap gap-3">
        {[
          { key: "all" as FilterType, label: "All disagreements", count: cases.length },
          { key: "ML_HIGH_RULE_LOW" as FilterType, label: "ML high / rule low", count: mlHighRuleLow.length },
          { key: "ML_LOW_RULE_HIGH" as FilterType, label: "Rule high / ML low", count: mlLowRuleHigh.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              filter === key
                ? "border-ourox-orange/40 bg-ourox-orange/10 text-ourox-orange"
                : "border-ourox-obsidianMid bg-ourox-obsidianMid/40 text-ourox-ink/50 hover:text-ourox-ink/70"
            }`}
          >
            {label}
            <span className="ml-1.5 font-mono">{count}</span>
          </button>
        ))}
      </div>

      {filter === "ML_HIGH_RULE_LOW" && (
        <p className="mb-3 text-xs italic text-ourox-ink/40">
          ML probability high, rule decision APPROVE or STEP_UP. The model
          detected signal the rules did not express.
        </p>
      )}
      {filter === "ML_LOW_RULE_HIGH" && (
        <p className="mb-3 text-xs italic text-ourox-ink/40">
          Rule decision REVIEW or BLOCK, ML probability low. The rule captured
          a policy signal the model underweighted on this synthetic dataset.
        </p>
      )}

      <div className="space-y-2">
        {displayed.map((c) => (
          <CaseCard key={c.event_id} c={c} />
        ))}
        {displayed.length === 0 && (
          <p className="text-xs text-ourox-ink/30">No cases in this category.</p>
        )}
      </div>
    </div>
  );
}
