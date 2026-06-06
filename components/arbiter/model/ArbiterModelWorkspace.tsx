"use client";

// ArbiterModelWorkspace — main layout for /arbiter/model.
// Assembles all model view panels. No API calls. No runtime inference.
// All data is read from static JSON artifacts via ml-artifacts.ts.

import { ArbiterSectionNav }          from "@/components/arbiter/ArbiterSectionNav";
import { ArbiterSyntheticBanner }     from "@/components/arbiter/ArbiterSyntheticBanner";
import { ModelFramingBanner }          from "./ModelFramingBanner";
import { HeldoutMetricsPanel }         from "./HeldoutMetricsPanel";
import { CalibrationPanel }            from "./CalibrationPanel";
import { FeatureImportanceComparison } from "./FeatureImportanceComparison";
import { DisagreementCasesPanel }      from "./DisagreementCasesPanel";
import { MlVsRuleEventTable }          from "./MlVsRuleEventTable";

import type {
  MlHeldoutMetrics,
  MlCalibrationBins,
  MlCoefficients,
  MlVsRuleRecord,
} from "@/lib/arbiter/ml-artifacts";

interface Props {
  metrics:      MlHeldoutMetrics;
  calibration:  MlCalibrationBins;
  coefficients: MlCoefficients;
  comparison:   MlVsRuleRecord[];
  handWeights:  Record<string, number>;
}

export default function ArbiterModelWorkspace({
  metrics,
  calibration,
  coefficients,
  comparison,
  handWeights,
}: Props) {
  const disagreements = comparison.filter(
    (r) =>
      r.comparison_type === "ML_HIGH_RULE_LOW" ||
      r.comparison_type === "ML_LOW_RULE_HIGH"
  );

  return (
    <div
      className="min-h-screen bg-ourox-obsidian"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        {/* Page header */}
        <div className="mb-6">
          <p
            className="mb-1 text-xs font-medium uppercase tracking-wider text-ourox-orange"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Arbiter
          </p>
          <h1 className="mb-1 text-xl font-semibold tracking-tight text-ourox-ink">
            Model — ML vs rules
          </h1>
          <p className="text-sm text-ourox-ink/50">
            Offline-trained ML score compared with the transparent rule score.
          </p>
        </div>

        {/* Section nav */}
        <div className="mb-5">
          <ArbiterSectionNav />
        </div>

        {/* Synthetic banner */}
        <div className="mb-4">
          <ArbiterSyntheticBanner />
        </div>

        {/* Framing banner */}
        <div className="mb-6">
          <ModelFramingBanner />
        </div>

        {/* KPI strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Events", value: String(comparison.length) },
            { label: "Disagreements", value: String(disagreements.length) },
            { label: "ROC AUC", value: `${(metrics.roc_auc * 100).toFixed(1)}%` },
            { label: "F1", value: `${(metrics.f1 * 100).toFixed(1)}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-4"
            >
              <div className="text-xs text-ourox-ink/40">{label}</div>
              <div className="mt-1 text-xl font-semibold tabular-nums text-ourox-ink">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Side-by-side event table */}
          <MlVsRuleEventTable records={comparison} />

          {/* Two-column: importance + calibration */}
          <div className="grid gap-6 lg:grid-cols-2">
            <FeatureImportanceComparison
              coefficients={coefficients}
              handWeights={handWeights}
            />
            <CalibrationPanel calibration={calibration} />
          </div>

          {/* Held-out metrics */}
          <HeldoutMetricsPanel metrics={metrics} />

          {/* Disagreement cases */}
          <DisagreementCasesPanel cases={disagreements} />
        </div>
      </div>
    </div>
  );
}
