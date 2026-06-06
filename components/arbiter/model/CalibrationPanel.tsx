"use client";

// CalibrationPanel — shows reliability calibration bins.
// Compares predicted ML probability with observed fraud rate per bin.

import type { MlCalibrationBins } from "@/lib/arbiter/ml-artifacts";

interface Props {
  calibration: MlCalibrationBins;
}

export function CalibrationPanel({ calibration }: Props) {
  const maxCount = Math.max(...calibration.bins.map((b) => b.count), 1);

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">
        Calibration
      </div>
      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        Calibration compares predicted probability with observed fraud rate in
        held-out synthetic data. A well-calibrated model&apos;s predicted probability
        should roughly match the observed rate in each bin.
      </p>

      {/* Column headers */}
      <div className="mb-2 grid grid-cols-[80px_1fr_56px_56px_48px] gap-2 text-xs font-medium text-ourox-ink/40">
        <span>Bin</span>
        <span>Volume</span>
        <span className="text-right">Pred</span>
        <span className="text-right">Obs</span>
        <span className="text-right">n</span>
      </div>

      <div className="space-y-1.5">
        {calibration.bins.map((bin) => {
          const barWidth = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
          const predPct  = Math.round(bin.mean_predicted_probability * 100);
          const obsPct   = Math.round(bin.observed_fraud_rate * 100);
          const diff     = Math.abs(predPct - obsPct);

          return (
            <div
              key={bin.bin_start}
              className="grid grid-cols-[80px_1fr_56px_56px_48px] items-center gap-2"
            >
              <span className="font-mono text-xs text-ourox-ink/40">
                {bin.bin_start.toFixed(1)}–{bin.bin_end.toFixed(1)}
              </span>

              {/* Volume bar */}
              <div className="relative h-4 overflow-hidden rounded-sm bg-ourox-obsidianMid">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm bg-ourox-orange/30"
                  style={{ width: `${barWidth}%` }}
                />
                {/* Calibration line: orange = predicted, teal = observed */}
                {bin.count > 0 && (
                  <>
                    <div
                      className="absolute top-0 h-full w-0.5 bg-ourox-orange/70"
                      style={{ left: `${predPct}%` }}
                      title={`Predicted: ${predPct}%`}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-emerald-500/70"
                      style={{ left: `${obsPct}%` }}
                      title={`Observed: ${obsPct}%`}
                    />
                  </>
                )}
              </div>

              <span
                className={`text-right font-mono text-xs ${
                  bin.count === 0 ? "text-ourox-ink/20" : "text-ourox-orange/80"
                }`}
              >
                {bin.count > 0 ? `${predPct}%` : "—"}
              </span>
              <span
                className={`text-right font-mono text-xs ${
                  bin.count === 0
                    ? "text-ourox-ink/20"
                    : diff <= 10
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {bin.count > 0 ? `${obsPct}%` : "—"}
              </span>
              <span className="text-right font-mono text-xs text-ourox-ink/40">
                {bin.count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-5 text-xs text-ourox-ink/40">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-3 bg-ourox-orange/70" />
          Predicted probability
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-3 bg-emerald-500/70" />
          Observed fraud rate
        </span>
      </div>
    </div>
  );
}
