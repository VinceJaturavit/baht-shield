import { AppShell } from "@/components/AppShell";
import { SyntheticDataLabel } from "@/components/SyntheticDataLabel";
import { LossExposureByScenarioPanel } from "@/components/analytics/LossExposureByScenarioPanel";
import { CaseDecisionMixPanel } from "@/components/analytics/CaseDecisionMixPanel";
import { PatternCoveragePanel } from "@/components/analytics/PatternCoveragePanel";
import { CaseVolumeByOpenDatePanel } from "@/components/analytics/CaseVolumeByOpenDatePanel";
import {
  getLossExposureByScenario,
  getCaseDecisionMixAnalytics,
  getPatternCoverageAnalytics,
  getCaseOpenDateBuckets,
} from "@/lib/analytics";
import { text } from "@/lib/design-tokens";

export default function AnalyticsPage() {
  const lossByScenario = getLossExposureByScenario();
  const decisionMix = getCaseDecisionMixAnalytics();
  const patternCoverage = getPatternCoverageAnalytics();
  const caseVolume = getCaseOpenDateBuckets();

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-8">
        <p className={text.label}>Analytics</p>
        <h1 className={`mt-2 ${text.pageTitle}`}>Fraud leadership view</h1>
        <p className={`mt-2 max-w-2xl ${text.pageSubtitle}`}>
          Synthetic loss exposure, case decisions, pattern coverage, and
          case-open trends — at leadership altitude.
        </p>
        <p className="mt-3 text-[12px] text-signal-meta">
          All figures use synthetic seed data. Time trends use{" "}
          <code className="rounded bg-signal-surfaceSubtle px-1 font-mono text-[11px]">
            case.opened_at
          </code>{" "}
          only.
        </p>
      </div>

      {/* Four panels — 2-column desktop grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        <LossExposureByScenarioPanel data={lossByScenario} />
        <CaseDecisionMixPanel data={decisionMix} />
        <PatternCoveragePanel data={patternCoverage} />
        <CaseVolumeByOpenDatePanel data={caseVolume} />
      </div>
    </AppShell>
  );
}
