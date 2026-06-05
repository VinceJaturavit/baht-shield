'use client';

import type { ArbiterTypologyMetrics } from '@/lib/arbiter/metrics';

interface Props {
  typologyMetrics: ArbiterTypologyMetrics[];
}

const LABELS: Record<string, string> = {
  onboarding_mule_farm: 'Mule Farm',
  sleeper_activation:   'Sleeper Activation',
  app_scam_cashout:     'APP Scam Cash-out',
};

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

export default function TypologyMetricsPanel({ typologyMetrics }: Props) {
  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-4">
      <div>
        <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Per-Typology Metrics</h3>
        <p className="text-ourox-ink/40 text-xs mt-1">
          One-vs-background: each row compares that typology vs background only. Other fraud types excluded.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianLight">
              <th className="text-left text-ourox-ink/50 font-medium py-2 pr-4">Typology</th>
              <th className="text-right text-ourox-ink/50 font-medium py-2 px-2">Support</th>
              <th className="text-right text-ourox-ink/50 font-medium py-2 px-2">Recall</th>
              <th className="text-right text-ourox-ink/50 font-medium py-2 px-2">Precision</th>
              <th className="text-right text-ourox-ink/50 font-medium py-2 px-2">FPR</th>
              <th className="text-right text-ourox-ink/50 font-medium py-2 pl-2">F1</th>
            </tr>
          </thead>
          <tbody>
            {typologyMetrics.map(({ scenarioLabel, metrics, support }) => (
              <tr
                key={scenarioLabel}
                className="border-b border-ourox-obsidianLight/50 hover:bg-ourox-obsidianLight/20 transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <span className="text-ourox-ink font-medium">{LABELS[scenarioLabel] ?? scenarioLabel}</span>
                </td>
                <td className="text-right py-2.5 px-2 text-ourox-ink/60 tabular-nums">{support}</td>
                <td className="text-right py-2.5 px-2">
                  <MetricBadge value={metrics.recall} higher="good" />
                </td>
                <td className="text-right py-2.5 px-2">
                  <MetricBadge value={metrics.precision} higher="good" />
                </td>
                <td className="text-right py-2.5 px-2">
                  <MetricBadge value={metrics.falsePositiveRate} higher="bad" />
                </td>
                <td className="text-right py-2.5 pl-2">
                  <MetricBadge value={metrics.f1} higher="good" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricBadge({ value, higher }: { value: number; higher: 'good' | 'bad' }) {
  const isGood = higher === 'good' ? value > 0.6 : value < 0.15;
  const isMid  = higher === 'good' ? value > 0.3 : value < 0.3;
  const colorClass = isGood ? 'text-emerald-400' : isMid ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className={`font-mono tabular-nums font-semibold ${colorClass}`}>
      {(value * 100).toFixed(1)}%
    </span>
  );
}
