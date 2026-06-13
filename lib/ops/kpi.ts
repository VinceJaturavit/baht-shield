import { OPS_STREAM_COMPLEXITY_WEIGHTS } from "@/data/ops/ops-kpi-config";
import { OPS_SYNTHETIC_QUALITY_SCORES } from "@/data/ops/ops-kpi-quality";
import { getAgingBucket, isActiveAgingCase } from "./aging";
import { getOpenOpsCases, getTeamWithLoad } from "./roster";
import type { OpsTeamMember } from "./roster-types";
import { OPS_STREAM_CODES } from "./streams";
import type {
  OpsIndividualKpi,
  OpsQueueHealthKpi,
  OpsTeamKpiSummary,
} from "./kpi-types";
import type { OpsCase, OpsStreamCode } from "./types";

const CLOSED_STATUS = "Closed";
const DECISION_STREAMS: OpsStreamCode[] = ["RFR", "LAR", "PRO"];
const INTAKE_STREAMS: OpsStreamCode[] = ["DSP", "PRF"];

export { OPS_STREAM_COMPLEXITY_WEIGHTS };

export function getStreamComplexityWeight(stream: OpsStreamCode): number {
  const entry = OPS_STREAM_COMPLEXITY_WEIGHTS.find((w) => w.stream === stream);
  return entry?.weight ?? 1;
}

export function getWeightedCaseValue(caseItem: OpsCase): number {
  return getStreamComplexityWeight(caseItem.stream);
}

function isClosed(caseItem: OpsCase): boolean {
  return caseItem.status === CLOSED_STATUS;
}

function roundRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 100;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function getSlaComplianceRate(cases: OpsCase[]): number {
  if (cases.length === 0) return 100;
  const compliant = cases.filter((c) => getAgingBucket(c) !== "Breached").length;
  return roundRate(compliant, cases.length);
}

function getBreachRate(cases: OpsCase[]): number {
  if (cases.length === 0) return 0;
  const breached = cases.filter((c) => getAgingBucket(c) === "Breached").length;
  return roundRate(breached, cases.length);
}

function sumWeightedThroughput(caseItems: OpsCase[]): number {
  const total = caseItems.reduce((sum, c) => sum + getWeightedCaseValue(c), 0);
  return Math.round(total * 10) / 10;
}

