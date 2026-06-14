import { OPS_HANDLED_CASES } from "@/data/ops/ops-handled-cases";
import { OPS_QA_SAMPLES } from "@/data/ops/ops-qa-samples";
import { OPS_SYNTHETIC_QUALITY_SCORES } from "@/data/ops/ops-kpi-quality";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { getStreamComplexityWeight } from "./kpi";
import type { OpsPerformanceRow, OpsPerformanceStatus } from "./performance-types";
import type { OpsTeamRole } from "./roster-types";

function roundRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 100;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function roundThroughput(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getHandledCasesForAnalyst(analystId: string) {
  return OPS_HANDLED_CASES.filter((c) => c.analystId === analystId);
}

export function getRawHandledVolume(analystId: string): number {
  return getHandledCasesForAnalyst(analystId).length;
}

export function getComplexityWeightedThroughput(analystId: string): number {
  const total = getHandledCasesForAnalyst(analystId).reduce(
    (sum, c) => sum + getStreamComplexityWeight(c.stream),
    0,
  );
  return roundThroughput(total);
}

export function getQaQualityScore(analystId: string): number {
  const samples = OPS_QA_SAMPLES.filter((s) => s.analystId === analystId);
  if (samples.length === 0) return 100;
  const passed = samples.filter((s) => s.result === "Pass").length;
  return roundRate(passed, samples.length);
}

export function getSlaComplianceRateForAnalyst(analystId: string): number {
  const handled = getHandledCasesForAnalyst(analystId);
  if (handled.length === 0) return 100;
  const met = handled.filter((c) => c.slaMet).length;
  return roundRate(met, handled.length);
}

export function getPerformanceStatus(row: OpsPerformanceRow): OpsPerformanceStatus {
  const { qaQualityScore, slaComplianceRate } = row;
  if (qaQualityScore < 85 || slaComplianceRate < 85) return "Needs review";
  if (qaQualityScore < 90 || slaComplianceRate < 90) return "Watch";
  return "On track";
}

function getRoleMetrics(memberId: string, role: OpsTeamRole) {
  const quality = OPS_SYNTHETIC_QUALITY_SCORES[memberId];

  if (role === "Fraud Analyst") {
    const scores =
      quality?.role === "Fraud Analyst"
        ? quality
        : { escalationAccuracy: 88, decisionDocumentation: 90 };
    return {
      roleMetricOneLabel: "Escalation accuracy",
      roleMetricOneValue: scores.escalationAccuracy,
      roleMetricTwoLabel: "Decision documentation",
      roleMetricTwoValue: scores.decisionDocumentation,
    };
  }

  const scores =
    quality?.role === "Junior Analyst"
      ? quality
      : { evidenceCompleteness: 90, sopAdherence: 90 };
  return {
    roleMetricOneLabel: "Evidence completeness",
    roleMetricOneValue: scores.evidenceCompleteness,
    roleMetricTwoLabel: "SOP adherence",
    roleMetricTwoValue: scores.sopAdherence,
  };
}

function buildPerformanceRow(analystId: string): OpsPerformanceRow {
  const member = OPS_TEAM.find((m) => m.id === analystId);
  if (!member) {
    throw new Error(`Unknown analyst ${analystId}`);
  }

  const roleMetrics = getRoleMetrics(member.id, member.role);
  const row: OpsPerformanceRow = {
    analystId: member.id,
    analystName: member.name,
    role: member.role,
    rawHandledCases: getRawHandledVolume(analystId),
    weightedThroughput: getComplexityWeightedThroughput(analystId),
    qaQualityScore: getQaQualityScore(analystId),
    slaComplianceRate: getSlaComplianceRateForAnalyst(analystId),
    ...roleMetrics,
    status: "On track",
  };
  row.status = getPerformanceStatus(row);
  return row;
}

export function getPerformanceRows(): OpsPerformanceRow[] {
  return OPS_TEAM.map((m) => buildPerformanceRow(m.id));
}

export function getPerformanceRowsByRole(role: OpsTeamRole): OpsPerformanceRow[] {
  return getPerformanceRows().filter((r) => r.role === role);
}

/** Exposed for tests — confirms performance uses synthetic handled cases, not live queue. */
export function getPerformanceDataSource() {
  return OPS_HANDLED_CASES;
}
