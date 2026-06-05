'use client';

import type { ArbiterMetrics } from '@/lib/arbiter/metrics';

interface Props {
  metrics: ArbiterMetrics;
}

interface MetricDef {
  key: keyof Omit<ArbiterMetrics, 'confusionMatrix'>;
  label: string;
  tooltip: string;
  higher: 'good' | 'bad';
}

const METRIC_DEFS: MetricDef[] = [
  {
    key: 'precision',
    label: 'Precision',
    tooltip: 'TP / (TP + FP) — of all flagged events, what fraction is truly fraud.',
    higher: 'good',
  },
  {
    key: 'recall',
    label: 'Recall',
    tooltip: 'TP / (TP + FN) — of all fraud events, what fraction is caught.',
    higher: 'good',
  },
  {
    key: 'falsePositiveRate',
    label: 'False Positive Rate',
    tooltip: 'FP / (FP + TN) — of all legit events, what fraction is incorrectly flagged.',
    higher: 'bad',
  },
  {
    key: 'f1',
    label: 'F1 Score',
    tooltip: '2 × precision × recall / (precision + recall) — harmonic mean of precision and recall.',
    higher: 'good',
  },
];

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function barColor(value: number, higher: 'good' | 'bad') {
  if (higher === 'bad') {
    if (value > 0.3) return 'bg-red-500';
    if (value > 0.1) return 'bg-orange-400';
    return 'bg-emerald-500';
  }
  if (value > 0.7) return 'bg-emerald-500';
  if (value > 0.4) return 'bg-yellow-400';
  return 'bg-red-400';
}

export default function MetricsPanel({ metrics }: Props) {
  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-4">
      <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Evaluation Metrics</h3>

      <div className="space-y-3">
        {METRIC_DEFS.map(({ key, label, tooltip, higher }) => {
          const value = metrics[key];
          return (
            <div key={key} title={tooltip} className="space-y-1 cursor-help group">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ourox-ink/60 group-hover:text-ourox-ink/80 transition-colors">
                  {label}
                </span>
                <span className="text-xs font-mono font-bold tabular-nums text-ourox-ink">
                  {pct(value)}
                </span>
              </div>
              <div className="h-1.5 bg-ourox-obsidianLight rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${barColor(value, higher)}`}
                  style={{ width: `${Math.min(100, value * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-ourox-ink/30 pt-1">
        Hover each metric for definition. Values update live as thresholds/weights change.
      </p>
    </div>
  );
}
