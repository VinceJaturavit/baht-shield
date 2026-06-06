"use client";

// HeldoutMetricsPanel — shows held-out evaluation metrics from the offline LR.
// Metrics are read from static JSON artifact (ml_heldout_metrics.json).
// No runtime computation, no API call.

import type { MlHeldoutMetrics } from "@/lib/arbiter/ml-artifacts";

interface Props {
  metrics: MlHeldoutMetrics;
}

function MetricBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ourox-obsidianMid">
        <div
          className="h-full rounded-full bg-ourox-orange/70"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs text-ourox-ink/60">{pct}%</span>
    </div>
  );
}

export function HeldoutMetricsPanel({ metrics }: Props) {
  const cm = metrics.confusion_matrix;

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">
        Held-out metrics
      </div>
      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        Computed on {metrics.support.total_test} events held out from training
        ({Math.round(metrics.train_test_split.test_fraction * 100)}% test split,
        seed {metrics.train_test_split.random_seed}). Synthetic evaluation data
        only — not used for training.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Precision", value: metrics.precision },
          { label: "Recall", value: metrics.recall },
          { label: "F1", value: metrics.f1 },
          { label: "ROC AUC", value: metrics.roc_auc },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-xs text-ourox-ink/50">{label}</div>
            <div className="mt-0.5 text-lg font-semibold text-ourox-ink">
              {(value * 100).toFixed(1)}%
            </div>
            <MetricBar value={value} />
          </div>
        ))}
      </div>

      {/* Confusion matrix */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-medium text-ourox-ink/60">
          Confusion matrix (threshold {metrics.threshold})
        </div>
        <div className="grid w-fit grid-cols-2 gap-1">
          {[
            { label: "TP", value: cm.tp, color: "text-emerald-400" },
            { label: "FP", value: cm.fp, color: "text-red-400" },
            { label: "FN", value: cm.fn, color: "text-amber-400" },
            { label: "TN", value: cm.tn, color: "text-ourox-ink/50" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="w-20 rounded border border-ourox-obsidianMid bg-ourox-obsidianMid/60 p-2.5 text-center"
            >
              <div className={`text-lg font-semibold ${color}`}>{value}</div>
              <div className="text-xs text-ourox-ink/40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Train/test split details */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ourox-ink/40">
        <span>Total: {metrics.train_test_split.total}</span>
        <span>Train: {metrics.train_test_split.train}</span>
        <span>Test: {metrics.train_test_split.test}</span>
        <span>Fraud (test): {metrics.support.fraud_test}</span>
        <span>Background (test): {metrics.support.background_test}</span>
      </div>

      {/* Per-typology recall */}
      {Object.keys(metrics.per_typology_recall).length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-ourox-ink/60">
            Per-typology recall (test set)
          </div>
          <div className="space-y-1.5">
            {Object.entries(metrics.per_typology_recall).map(
              ([typology, data]) => (
                <div key={typology} className="flex items-center gap-3">
                  <span className="w-44 truncate text-xs text-ourox-ink/60">
                    {typology}
                  </span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ourox-obsidianMid">
                    <div
                      className="h-full rounded-full bg-ourox-orange/60"
                      style={{ width: `${Math.round(data.recall * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-ourox-ink/50">
                    {Math.round(data.recall * 100)}%
                  </span>
                  <span className="text-xs text-ourox-ink/30">
                    n={data.support}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
