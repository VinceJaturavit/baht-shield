import type { OpsReviewDisposition, OpsReviewPack } from "./reviews-types";
import type {
  OpsAnalystFacingSummary,
  OpsCopilotReview,
  OpsManagerDecisionSummary,
} from "./reviews-copilot-types";

const HUMAN_IN_LOOP_CLOSING_LINE =
  "This is a decision-support draft; the manager reviews the evidence, adds context, and makes the final call.";

function workloadScorecardLine(pack: OpsReviewPack): string {
  const { fairnessTag, weightedDifficulty, roleAverage } = pack.workload;
  if (fairnessTag === "Over-loaded") {
    return `Workload context: At ${weightedDifficulty.toFixed(1)} weighted difficulty vs ${roleAverage.toFixed(1)} role average — over-loaded by rostering; manager equity note, not an analyst penalty.`;
  }
  if (fairnessTag === "Under-loaded") {
    return `Workload context: At ${weightedDifficulty.toFixed(1)} weighted difficulty vs ${roleAverage.toFixed(1)} role average — under-loaded relative to ${pack.role} peers; distribution context only.`;
  }
  return `Workload context: At role-average difficulty (${weightedDifficulty.toFixed(1)} vs ${roleAverage.toFixed(1)} ${pack.role} average); no workload-equity concern this cycle.`;
}

function throughputScorecardLine(pack: OpsReviewPack): string {
  const { rawVolume, weightedThroughput, read } = pack.performance;
  return `Throughput: Weighted throughput is ${weightedThroughput.toFixed(1)} (${rawVolume} raw cases) — read ${read} for ${pack.role} peers; weighted figure preferred over volume alone.`;
}

function qualityScorecardLine(pack: OpsReviewPack): string {
  const { qaScore, sampleCount, passCount, failCount, topDefectCategory, lowSample } =
    pack.quality;
  const provisional = lowSample ? " — provisional read (n<5)" : "";
  const defect = topDefectCategory ? `; top defect: ${topDefectCategory}` : "";
  return `Quality: QA score is ${qaScore}% on n=${sampleCount} samples (${passCount} pass / ${failCount} fail)${defect}${provisional}.`;
}

function behaviourScorecardLine(pack: OpsReviewPack): string {
  const { urgentPickupShare, roleExpectedShare, behaviourRead, lowSample } = pack.behaviour;
  const provisional = lowSample ? " — provisional (low urgent sample)" : "";
  if (behaviourRead === "Avoidance risk") {
    return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected — avoidance risk; coach on SLA pickup, not a throughput penalty${provisional}.`;
  }
  if (behaviourRead === "Healthy" && urgentPickupShare > roleExpectedShare * 1.1) {
    return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected — healthy relative to role peers; positive reliability signal${provisional}.`;
  }
  return `Behaviour: ${urgentPickupShare}% urgent pickup vs ${roleExpectedShare}% role-expected — ${behaviourRead.toLowerCase()} relative to role peers${provisional}.`;
}

