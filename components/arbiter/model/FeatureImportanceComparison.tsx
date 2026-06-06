"use client";

// FeatureImportanceComparison — compares LR learned coefficients with
// Arbiter hand-set feature weights.
// Import restriction: ARBITER_FEATURE_WEIGHTS is imported for comparison
// display only. Weight values are NOT changed.

import type { MlCoefficients } from "@/lib/arbiter/ml-artifacts";

interface Props {
  coefficients: MlCoefficients;
  handWeights:  Record<string, number>;
}

export function FeatureImportanceComparison({ coefficients, handWeights }: Props) {
  const maxAbsCoef   = Math.max(...coefficients.features.map((f) => f.abs_coefficient), 0.01);
  const maxAbsWeight = Math.max(...Object.values(handWeights).map(Math.abs), 0.01);

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">
        Learned importance vs hand weights
      </div>
      <p className="mb-4 text-xs leading-5 text-ourox-ink/50">
        This panel shows what the synthetic model learned to weight compared
        with Arbiter&apos;s hand-set feature weights. Differences are useful: they
        show where the dataset taught the model a different signal priority
        than the analyst-designed score. Coefficients are from logistic
        regression in standardized feature space.
      </p>

      {/* Legend */}
      <div className="mb-3 flex gap-5 text-xs text-ourox-ink/40">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-ourox-orange/60" />
          LR coefficient (abs)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-ourox-ink/20" />
          Hand weight (abs)
        </span>
      </div>

      <div className="space-y-3">
        {coefficients.features.map((item) => {
          const hw       = handWeights[item.feature] ?? 0;
          const coefBar  = (item.abs_coefficient / maxAbsCoef) * 100;
          const weightBar = (Math.abs(hw) / maxAbsWeight) * 100;
          const dirColor  = item.direction === "fraud_positive"
            ? "text-ourox-orange/80"
            : "text-emerald-400";

          return (
            <div key={item.feature}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs font-medium text-ourox-ink/80">
                  {item.feature}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-mono ${dirColor}`}>
                    {item.coefficient >= 0 ? "+" : ""}{item.coefficient.toFixed(4)}
                  </span>
                  <span className="text-ourox-ink/30">hand: {hw >= 0 ? "+" : ""}{hw}</span>
                </div>
              </div>
              {/* LR coefficient bar */}
              <div className="h-1.5 overflow-hidden rounded-sm bg-ourox-obsidianMid">
                <div
                  className="h-full rounded-sm bg-ourox-orange/60"
                  style={{ width: `${coefBar}%` }}
                />
              </div>
              {/* Hand weight bar */}
              <div className="mt-0.5 h-1 overflow-hidden rounded-sm bg-ourox-obsidianMid">
                <div
                  className="h-full rounded-sm bg-ourox-ink/20"
                  style={{ width: `${weightBar}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-ourox-ink/30">
        Rank {1}–{coefficients.features.length} by absolute LR coefficient
        magnitude. Model trained on synthetic Mockingbird data; coefficients
        reflect patterns in that dataset only.
      </p>
    </div>
  );
}
