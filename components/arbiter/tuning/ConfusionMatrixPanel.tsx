'use client';

import type { ArbiterConfusionMatrix } from '@/lib/arbiter/metrics';

interface Props {
  matrix: ArbiterConfusionMatrix;
}

export default function ConfusionMatrixPanel({ matrix }: Props) {
  const { tp, fp, tn, fn } = matrix;

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-4">
      <div>
        <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Confusion Matrix</h3>
        <p className="text-ourox-ink/40 text-xs mt-1">
          For this tuning sandbox, REVIEW/BLOCK are treated as positive interventions.
          APPROVE/STEP_UP are treated as negative for evaluation only.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="w-28" />
              <th className="text-center pb-2 text-ourox-orange/80 font-semibold">
                Predicted Positive<br />
                <span className="font-normal text-ourox-ink/40">(REVIEW / BLOCK)</span>
              </th>
              <th className="text-center pb-2 text-ourox-ink/60 font-semibold">
                Predicted Negative<br />
                <span className="font-normal text-ourox-ink/40">(APPROVE / STEP_UP)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-ourox-orange/80 font-semibold py-2 pr-3 align-middle text-right">
                Actual Positive<br />
                <span className="font-normal text-ourox-ink/40">(fraud scenario)</span>
              </td>
              <td className="text-center">
                <MatrixCell value={tp} label="TP" highlight="positive" />
              </td>
              <td className="text-center">
                <MatrixCell value={fn} label="FN" highlight="negative" />
              </td>
            </tr>
            <tr>
              <td className="text-ourox-ink/60 font-semibold py-2 pr-3 align-middle text-right">
                Actual Negative<br />
                <span className="font-normal text-ourox-ink/40">(background)</span>
              </td>
              <td className="text-center">
                <MatrixCell value={fp} label="FP" highlight="warning" />
              </td>
              <td className="text-center">
                <MatrixCell value={tn} label="TN" highlight="neutral" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatrixCell({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight: 'positive' | 'negative' | 'warning' | 'neutral';
}) {
  const colors = {
    positive: 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400',
    negative: 'bg-red-900/20 border-red-500/20 text-red-400',
    warning:  'bg-orange-900/20 border-orange-500/20 text-orange-400',
    neutral:  'bg-ourox-obsidianLight/50 border-ourox-obsidianLight text-ourox-ink/60',
  };
  return (
    <div className={`inline-flex flex-col items-center justify-center w-20 h-16 rounded-signalSm border ${colors[highlight]} m-1`}>
      <span className="text-xl font-bold tabular-nums">{value}</span>
      <span className="text-[10px] opacity-70">{label}</span>
    </div>
  );
}
