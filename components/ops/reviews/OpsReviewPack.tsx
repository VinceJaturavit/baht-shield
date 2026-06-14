"use client";

import { useMemo } from "react";
import { getReviewPackByAnalystId } from "@/lib/ops/reviews";
import {
  OpsReviewSignalSection,
  behaviourTone,
  fairnessTone,
  performanceTone,
} from "./OpsReviewSignalSection";
import { OpsReviewPackHeader } from "./OpsReviewPackHeader";
import { OpsMockCopilotPanel } from "./OpsMockCopilotPanel";
import { OpsCopilotRubricPanel } from "./OpsCopilotRubricPanel";
import { OpsCopilotRoadmapPanel } from "./OpsCopilotRoadmapPanel";

interface Props {
  analystId: string;
  onBack: () => void;
}

export function OpsReviewPack({ analystId, onBack }: Props) {
  const pack = useMemo(() => getReviewPackByAnalystId(analystId), [analystId]);

  if (!pack) {
    return (
      <div className="min-w-0 space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium text-ourox-ink/55 hover:text-ourox-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
        >
          Back to Reviews
        </button>
        <p className="text-sm text-ourox-ink/65">Analyst not found.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <OpsReviewPackHeader pack={pack} onBack={onBack} />

      <OpsMockCopilotPanel pack={pack} />

      <div className="min-w-0 space-y-1">
        <h3 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-xs font-semibold uppercase tracking-wide text-ourox-ink/60">
          Supporting signal detail
        </h3>
        <p className="text-xs text-ourox-ink/50">
          Five separate signals from synthetic review-pack data. Use alongside the generated review
          above.
        </p>
      </div>

      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <OpsReviewSignalSection
          title="Workload"
          caption="Workload is difficulty distribution, not performance. It shows whether this analyst was assigned harder work than role peers."
          metrics={[
            {
              label: "Weekly weighted-difficulty total",
              value: pack.workload.weightedDifficulty.toFixed(1),
            },
            { label: "Role average", value: pack.workload.roleAverage.toFixed(1) },
            { label: "Distribution tag", value: pack.workload.fairnessTag },
            { label: "Distribution note", value: pack.workload.distributionNote },
          ]}
          readLabel={pack.workload.fairnessTag}
          readTone={fairnessTone(pack.workload.fairnessTag)}
        />

        <OpsReviewSignalSection
          title="Performance"
          caption="Performance measures throughput on assigned work. Raw volume and complexity-weighted throughput are shown together so easy volume is not confused with harder work."
          metrics={[
            { label: "Raw volume", value: String(pack.performance.rawVolume) },
            {
              label: "Complexity-weighted throughput",
              value: pack.performance.weightedThroughput.toFixed(1),
            },
            {
              label: "QA quality score",
              value: `${pack.performance.qaQualityScore}%`,
            },
            {
              label: pack.performance.roleMetricOneLabel,
              value: `${pack.performance.roleMetricOneValue}%`,
            },
            {
              label: pack.performance.roleMetricTwoLabel,
              value: `${pack.performance.roleMetricTwoValue}%`,
            },
          ]}
          readLabel={`Performance read: ${pack.performance.read}`}
          readTone={performanceTone(pack.performance.read)}
        />

        <OpsReviewSignalSection
          title="Quality"
          caption="Quality measures whether sampled closed work passed QA. A fast analyst with poor quality is an operational risk."
          metrics={[
            { label: "QA score", value: `${pack.quality.qaScore}%` },
            { label: "Samples passed", value: String(pack.quality.passCount) },
            { label: "Samples failed", value: String(pack.quality.failCount) },
            { label: "Sample size", value: String(pack.quality.sampleCount) },
            {
              label: "Top defect category",
              value: pack.quality.topDefectCategory ?? "None recorded",
            },
          ]}
          caveat={pack.quality.lowSample ? "Low sample — provisional read." : undefined}
        />

        <OpsReviewSignalSection
          title="Behaviour"
          caption="Behaviour shows whether urgent or tight-SLA work is being picked up. It is behavioural visibility, not a productivity penalty."
          metrics={[
            {
              label: "Urgent / near-breach pickup share",
              value: `${pack.behaviour.urgentPickupShare}%`,
            },
            {
              label: "Role-expected share",
              value: `${pack.behaviour.roleExpectedShare}%`,
            },
          ]}
          readLabel={`Behaviour read: ${pack.behaviour.behaviourRead}`}
          readTone={behaviourTone(pack.behaviour.behaviourRead)}
          caveat={pack.behaviour.lowSample ? "Low sample — provisional read." : undefined}
        />

        <OpsReviewSignalSection
          title="Reliability"
          caption="Reliability is attendance and handoff context. It supports the review but should not become the headline by itself."
          metrics={[
            { label: "Assigned days", value: String(pack.reliability.assignedDays) },
            { label: "Leave days", value: String(pack.reliability.leaveDays) },
            { label: "Off days", value: String(pack.reliability.offDays) },
            { label: "Handoff count", value: String(pack.reliability.handoffCount) },
            { label: "Attendance summary", value: pack.reliability.attendanceSummary },
          ]}
          isLast
        />
      </div>

      <OpsCopilotRubricPanel />
      <OpsCopilotRoadmapPanel />
    </div>
  );
}
