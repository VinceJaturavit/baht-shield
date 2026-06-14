import { OPS_HANDLED_CASES } from "@/data/ops/ops-handled-cases";
import { OPS_QA_SAMPLES } from "@/data/ops/ops-qa-samples";
import { OPS_TEAM } from "@/data/ops/ops-team";
import type { OpsQaDefectCategory, OpsQaReadStatus, OpsQaRow, OpsSlaPickupStatus } from "./qa-types";
import type { OpsTeamRole } from "./roster-types";

const ALL_DEFECTS: OpsQaDefectCategory[] = [
  "Evidence incomplete",
  "Misclassification",
  "SLA mishandled",
  "Documentation gap",
  "Wrong escalation",
];

function roundRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function activeMembersInRole(role: OpsTeamRole) {
  return OPS_TEAM.filter((m) => m.role === role && m.attendance === "Present");
}

function urgentHandledInRole(role: OpsTeamRole) {
  const memberIds = new Set(OPS_TEAM.filter((m) => m.role === role).map((m) => m.id));
  return OPS_HANDLED_CASES.filter(
    (c) => memberIds.has(c.analystId) && c.wasUrgentOrNearBreach,
  );
}

export function getQaSamplesForAnalyst(analystId: string) {
  return OPS_QA_SAMPLES.filter((s) => s.analystId === analystId);
}

export function getQaScoreByAnalyst(analystId: string): number {
  const samples = getQaSamplesForAnalyst(analystId);
  if (samples.length === 0) return 100;
  const passed = samples.filter((s) => s.result === "Pass").length;
  return roundRate(passed, samples.length);
}

export function getQaDefectBreakdown(
  analystId: string,
): Record<OpsQaDefectCategory, number> {
  const breakdown = Object.fromEntries(
    ALL_DEFECTS.map((d) => [d, 0]),
  ) as Record<OpsQaDefectCategory, number>;

  for (const sample of getQaSamplesForAnalyst(analystId)) {
    if (sample.result === "Fail" && sample.defectCategory) {
      breakdown[sample.defectCategory] += 1;
    }
  }

  return breakdown;
}

export function getTopDefectCategory(
  analystId: string,
): OpsQaDefectCategory | undefined {
  const breakdown = getQaDefectBreakdown(analystId);
  const entries = Object.entries(breakdown).filter(([, count]) => count > 0);
  if (entries.length === 0) return undefined;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0] as OpsQaDefectCategory;
}

export function getUrgentPickupShareByAnalyst(analystId: string): number {
  const member = OPS_TEAM.find((m) => m.id === analystId);
  if (!member) return 0;

  const roleUrgent = urgentHandledInRole(member.role);
  if (roleUrgent.length === 0) return 0;

  const analystUrgent = roleUrgent.filter((c) => c.analystId === analystId).length;
  return roundRate(analystUrgent, roleUrgent.length);
}

export function getRoleExpectedUrgentPickupShare(role: OpsTeamRole): number {
  const activeCount = activeMembersInRole(role).length;
  if (activeCount === 0) return 0;
  return roundRate(1, activeCount);
}

export function getSlaPickupBehaviourStatus(analystId: string): {
  status: OpsSlaPickupStatus;
  detail?: string;
} {
  const member = OPS_TEAM.find((m) => m.id === analystId);
  if (!member) return { status: "Watch", detail: "low sample" };

  const handled = OPS_HANDLED_CASES.filter((c) => c.analystId === analystId);
  const urgentHandled = handled.filter((c) => c.wasUrgentOrNearBreach).length;

  if (handled.length < 5 || urgentHandled < 2) {
    return { status: "Watch", detail: "low sample" };
  }

  const pickupShare = getUrgentPickupShareByAnalyst(analystId);
  const expectedShare = getRoleExpectedUrgentPickupShare(member.role);
  if (expectedShare === 0) return { status: "Watch", detail: "low sample" };

  const ratio = pickupShare / expectedShare;

  if (ratio >= 0.8) return { status: "Healthy" };
  if (ratio >= 0.5) return { status: "Watch" };
  return { status: "Avoidance risk" };
}

export function getQaReadStatus(qaScore: number): OpsQaReadStatus {
  if (qaScore < 85) return "Needs review";
  if (qaScore < 90) return "Watch";
  return "On track";
}

export function getQaRows(): OpsQaRow[] {
  return OPS_TEAM.map((member) => {
    const samples = getQaSamplesForAnalyst(member.id);
    const passCount = samples.filter((s) => s.result === "Pass").length;
    const failCount = samples.filter((s) => s.result === "Fail").length;
    const qaScore = getQaScoreByAnalyst(member.id);
    const pickup = getSlaPickupBehaviourStatus(member.id);

    return {
      analystId: member.id,
      analystName: member.name,
      role: member.role,
      qaSampleCount: samples.length,
      qaPassCount: passCount,
      qaFailCount: failCount,
      qaScore,
      topDefectCategory: getTopDefectCategory(member.id),
      urgentPickupShare: getUrgentPickupShareByAnalyst(member.id),
      roleExpectedUrgentPickupShare: getRoleExpectedUrgentPickupShare(member.role),
      slaPickupStatus: pickup.status,
      slaPickupDetail: pickup.detail,
      qaReadStatus: getQaReadStatus(qaScore),
    };
  });
}

export function getQaRowsByRole(role: OpsTeamRole): OpsQaRow[] {
  return getQaRows().filter((r) => r.role === role);
}

export const QA_REOPEN_LINKAGE_NOTE =
  "Conceptual linkage: a QA failure would route the case back to a Reopened queue for correction or review. This MVP shows the linkage as a read-only note; it does not build a reopen workflow engine.";

/** Exposed for tests — confirms QA uses synthetic samples only. */
export function getQaDataSources() {
  return { samples: OPS_QA_SAMPLES, handledCases: OPS_HANDLED_CASES };
}
