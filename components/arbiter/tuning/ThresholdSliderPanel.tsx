'use client';

import type { ArbiterThresholds } from '@/lib/arbiter/tuning';
import { DEFAULT_THRESHOLDS, validateThresholds } from '@/lib/arbiter/tuning';

interface Props {
  thresholds: ArbiterThresholds;
  onChange: (t: ArbiterThresholds) => void;
}

type ThresholdKey = keyof ArbiterThresholds;

const LABELS: Record<ThresholdKey, { name: string; below: string; above: string }> = {
  approveStepUp: { name: 'APPROVE / STEP_UP boundary', below: 'APPROVE', above: 'STEP_UP' },
  stepUpReview:  { name: 'STEP_UP / REVIEW boundary',  below: 'STEP_UP',  above: 'REVIEW'  },
  reviewBlock:   { name: 'REVIEW / BLOCK boundary',    below: 'REVIEW',   above: 'BLOCK'   },
};

const BAND_COLORS: Record<ThresholdKey, string> = {
  approveStepUp: 'text-emerald-400',
  stepUpReview:  'text-yellow-400',
  reviewBlock:   'text-red-400',
};

export default function ThresholdSliderPanel({ thresholds, onChange }: Props) {
  function update(key: ThresholdKey, raw: number) {
    const value = Math.round(raw);
    const next = { ...thresholds, [key]: value };
    if (validateThresholds(next)) onChange(next);
  }

  function reset() {
    onChange({ ...DEFAULT_THRESHOLDS });
  }

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Decision Thresholds</h3>
        <button
          onClick={reset}
          className="text-xs text-ourox-orange hover:text-ourox-orangeHover transition-colors"
        >
          Reset defaults
        </button>
      </div>

      {(Object.entries(LABELS) as [ThresholdKey, typeof LABELS[ThresholdKey]][]).map(([key, meta]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ourox-ink/60">{meta.name}</span>
            <span className={`text-xs font-mono font-bold tabular-nums ${BAND_COLORS[key]}`}>
              {thresholds[key]}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={thresholds[key]}
            onChange={(e) => update(key, parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full accent-ourox-orange cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ourox-ink/30">
            <span>score &lt; {thresholds[key]} → {meta.below}</span>
            <span>score ≥ {thresholds[key]} → {meta.above}</span>
          </div>
        </div>
      ))}

      <div className="pt-2 border-t border-ourox-obsidianLight">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-ourox-ink/40">Bands:</span>
          <span className="text-emerald-400">APPROVE 0–{thresholds.approveStepUp - 1}</span>
          <span className="text-ourox-ink/30">·</span>
          <span className="text-yellow-400">STEP_UP {thresholds.approveStepUp}–{thresholds.stepUpReview - 1}</span>
          <span className="text-ourox-ink/30">·</span>
          <span className="text-orange-400">REVIEW {thresholds.stepUpReview}–{thresholds.reviewBlock - 1}</span>
          <span className="text-ourox-ink/30">·</span>
          <span className="text-red-400">BLOCK {thresholds.reviewBlock}–100</span>
        </div>
      </div>
    </div>
  );
}
