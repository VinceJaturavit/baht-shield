"use client";

import type { FeedbackBacktestResult } from "@/lib/arbiter/feedback-backtest";

interface Props {
  result: FeedbackBacktestResult;
}

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function deltaStr(v: number, isPct = false) {
  if (v === 0) return "0";
  const s = isPct ? pct(Math.abs(v)) : String(Math.abs(v));
  return v > 0 ? `+${s}` : `-${s}`;
}

export function BacktestSimulationPanel({ result }: Props) {
  const { baselineMetrics, candidateMetrics, delta, missCluster } = result;

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <h3 className="mb-1 text-sm font-semibold tracking-wide text-ourox-ink">
        Back-test simulation
      </h3>
      <p className="mb-4 text-xs text-ourox-ink/40">
        Labelled synthetic set — baseline uses current rule decisions from artifacts.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <MetricBlock label="Baseline" metrics={baselineMetrics} />
        <MetricBlock label="Candidate (simulated)" metrics={candidateMetrics} />
      </div>

      <div className="mb-4 rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/50 p-3">
        <p className="mb-2 text-xs font-semibold text-ourox-ink/50">Delta (candidate − baseline)</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-ourox-ink/70 sm:grid-cols-4">
          <span>TP {deltaStr(delta.tp)}</span>
          <span>FP {deltaStr(delta.fp)}</span>
          <span>FN {deltaStr(delta.fn)}</span>
          <span>TN {deltaStr(delta.tn)}</span>
          <span>Precision {deltaStr(delta.precision, true)}</span>
          <span>Recall {deltaStr(delta.recall, true)}</span>
          <span>FPR {deltaStr(delta.falsePositiveRate, true)}</span>
          <span>F1 {deltaStr(delta.f1, true)}</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Highlight
          label="Misses caught"
          value={`${missCluster.caughtByCandidate} / ${missCluster.totalMisses}`}
          sub={`${pct(missCluster.recallGainOnMissCluster)} of ML-high / rule-low cluster`}
        />
        <Highlight
          label="Added false positives"
          value={String(result.addedFalsePositives)}
          sub="New REVIEW/BLOCK on background"
        />
        <Highlight
          label="Precision cost"
          value={deltaStr(delta.precision, true)}
          sub={`FPR change ${deltaStr(delta.falsePositiveRate, true)}`}
        />
      </div>

      <p className="text-sm leading-6 text-ourox-ink/60">
        Back-test result: the candidate catches {missCluster.caughtByCandidate} of{" "}
        {missCluster.totalMisses} ML-high / rule-low misses. Cost: {result.addedFalsePositives}{" "}
        additional false positives and a precision change of {deltaStr(delta.precision, true)}{" "}
        points. This is a simulation only; the live JDM is unchanged.
      </p>
    </div>
  );
}

function MetricBlock({
  label,
  metrics,
}: {
  label: string;
  metrics: FeedbackBacktestResult["baselineMetrics"];
}) {
  return (
    <div className="rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/50 p-3">
      <div className="mb-2 text-xs font-semibold text-ourox-ink/50">{label}</div>
      <div className="space-y-1 font-mono text-xs text-ourox-ink/70">
        <div>Precision {pct(metrics.precision)}</div>
        <div>Recall {pct(metrics.recall)}</div>
        <div>FPR {pct(metrics.falsePositiveRate)}</div>
        <div>F1 {pct(metrics.f1)}</div>
      </div>
    </div>
  );
}

function Highlight({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/50 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ourox-ink/35">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-ourox-ink">{value}</div>
      <div className="mt-0.5 text-[10px] text-ourox-ink/40">{sub}</div>
    </div>
  );
}
