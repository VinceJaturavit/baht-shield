import type { OpsReviewDisposition, OpsReviewPack } from "./reviews-types";
import type { OpsCopilotReview } from "./reviews-copilot-types";

const CLOSING_LINE =
  "This is a decision-support draft; the manager reviews the evidence and makes the final call.";

function workloadScorecardLine(pack: OpsReviewPack): string {
  const { fairnessTag, weightedDifficulty, roleAverage } = pack.workload;
  if (fairnessTag === "Over-loaded") {
    return `Workload context: ${weightedDifficulty.toFixed(1)} weighted difficulty vs ${roleAverage.toFixed(1)} role average — over-loaded by rostering; note for manager equity, not an analyst penalty.`;
  }
  if (fairnessTag === "Under-loaded") {
    return `Workload context: ${weightedDifficulty.toFixed(1)} weighted difficulty vs ${roleAverage.toFixed(1)} role average — under-loaded relative to ${pack.role} peers; distribution context only.`;
  }
  return `Workload context: ${weightedDifficulty.toFixed(1)} weighted difficulty aligns with ${pack.role} role average (${roleAverage.toFixed(1)}); no rostering equity flag.`;
}

function throughputScorecardLine(pack: OpsReviewPack): string {
  const { rawVolume, weightedThroughput, read } = pack.performance;
  return `Throughput: ${weightedThroughput.toFixed(1)} complexity-weighted (${rawVolume} raw cases) — read ${read} for ${pack.role} peers; weighted figure preferred over volume alone.`;
}

function qualityScorecardLine(pack: OpsReviewPack): string {
  const { qaScore, sampleCount, passCount, failCount, topDefectCategory, lowSample } =
    pack.quality;
  const provisional = lowSample ? " — provisional read (n<5)" : "";
  const defect = topDefectCategory ? `; top defect: ${topDefectCategory}` : "";
  return `Quality: ${qaScore}% pass rate on ${sampleCount} samples (${passCount} pass / ${failCount} fail)${defect}${provisional}.`;
}

