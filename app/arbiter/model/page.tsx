// Arbiter Phase 3 — /arbiter/model route
//
// Server component: loads static ML artifacts and hand weights.
// Passes typed props to client workspace. No API calls. No runtime inference.
// Architecture: offline Python training → JSON artifacts → static import → display.
//
// SYNTHETIC DATA ONLY. _scenario_label is used as evaluation metadata only.
// /api/arbiter/score is NOT called here.

import {
  getMlVsRuleComparison,
  getMlHeldoutMetrics,
  getMlCalibrationBins,
  getMlCoefficients,
  ARBITER_FEATURE_WEIGHTS,
} from '@/lib/arbiter/ml-artifacts';
import ArbiterModelWorkspace from '@/components/arbiter/model/ArbiterModelWorkspace';
import { OuroxShell } from '@/components/ourox/OuroxShell';

export default function ArbiterModelPage() {
  const comparison    = getMlVsRuleComparison();
  const metrics       = getMlHeldoutMetrics();
  const calibration   = getMlCalibrationBins();
  const coefficients  = getMlCoefficients();
  const handWeights   = { ...ARBITER_FEATURE_WEIGHTS } as Record<string, number>;

  return (
    <OuroxShell currentProduct="Arbiter">
      <ArbiterModelWorkspace
        comparison={comparison}
        metrics={metrics}
        calibration={calibration}
        coefficients={coefficients}
        handWeights={handWeights}
      />
    </OuroxShell>
  );
}
