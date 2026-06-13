import { getOpenOpsCases, hasDecisionAuthority } from "./roster";
import type { OpsShiftName, OpsTeamMemberWithLoad } from "./roster-types";
import type { OpsCase, OpsStreamCode } from "./types";

export type OpsShiftCoverageStatus = "Covered" | "Gap";

export interface OpsShiftCoverage {
  shift: OpsShiftName;
  fraudAnalysts: OpsTeamMemberWithLoad[];
  juniorAnalysts: OpsTeamMemberWithLoad[];
  hasDecisionAuthority: boolean;
  intakeCount: number;
  status: OpsShiftCoverageStatus;
  gapReason?: string;
  handoffCount: number;
}

const SHIFT_ORDER: OpsShiftName[] = ["Day", "Evening", "Night / On-call"];

const TIGHT_SLA_STREAMS: OpsStreamCode[] = ["RFR", "LAR", "PRO"];

function isPresentOnShift(member: OpsTeamMemberWithLoad): boolean {
  return member.attendance === "Present";
}

export function getShiftCoverageStatus(coverage: OpsShiftCoverage): OpsShiftCoverageStatus {
  const presentFraudAnalysts = coverage.fraudAnalysts.filter(isPresentOnShift);
  const presentJuniorAnalysts = coverage.juniorAnalysts.filter(isPresentOnShift);

  const hasAuthority = presentFraudAnalysts.some(hasDecisionAuthority);
  const hasIntake = presentJuniorAnalysts.length > 0;

  if (!hasAuthority) return "Gap";
  if (!hasIntake) return "Gap";
  return "Covered";
}

function getGapReason(coverage: OpsShiftCoverage): string | undefined {
  const presentFraudAnalysts = coverage.fraudAnalysts.filter(isPresentOnShift);
  const presentJuniorAnalysts = coverage.juniorAnalysts.filter(isPresentOnShift);

  const hasAuthority = presentFraudAnalysts.some(hasDecisionAuthority);
  const hasIntake = presentJuniorAnalysts.length > 0;

  if (!hasAuthority) return "No decision authority";
  if (!hasIntake) return "Intake coverage gap";
  return undefined;
}

function shiftIndexForCase(caseItem: OpsCase): number {
  let hash = 0;
  for (let i = 0; i < caseItem.id.length; i++) {
    hash = (hash + caseItem.id.charCodeAt(i) * (i + 1)) % SHIFT_ORDER.length;
  }
  return hash;
}

export function getShiftHandoffCount(cases: OpsCase[], shift: OpsShiftName): number {
  const shiftIndex = SHIFT_ORDER.indexOf(shift);
  const open = getOpenOpsCases(cases);

  return open.filter((c) => {
    if (!TIGHT_SLA_STREAMS.includes(c.stream)) return false;
    const nearBoundary = c.ageMinutes % 480 >= 390;
    return nearBoundary && shiftIndexForCase(c) === shiftIndex;
  }).length;
}

export function getShiftCoverage(
  teamWithLoad: OpsTeamMemberWithLoad[],
  cases: OpsCase[],
): OpsShiftCoverage[] {
  return SHIFT_ORDER.map((shift) => {
    const fraudAnalysts = teamWithLoad.filter(
      (m) => m.role === "Fraud Analyst" && m.shift === shift,
    );
    const juniorAnalysts = teamWithLoad.filter(
      (m) => m.role === "Junior Analyst" && m.shift === shift,
    );

    const presentFraudAnalysts = fraudAnalysts.filter(isPresentOnShift);
    const presentJuniorAnalysts = juniorAnalysts.filter(isPresentOnShift);

    const coverage: OpsShiftCoverage = {
      shift,
      fraudAnalysts,
      juniorAnalysts,
      hasDecisionAuthority: presentFraudAnalysts.some(hasDecisionAuthority),
      intakeCount: presentJuniorAnalysts.length,
      status: "Covered",
      handoffCount: getShiftHandoffCount(cases, shift),
    };

    coverage.status = getShiftCoverageStatus(coverage);
    coverage.gapReason = coverage.status === "Gap" ? getGapReason(coverage) : undefined;

    return coverage;
  });
}
