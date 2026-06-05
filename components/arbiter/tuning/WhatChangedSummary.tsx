'use client';

import type { ArbiterMetrics } from '@/lib/arbiter/metrics';
import { computeMetricsDelta } from '@/lib/arbiter/metrics';

interface Props {
  currentMetrics: ArbiterMetrics;
  baselineMetrics: ArbiterMetrics;
  reviewBlockVolume: number;
  baselineReviewBlockVolume: number;
}

function sign(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

function signF(n: number, decimals = 1) {
  const v = (n * 100).toFixed(decimals);
  return n > 0 ? `+${v}%` : `${v}%`;
}

function DeltaRow({ label, current, delta, unit = '' }: { label: string; current: string | number; delta: number; unit?: string }) {
  const isPositive = delta > 0;
  const deltaColor = delta === 0
    ? 'text-ourox-ink/40'
    : label.toLowerCase().includes('false') || label.toLowerCase().includes('fp')
    ? (isPositive ? 'text-red-400' : 'text-emerald-400')
    : (isPositive ? 'text-emerald-400' : 'text-red-400');

  return (
    <div className="flex items-center justify-between text-xs py-1 border-b border-ourox-obsidianLight/50 last:border-0">
      <span className="text-ourox-ink/60">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-ourox-ink tabular-nums">{current}{unit}</span>
        {delta !== 0 && (
          <span className={`font-mono font-semibold tabular-nums ${deltaColor}`}>
            {typeof delta === 'number' && Number.isInteger(delta)
              ? sign(delta)
              : signF(delta)}
            {unit && Number.isInteger(delta) ? unit : ''}
          </span>
        )}
        {delta === 0 && <span className="text-ourox-ink/20 font-mono">—</span>}
      </div>
    </div>
  );
}

export default function WhatChangedSummary({ currentMetrics, baselineMetrics, reviewBlockVolume, baselineReviewBlockVolume }: Props) {
  const delta = computeMetricsDelta(baselineMetrics, currentMetrics);
  const volumeDelta = reviewBlockVolume - baselineReviewBlockVolume;
  const hasChanges = Object.values(delta).some((v) => v !== 0) || volumeDelta !== 0;

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">What Changed</h3>
        {!hasChanges && (
          <span className="text-xs text-ourox-ink/30 italic">No changes from baseline</span>
        )}
      </div>

      {hasChanges ? (
        <div className="space-y-0.5">
          <DeltaRow label="REVIEW/BLOCK volume" current={reviewBlockVolume} delta={volumeDelta} />
          <DeltaRow label="True positives (TP)" current={currentMetrics.confusionMatrix.tp} delta={delta.tp} />
          <DeltaRow label="False positives (FP)" current={currentMetrics.confusionMatrix.fp} delta={delta.fp} />
          <DeltaRow label="False negatives (FN)" current={currentMetrics.confusionMatrix.fn} delta={delta.fn} />
          <DeltaRow label="True negatives (TN)" current={currentMetrics.confusionMatrix.tn} delta={delta.tn} />
          <DeltaRow label="Precision" current={`${(currentMetrics.precision * 100).toFixed(1)}%`} delta={delta.precision} />
          <DeltaRow label="Recall" current={`${(currentMetrics.recall * 100).toFixed(1)}%`} delta={delta.recall} />
          <DeltaRow label="False positive rate" current={`${(currentMetrics.falsePositiveRate * 100).toFixed(1)}%`} delta={delta.falsePositiveRate} />
          <DeltaRow label="F1" current={`${(currentMetrics.f1 * 100).toFixed(1)}%`} delta={delta.f1} />
        </div>
      ) : (
        <div className="space-y-0.5">
          <DeltaRow label="REVIEW/BLOCK volume" current={reviewBlockVolume} delta={0} />
          <DeltaRow label="Precision" current={`${(currentMetrics.precision * 100).toFixed(1)}%`} delta={0} />
          <DeltaRow label="Recall" current={`${(currentMetrics.recall * 100).toFixed(1)}%`} delta={0} />
          <DeltaRow label="F1" current={`${(currentMetrics.f1 * 100).toFixed(1)}%`} delta={0} />
        </div>
      )}

      <p className="text-[10px] text-ourox-ink/30">
        Δ compared to default thresholds + default weights (baseline). Updates live.
      </p>
    </div>
  );
}
