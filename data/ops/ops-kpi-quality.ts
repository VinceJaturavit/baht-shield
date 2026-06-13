/** Synthetic illustrative quality scores — not from a real QA system. */

export interface OpsOfficerQualityScores {
  qaQuality: number;
  escalationAccuracy: number;
  decisionDocumentation: number;
}

export interface OpsContractorQualityScores {
  evidenceCompleteness: number;
  sopAdherence: number;
  handoffQuality: number;
}

export type OpsSyntheticQualityEntry =
  | ({ role: "Officer" } & OpsOfficerQualityScores)
  | ({ role: "Contractor" } & OpsContractorQualityScores);

export const OPS_SYNTHETIC_QUALITY_SCORES: Record<string, OpsSyntheticQualityEntry> = {
  "OFF-001": {
    role: "Officer",
    qaQuality: 94,
    escalationAccuracy: 91,
    decisionDocumentation: 96,
  },
  "OFF-002": {
    role: "Officer",
    qaQuality: 92,
    escalationAccuracy: 89,
    decisionDocumentation: 93,
  },
  "OFF-003": {
    role: "Officer",
    qaQuality: 90,
    escalationAccuracy: 88,
    decisionDocumentation: 91,
  },
  "OFF-004": {
    role: "Officer",
    qaQuality: 93,
    escalationAccuracy: 90,
    decisionDocumentation: 95,
  },
  "CON-001": {
    role: "Contractor",
    evidenceCompleteness: 93,
    sopAdherence: 95,
    handoffQuality: 90,
  },
  "CON-002": {
    role: "Contractor",
    evidenceCompleteness: 91,
    sopAdherence: 94,
    handoffQuality: 92,
  },
  "CON-003": {
    role: "Contractor",
    evidenceCompleteness: 89,
    sopAdherence: 92,
    handoffQuality: 88,
  },
  "CON-004": {
    role: "Contractor",
    evidenceCompleteness: 92,
    sopAdherence: 93,
    handoffQuality: 91,
  },
  "CON-005": {
    role: "Contractor",
    evidenceCompleteness: 94,
    sopAdherence: 96,
    handoffQuality: 93,
  },
  "CON-006": {
    role: "Contractor",
    evidenceCompleteness: 87,
    sopAdherence: 90,
    handoffQuality: 85,
  },
  "CON-007": {
    role: "Contractor",
    evidenceCompleteness: 90,
    sopAdherence: 91,
    handoffQuality: 89,
  },
  "CON-008": {
    role: "Contractor",
    evidenceCompleteness: 88,
    sopAdherence: 89,
    handoffQuality: 86,
  },
};