function behaviourScorecardLine(pack: OpsReviewPack): string {
  const { urgentPickupShare, roleExpectedShare, behaviourRead, lowSample } = pack.behaviour;
  const provisional = lowSample ? " — provisional (low urgent sample)" : "";
  if (behaviourRead === "Avoidance risk") {
    return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected share — avoidance risk; coach on SLA pickup, not a throughput penalty${provisional}.`;
  }
  if (behaviourRead === "Healthy" && urgentPickupShare > roleExpectedShare * 1.1) {
    return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected — taking more than share; positive reliability signal${provisional}.`;
  }
  return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected — ${behaviourRead}${provisional}.`;
}

function reliabilityScorecardLine(pack: OpsReviewPack): string {
  const { assignedDays, leaveDays, handoffCount, attendanceSummary } = pack.reliability;
  return `Reliability: ${assignedDays} assigned days, ${leaveDays} leave, ${handoffCount} handoffs — ${attendanceSummary}; context only.`;
}

export function getDispositionForReviewPack(pack: OpsReviewPack): OpsReviewDisposition {
  const { performance, quality, behaviour } = pack;

  if (
    performance.read === "Needs review" ||
    quality.qaScore < 85 ||
    behaviour.behaviourRead === "Avoidance risk"
  ) {
    return "Watch — review";
  }

  const roleMetricsLow =
    performance.roleMetricOneValue < 85 || performance.roleMetricTwoValue < 85;

  if (
    performance.read === "Watch" ||
    quality.qaScore < 90 ||
    behaviour.behaviourRead === "Watch" ||
    roleMetricsLow
  ) {
    return "Developing — coach";
  }

  const strongQuality = quality.qaScore >= 95 && !quality.lowSample;
  const strongBehaviour = behaviour.behaviourRead === "Healthy" && !behaviour.lowSample;
  const strongPerformance = performance.read === "On track" && performance.weightedThroughput >= 10;

  if (strongQuality && strongBehaviour && strongPerformance) {
    return "Strong — recognise";
  }

  return "Solid — maintain";
}

function dispositionReason(pack: OpsReviewPack, disposition: OpsReviewDisposition): string {
  switch (disposition) {
    case "Watch — review":
      if (pack.behaviour.behaviourRead === "Avoidance risk") {
        return "Urgent/SLA pickup share is below role-expected — primary coaching and review signal.";
      }
      if (pack.performance.read === "Needs review") {
        return "Performance read is Needs review — throughput or SLA compliance warrants manager attention.";
      }
      return "QA pass rate is below acceptable threshold for this role peer group.";
    case "Developing — coach":
      if (pack.quality.qaScore < 90) {
        return "QA sample pass rate is in watch range — coach on defect patterns before expanding scope.";
      }
      if (pack.behaviour.behaviourRead === "Watch") {
        return "SLA-pickup behaviour is provisional or below healthy share — discuss urgent case uptake.";
      }
      return "Role-specific metrics or throughput read suggests targeted coaching.";
    case "Strong — recognise":
      return "Weighted throughput, QA quality, and SLA-pickup behaviour are all strong vs role peers.";
    default:
      return "Signals are broadly on track with no single dimension requiring escalation.";
  }
}

function managerActions(pack: OpsReviewPack, disposition: OpsReviewDisposition): string[] {
  const actions: string[] = [];

  if (pack.workload.fairnessTag === "Over-loaded") {
    actions.push(
      "Review roster distribution — analyst is carrying disproportionately hard work; adjust assignments rather than treating workload as a performance issue.",
    );
  }

  switch (disposition) {
    case "Watch — review":
      if (pack.behaviour.behaviourRead === "Avoidance risk") {
        actions.push(
          "Schedule a coaching conversation on urgent and near-breach case pickup; review recent SLA assignments together.",
        );
      } else if (pack.quality.qaScore < 85) {
        actions.push(
          `Review QA failures${pack.quality.topDefectCategory ? ` (${pack.quality.topDefectCategory})` : ""} and agree corrective steps on sampled work.`,
        );
      } else {
        actions.push(
          "Review performance and SLA evidence together; agree whether throughput or compliance coaching is needed.",
        );
      }
      break;
    case "Developing — coach":
      if (pack.quality.lowSample) {
        actions.push(
          "Expand QA sample before a confident quality read; interim coaching on observed defect patterns.",
        );
      } else {
        actions.push(
          `Coach on ${pack.performance.roleMetricOneLabel.toLowerCase()} and ${pack.performance.roleMetricTwoLabel.toLowerCase()} with concrete examples from the review week.`,
        );
      }
      break;
    case "Strong — recognise":
      actions.push(
        "Recognise sustained weighted throughput and quality; discuss career development or expanded scope if appropriate.",
      );
      if (pack.workload.fairnessTag === "Over-loaded") {
        actions.push("Balance future roster assignments to protect against burnout from hard-work concentration.");
      }
      break;
    default:
      actions.push(
        "Maintain current coaching rhythm; revisit after next QA sampling cycle or roster change.",
      );
      break;
  }

  return actions.slice(0, 2);
}

export function generateMockCopilotReview(pack: OpsReviewPack): OpsCopilotReview {
  const disposition = getDispositionForReviewPack(pack);

  return {
    analystId: pack.analystId,
    scorecard: {
      workloadContext: workloadScorecardLine(pack),
      throughput: throughputScorecardLine(pack),
      quality: qualityScorecardLine(pack),
      behaviour: behaviourScorecardLine(pack),
      reliability: reliabilityScorecardLine(pack),
    },
    disposition,
    dispositionReason: dispositionReason(pack, disposition),
    managerActions: managerActions(pack, disposition),
    closingLine: CLOSING_LINE,
    generatedBy: "Mock deterministic copilot",
  };
}