function reliabilityScorecardLine(pack: OpsReviewPack): string {
  const { assignedDays, leaveDays, handoffCount, attendanceSummary } = pack.reliability;
  return `Reliability: Assigned ${assignedDays} days with ${leaveDays} leave and ${handoffCount} handoff${handoffCount === 1 ? "" : "s"} completed — ${attendanceSummary}.`;
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

function buildWhatWentWell(pack: OpsReviewPack): string[] {
  const items: string[] = [];
  const { performance, quality, behaviour, reliability } = pack;

  if (performance.read === "On track") {
    items.push(
      `Your complexity-weighted throughput (${performance.weightedThroughput.toFixed(1)}) is on track for ${pack.role} peers while raw volume was ${performance.rawVolume} cases.`,
    );
  } else if (performance.read === "Watch") {
    items.push(
      `You maintained ${performance.rawVolume} raw cases with weighted throughput ${performance.weightedThroughput.toFixed(1)} — the read is Watch, but you stayed engaged on assigned work.`,
    );
  }

  if (quality.qaScore >= 90) {
    items.push(
      `QA pass rate is ${quality.qaScore}% on ${quality.sampleCount} sampled cases (${quality.passCount} pass / ${quality.failCount} fail)${quality.lowSample ? " — encouraging, though still sample-based" : ""}.`,
    );
  } else if (quality.qaScore >= 85) {
    items.push(
      `QA pass rate held at ${quality.qaScore}% on ${quality.sampleCount} samples — acceptable range with room to tighten on sampled defects.`,
    );
  }

  if (behaviour.behaviourRead === "Healthy") {
    items.push(
      `Urgent and near-breach pickup share (${behaviour.urgentPickupShare}%) is healthy vs ${behaviour.roleExpectedShare}% role-expected — you are pulling your share of time-sensitive work.`,
    );
  } else if (behaviour.behaviourRead === "Watch" && behaviour.urgentPickupShare >= behaviour.roleExpectedShare * 0.9) {
    items.push(
      `Urgent pickup (${behaviour.urgentPickupShare}%) is close to the ${behaviour.roleExpectedShare}% role-expected baseline — not avoidance, but worth monitoring.`,
    );
  }

  if (reliability.handoffCount > 0) {
    items.push(
      `You completed ${reliability.handoffCount} handoff${reliability.handoffCount === 1 ? "" : "s"} across ${reliability.assignedDays} assigned days — reliable attendance context for the week.`,
    );
  } else if (reliability.assignedDays >= 4 && reliability.leaveDays === 0) {
    items.push(
      `Attendance was steady (${reliability.assignedDays} assigned days, no unplanned leave) — ${reliability.attendanceSummary.toLowerCase()}.`,
    );
  }

  if (performance.roleMetricOneValue >= 90) {
    items.push(
      `${performance.roleMetricOneLabel} at ${performance.roleMetricOneValue}% is a concrete strength for your ${pack.role} role.`,
    );
  }

  if (items.length === 0) {
    items.push(
      `You stayed present on assigned work this cycle (${performance.rawVolume} cases, ${reliability.assignedDays} assigned days) — the baseline for a fair developmental read.`,
    );
  }

  return items.slice(0, 4);
}

function buildWhatToImprove(pack: OpsReviewPack): string[] {
  const items: string[] = [];
  const { performance, quality, behaviour } = pack;

  if (quality.qaScore < 90) {
    const defectNote = quality.topDefectCategory
      ? ` — focus on ${quality.topDefectCategory} patterns in sampled work`
      : "";
    items.push(
      `QA pass rate is ${quality.qaScore}% on n=${quality.sampleCount}${defectNote}${quality.lowSample ? "; treat as provisional until more samples land" : ""}.`,
    );
  }

  if (behaviour.behaviourRead === "Avoidance risk") {
    items.push(
      `Urgent pickup share (${behaviour.urgentPickupShare}%) sits below the ${behaviour.roleExpectedShare}% role-expected baseline — this is a coaching point on SLA behaviour, not a throughput penalty.`,
    );
  } else if (behaviour.behaviourRead === "Watch") {
    items.push(
      `SLA-pickup behaviour is in Watch range (${behaviour.urgentPickupShare}% vs ${behaviour.roleExpectedShare}% expected) — discuss how urgent cases are selected and claimed.`,
    );
  }

  if (performance.read === "Needs review" || performance.read === "Watch") {
    items.push(
      `Performance read is ${performance.read}: weighted throughput ${performance.weightedThroughput.toFixed(1)} and ${performance.roleMetricOneLabel} (${performance.roleMetricOneValue}%) / ${performance.roleMetricTwoLabel} (${performance.roleMetricTwoValue}%) are the fair coaching levers vs ${pack.role} peers.`,
    );
  }

  if (performance.roleMetricOneValue < 85 || performance.roleMetricTwoValue < 85) {
    const weak =
      performance.roleMetricOneValue < performance.roleMetricTwoValue
        ? performance.roleMetricOneLabel
        : performance.roleMetricTwoLabel;
    const weakVal = Math.min(performance.roleMetricOneValue, performance.roleMetricTwoValue);
    items.push(
      `${weak} at ${weakVal}% is below the role-peer comfort band — a specific, actionable development area.`,
    );
  }

  if (items.length === 0) {
    items.push(
      "No single signal demands urgent correction — keep tightening QA consistency and SLA pickup habits as routine development.",
    );
  }

  return items.slice(0, 3);
}

function buildWorkloadReassurance(pack: OpsReviewPack): string {
  const { fairnessTag, weightedDifficulty, roleAverage, distributionNote } = pack.workload;

  if (fairnessTag === "Over-loaded") {
    return `You carried above role-average difficulty this week (${weightedDifficulty.toFixed(1)} vs ${roleAverage.toFixed(1)} ${pack.role} average). That is a rostering fact controlled by your manager and should not be counted against you. The stronger read is how you handled the assigned work: ${distributionNote.charAt(0).toLowerCase()}${distributionNote.slice(1)}`;
  }
  if (fairnessTag === "Under-loaded") {
    return `Your assigned difficulty (${weightedDifficulty.toFixed(1)}) was below the ${roleAverage.toFixed(1)} ${pack.role} role average this cycle. That is a distribution choice, not a reflection of your capability — focus the conversation on quality and behaviour on the work you did receive.`;
  }
  return `Workload difficulty aligned with ${pack.role} role peers (${weightedDifficulty.toFixed(1)} vs ${roleAverage.toFixed(1)} average). No rostering-equity flag — performance and quality reads stand on their own this cycle.`;
}

function buildFocusActions(pack: OpsReviewPack, disposition: OpsReviewDisposition): string[] {
  const actions: string[] = [];

  if (pack.quality.qaScore < 90 || pack.quality.lowSample) {
    actions.push(
      pack.quality.topDefectCategory
        ? `Review two recent QA failures tagged ${pack.quality.topDefectCategory} and document what you would change before closing.`
        : "Pick one sampled failure from this week and walk through the correct close-out steps with your lead.",
    );
  }

  if (pack.behaviour.behaviourRead !== "Healthy") {
    actions.push(
      "For the next cycle, claim at least one urgent or near-breach case per shift and note why you selected it.",
    );
  }

  if (pack.performance.read !== "On track") {
    actions.push(
      `Set a concrete target on ${pack.performance.roleMetricOneLabel.toLowerCase()} — aim to lift from ${pack.performance.roleMetricOneValue}% toward role-peer baseline on your next assigned batch.`,
    );
  }

  if (disposition === "Strong — recognise" && actions.length < 2) {
    actions.push(
      "Maintain your current QA and SLA-pickup habits; offer to mentor a junior peer on complexity-weighted throughput discipline.",
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Keep current rhythm on weighted throughput and QA sampling; flag any roster imbalance early if difficulty spikes.",
    );
  }

  return actions.slice(0, 2);
}

function buildStrongestEvidence(
  pack: OpsReviewPack,
  disposition: OpsReviewDisposition,
): string[] {
  const evidence: string[] = [];
  const { performance, quality, behaviour, reliability } = pack;

  evidence.push(
    `Throughput: ${performance.weightedThroughput.toFixed(1)} weighted (${performance.rawVolume} raw) — performance read ${performance.read}.`,
  );
  evidence.push(
    `Quality: ${quality.qaScore}% on n=${quality.sampleCount}${quality.lowSample ? " (provisional)" : ""}${quality.topDefectCategory ? `; top defect ${quality.topDefectCategory}` : ""}.`,
  );
  evidence.push(
    `Behaviour: ${behaviour.urgentPickupShare}% urgent pickup vs ${behaviour.roleExpectedShare}% role-expected — ${behaviour.behaviourRead}.`,
  );

  if (disposition === "Strong — recognise" || disposition === "Solid — maintain") {
    evidence.push(
      `${performance.roleMetricOneLabel} ${performance.roleMetricOneValue}% and ${performance.roleMetricTwoLabel} ${performance.roleMetricTwoValue}% vs ${pack.role} peer band.`,
    );
  }

  if (pack.workload.fairnessTag === "Over-loaded") {
    evidence.push(
      `Workload: ${pack.workload.weightedDifficulty.toFixed(1)} weighted difficulty vs ${pack.workload.roleAverage.toFixed(1)} role average — over-loaded; exclude from performance penalty.`,
    );
  }

  evidence.push(
    `Reliability: ${reliability.assignedDays} assigned days, ${reliability.handoffCount} handoffs — ${reliability.attendanceSummary}.`,
  );

  return evidence.slice(0, 4);
}

function buildMainRiskOrCoachingPoint(
  pack: OpsReviewPack,
  disposition: OpsReviewDisposition,
): string {
  if (pack.behaviour.behaviourRead === "Avoidance risk") {
    return `Primary risk is SLA-pickup avoidance (${pack.behaviour.urgentPickupShare}% vs ${pack.behaviour.roleExpectedShare}% role-expected) — coach before it becomes a throughput or customer-impact issue.`;
  }
  if (pack.quality.qaScore < 85) {
    return `QA pass rate (${pack.quality.qaScore}% on n=${pack.quality.sampleCount}) is the main coaching point${pack.quality.topDefectCategory ? ` — defect cluster: ${pack.quality.topDefectCategory}` : ""}.`;
  }
  if (pack.performance.read === "Needs review") {
    return `Performance read Needs review — weighted throughput ${pack.performance.weightedThroughput.toFixed(1)} and role metrics need a structured coaching plan vs ${pack.role} peers.`;
  }
  if (pack.quality.qaScore < 90 && !pack.quality.lowSample) {
    return `Quality is watch-range at ${pack.quality.qaScore}% — not a verdict, but warrants targeted defect coaching before scope expands.`;
  }
  if (pack.behaviour.behaviourRead === "Watch") {
    return `Behaviour is provisional/watch on urgent pickup (${pack.behaviour.urgentPickupShare}% vs ${pack.behaviour.roleExpectedShare}% expected) — discuss case-selection habits in the next 1:1.`;
  }
  if (disposition === "Strong — recognise") {
    return `No material risk flag — main opportunity is recognition and sustainable rostering${pack.workload.fairnessTag === "Over-loaded" ? " given over-loaded difficulty" : ""}.`;
  }
  return `No acute risk — maintain coaching rhythm on ${pack.performance.roleMetricOneLabel.toLowerCase()} and routine QA sampling.`;
}

function buildConfidenceAndCaveats(pack: OpsReviewPack): string[] {
  const caveats: string[] = [];

  if (pack.quality.lowSample) {
    caveats.push(
      `QA sample is n=${pack.quality.sampleCount} — quality read is provisional; expand sampling before a confident disposition shift.`,
    );
  }
  if (pack.behaviour.lowSample) {
    caveats.push(
      "Urgent-pickup behaviour uses a low sample this cycle — treat behaviour read as directional, not definitive.",
    );
  }
  if (pack.workload.fairnessTag === "Over-loaded") {
    caveats.push(
      "High workload difficulty is manager-controlled — do not downgrade disposition because of rostering alone.",
    );
  }
  caveats.push(
    `Comparison scope is ${pack.role} role peers only — raw case volume is not a ranking signal.`,
  );

  return caveats;
}

function buildAnalystFacingSummary(
  pack: OpsReviewPack,
  disposition: OpsReviewDisposition,
): OpsAnalystFacingSummary {
  return {
    whatWentWell: buildWhatWentWell(pack),
    whatToImprove: buildWhatToImprove(pack),
    workloadReassurance: buildWorkloadReassurance(pack),
    suggestedFocusActions: buildFocusActions(pack, disposition),
  };
}

function buildManagerDecisionSummary(
  pack: OpsReviewPack,
  disposition: OpsReviewDisposition,
): OpsManagerDecisionSummary {
  return {
    disposition,
    dispositionReason: dispositionReason(pack, disposition),
    strongestEvidence: buildStrongestEvidence(pack, disposition),
    mainRiskOrCoachingPoint: buildMainRiskOrCoachingPoint(pack, disposition),
    managerActions: managerActions(pack, disposition),
    confidenceAndCaveats: buildConfidenceAndCaveats(pack),
    humanInLoopClosingLine: HUMAN_IN_LOOP_CLOSING_LINE,
  };
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
    analystFacingSummary: buildAnalystFacingSummary(pack, disposition),
    managerDecisionSummary: buildManagerDecisionSummary(pack, disposition),
    generatedBy: "Mock deterministic copilot",
  };
}