function getJuniorAnalystsForStream(
  roster: OpsTeamMember[],
  stream: OpsStreamCode,
): OpsTeamMember[] {
  return roster
    .filter((m) => m.role === "Junior Analyst" && m.streamsCovered.includes(stream))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function attributeIntakeCaseToJuniorAnalyst(
  caseItem: OpsCase,
  member: OpsTeamMember,
  roster: OpsTeamMember[],
  caseIndex: number,
): boolean {
  const eligible = getJuniorAnalystsForStream(roster, caseItem.stream);
  if (eligible.length === 0) return false;
  const memberIndex = eligible.findIndex((m) => m.id === member.id);
  if (memberIndex < 0) return false;
  return caseIndex % eligible.length === memberIndex;
}

function getJuniorAnalystAttributedCases(
  cases: OpsCase[],
  member: OpsTeamMember,
  roster: OpsTeamMember[],
  filter: (c: OpsCase) => boolean,
): OpsCase[] {
  const intakeCases = cases.filter(
    (c) => INTAKE_STREAMS.includes(c.stream) && filter(c),
  );
  return intakeCases.filter((c, i) =>
    attributeIntakeCaseToJuniorAnalyst(c, member, roster, i),
  );
}

function getIndividualStatus(
  slaComplianceRate: number,
  primaryQuality: number,
): OpsIndividualKpi["status"] {
  if (slaComplianceRate < 85 || primaryQuality < 88) return "Needs review";
  if (slaComplianceRate < 95 || primaryQuality < 92) return "Watch";
  return "On track";
}

function getQueueStatus(
  breachRate: number,
  atRiskCount: number,
  openBacklog: number,
): OpsQueueHealthKpi["queueStatus"] {
  if (breachRate > 0) return "Breached";
  if (atRiskCount >= 3 || (openBacklog > 0 && atRiskCount / openBacklog >= 0.25)) {
    return "Pressure";
  }
  if (atRiskCount > 0) return "Watch";
  return "Stable";
}

export function getTeamKpiSummary(
  cases: OpsCase[],
  roster: OpsTeamMember[],
): OpsTeamKpiSummary {
  const open = getOpenOpsCases(cases);
  const closed = cases.filter(isClosed);
  const active = cases.filter(isActiveAgingCase);
  const teamWithLoad = getTeamWithLoad(roster, cases);

  return {
    totalOpenCases: open.length,
    totalClosedCases: closed.length,
    weightedThroughput: sumWeightedThroughput(closed),
    slaComplianceRate: getSlaComplianceRate(active),
    breachRate: getBreachRate(active),
    atRiskCount: active.filter((c) => getAgingBucket(c) === "At-Risk").length,
    overloadedPeopleCount: teamWithLoad.filter((m) => m.isOverloaded).length,
  };
}

export function getIndividualKpis(
  cases: OpsCase[],
  roster: OpsTeamMember[],
): OpsIndividualKpi[] {
  return roster.map((member) => {
    const quality = OPS_SYNTHETIC_QUALITY_SCORES[member.id];

    if (member.role === "Fraud Analyst") {
      const owned = cases.filter((c) => c.owner === member.name);
      const handled = owned.filter(isClosed);
      const slaCases = owned.filter(
        (c) => isActiveAgingCase(c) && DECISION_STREAMS.includes(c.stream),
      );
      const fraudAnalystQuality =
        quality?.role === "Fraud Analyst"
          ? quality
          : { qaQuality: 90, escalationAccuracy: 88, decisionDocumentation: 90 };

      const slaComplianceRate = getSlaComplianceRate(slaCases);
      const primaryQuality = fraudAnalystQuality.qaQuality;

      return {
        memberId: member.id,
        name: member.name,
        role: member.role,
        streamsCovered: member.streamsCovered,
        rawHandledCases: handled.length,
        weightedThroughput: sumWeightedThroughput(handled),
        slaComplianceRate,
        primaryQualityMetricLabel: "QA quality",
        primaryQualityMetricValue: fraudAnalystQuality.qaQuality,
        secondaryMetricLabel: "Escalation accuracy",
        secondaryMetricValue: fraudAnalystQuality.escalationAccuracy,
        status: getIndividualStatus(slaComplianceRate, primaryQuality),
      };
    }

    const handled = getJuniorAnalystAttributedCases(cases, member, roster, isClosed);
    const activeIntake = getJuniorAnalystAttributedCases(
      cases,
      member,
      roster,
      (c) => isActiveAgingCase(c),
    );
    const juniorAnalystQuality =
      quality?.role === "Junior Analyst"
        ? quality
        : { evidenceCompleteness: 90, sopAdherence: 90, handoffQuality: 88 };

    const slaComplianceRate = getSlaComplianceRate(activeIntake);
    const primaryQuality = juniorAnalystQuality.evidenceCompleteness;

    return {
      memberId: member.id,
      name: member.name,
      role: member.role,
      streamsCovered: member.streamsCovered,
      rawHandledCases: handled.length,
      weightedThroughput: sumWeightedThroughput(handled),
      slaComplianceRate,
      primaryQualityMetricLabel: "Evidence completeness",
      primaryQualityMetricValue: juniorAnalystQuality.evidenceCompleteness,
      secondaryMetricLabel: "SOP adherence",
      secondaryMetricValue: juniorAnalystQuality.sopAdherence,
      status: getIndividualStatus(slaComplianceRate, primaryQuality),
    };
  });
}

export function getQueueHealthKpis(cases: OpsCase[]): OpsQueueHealthKpi[] {
  return OPS_STREAM_CODES.map((stream) => {
    const streamCases = cases.filter((c) => c.stream === stream);
    const openBacklog = streamCases.filter(isActiveAgingCase).length;
    const active = streamCases.filter(isActiveAgingCase);
    const atRiskCount = active.filter((c) => getAgingBucket(c) === "At-Risk").length;
    const breachedCount = active.filter((c) => getAgingBucket(c) === "Breached").length;
    const breachRate = getBreachRate(active);
    const weightedBacklog = active.reduce((sum, c) => sum + getWeightedCaseValue(c), 0);

    return {
      stream,
      openBacklog,
      atRiskCount,
      breachedCount,
      slaComplianceRate: getSlaComplianceRate(active),
      breachRate,
      weightedBacklog: Math.round(weightedBacklog * 10) / 10,
      queueStatus: getQueueStatus(breachRate, atRiskCount, openBacklog),
    };
  });
}
