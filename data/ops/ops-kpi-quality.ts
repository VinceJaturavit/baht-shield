/** Synthetic illustrative quality scores — not from a real QA system. */

export interface OpsFraudAnalystQualityScores {
  qaQuality: number;
  escalationAccuracy: number;
  decisionDocumentation: number;
}

export interface OpsJuniorAnalystQualityScores {
  evidenceCompleteness: number;
  sopAdherence: number;
  handoffQuality: number;
}

export type OpsSyntheticQualityEntry =
  | ({ role: "Fraud Analyst" } & OpsFraudAnalystQualityScores)
  | ({ role: "Junior Analyst" } & OpsJuniorAnalystQualityScores);

export const OPS_SYNTHETIC_QUALITY_SCORES: Record<string, OpsSyntheticQualityEntry> = {
  "FA-001": {
    role: "Fraud Analyst",
    qaQuality: 94,
    escalationAccuracy: 91,
    decisionDocumentation: 96,
  },
  "FA-002": {
    role: "Fraud Analyst",
    qaQuality: 92,
    escalationAccuracy: 89,
    decisionDocumentation: 93,
  },
  "FA-003": {
    role: "Fraud Analyst",
    qaQuality: 90,
    escalationAccuracy: 88,
    decisionDocumentation: 91,
  },
  "FA-004": {
    role: "Fraud Analyst",
    qaQuality: 93,
    escalationAccuracy: 90,
    decisionDocumentation: 95,
  },
  "FA-005": {
    role: "Fraud Analyst",
    qaQuality: 91,
    escalationAccuracy: 87,
    decisionDocumentation: 92,
  },
  "FA-006": {
    role: "Fraud Analyst",
    qaQuality: 89,
    escalationAccuracy: 86,
    decisionDocumentation: 90,
  },
  "JA-001": {
    role: "Junior Analyst",
    evidenceCompleteness: 93,
    sopAdherence: 95,
    handoffQuality: 90,
  },
  "JA-002": {
    role: "Junior Analyst",
    evidenceCompleteness: 91,
    sopAdherence: 94,
    handoffQuality: 92,
  },
  "JA-003": {
    role: "Junior Analyst",
    evidenceCompleteness: 89,
    sopAdherence: 92,
    handoffQuality: 88,
  },
  "JA-004": {
    role: "Junior Analyst",
    evidenceCompleteness: 92,
    sopAdherence: 93,
    handoffQuality: 91,
  },
  "JA-005": {
    role: "Junior Analyst",
    evidenceCompleteness: 94,
    sopAdherence: 96,
    handoffQuality: 93,
  },
  "JA-006": {
    role: "Junior Analyst",
    evidenceCompleteness: 87,
    sopAdherence: 90,
    handoffQuality: 85,
  },
  "JA-007": {
    role: "Junior Analyst",
    evidenceCompleteness: 90,
    sopAdherence: 91,
    handoffQuality: 89,
  },
  "JA-008": {
    role: "Junior Analyst",
    evidenceCompleteness: 88,
    sopAdherence: 89,
    handoffQuality: 86,
  },
  "JA-009": {
    role: "Junior Analyst",
    evidenceCompleteness: 90,
    sopAdherence: 92,
    handoffQuality: 88,
  },
};
