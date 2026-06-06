// Arbiter Phase 1 — KPI Strip
// Shows decision distribution and average score. No confusion matrix, no metrics dashboard.

import type { ArbiterScoreResponseItem } from '@/lib/arbiter/contract';

interface Props {
  results: ArbiterScoreResponseItem[];
}

interface KpiItem {
  label: string;
  value: string | number;
  dot: string;
  colorClass: string;
}

export function ArbiterKpiStrip({ results }: Props) {
  const total = results.length;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight px-4 py-3 text-sm text-ourox-ink/50">
        No events scored yet.
      </div>
    );
  }

  const counts = results.reduce(
    (acc, r) => {
      const a = r.final_decision.action;
      acc[a] = (acc[a] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const avgScore =
    results.reduce((sum, r) => sum + r.score.score, 0) / total;

  const kpis: KpiItem[] = [
    { label: 'Total', value: total, dot: 'bg-ourox-ink/30', colorClass: 'text-ourox-ink' },
    { label: 'Approve', value: counts['APPROVE'] ?? 0, dot: 'bg-green-400', colorClass: 'text-green-400' },
    { label: 'Step Up', value: counts['STEP_UP'] ?? 0, dot: 'bg-blue-400', colorClass: 'text-blue-400' },
    { label: 'Review', value: counts['REVIEW'] ?? 0, dot: 'bg-ourox-yellow', colorClass: 'text-ourox-yellow' },
    { label: 'Block', value: counts['BLOCK'] ?? 0, dot: 'bg-ourox-orange', colorClass: 'text-ourox-orange' },
    { label: 'Avg Score', value: avgScore.toFixed(1), dot: 'bg-ourox-ink/30', colorClass: 'text-ourox-ink' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight px-4 py-3"
        >
          <div className="mb-1 flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${kpi.dot}`} aria-hidden="true" />
            <span className="text-xs font-medium text-ourox-ink/60">{kpi.label}</span>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${kpi.colorClass}`}>
            {kpi.value}
          </div>
        </div>
      ))}
    </div>
  );
}
