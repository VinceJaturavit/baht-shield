/**
 * Synthetic QA review samples linked to handled cases — illustrative only.
 */

import { OPS_HANDLED_CASES } from "./ops-handled-cases";
import { OPS_TEAM } from "./ops-team";
import type { OpsQaDefectCategory, OpsQaSample } from "@/lib/ops/qa-types";

const DEFECTS: OpsQaDefectCategory[] = [
  "Evidence incomplete",
  "Misclassification",
  "SLA mishandled",
  "Documentation gap",
  "Wrong escalation",
];

/** Fail rate per analyst (0 = all pass). Roughly 80–98% pass rates. */
const FAIL_INDICES: Record<string, number[]> = {
  "FA-001": [],
  "FA-002": [2],
  "FA-003": [1, 4],
  "FA-004": [3],
  "FA-005": [1, 2, 5],
  "FA-006": [2, 4],
  "JA-001": [3],
  "JA-002": [],
  "JA-003": [1, 3, 5],
  "JA-004": [2],
  "JA-005": [4],
  "JA-006": [1],
  "JA-007": [2, 4],
  "JA-008": [],
  "JA-009": [1, 3],
};

const DEFECT_BY_ANALYST: Record<string, OpsQaDefectCategory[]> = {
  "FA-002": ["Documentation gap"],
  "FA-003": ["Misclassification", "Evidence incomplete"],
  "FA-004": ["SLA mishandled"],
  "FA-005": ["Wrong escalation", "Documentation gap", "Evidence incomplete"],
  "FA-006": ["Misclassification", "Documentation gap"],
  "JA-001": ["Evidence incomplete"],
  "JA-003": ["Evidence incomplete", "Misclassification", "Documentation gap"],
  "JA-004": ["Misclassification"],
  "JA-005": ["Documentation gap"],
  "JA-006": ["Evidence incomplete"],
  "JA-007": ["SLA mishandled", "Evidence incomplete"],
  "JA-009": ["Misclassification", "Documentation gap"],
};

function casesForAnalyst(analystId: string) {
  return OPS_HANDLED_CASES.filter((c) => c.analystId === analystId);
}

function buildSamples(): OpsQaSample[] {
  const samples: OpsQaSample[] = [];
  let sampleSeq = 0;

  for (const member of OPS_TEAM) {
    const handled = casesForAnalyst(member.id);
    const sampleSize = Math.min(
      Math.max(4, Math.round(handled.length * 0.45)),
      8,
    );
    const failIndices = FAIL_INDICES[member.id] ?? [];
    const defects = DEFECT_BY_ANALYST[member.id] ?? [];

    for (let i = 0; i < sampleSize && i < handled.length; i++) {
      sampleSeq += 1;
      const isFail = failIndices.includes(i);
      const defectCategory = isFail
        ? defects[failIndices.indexOf(i)] ?? DEFECTS[i % DEFECTS.length]
        : undefined;

      samples.push({
        id: `QAS-${String(sampleSeq).padStart(3, "0")}`,
        handledCaseId: handled[i].id,
        analystId: member.id,
        analystName: member.name,
        result: isFail ? "Fail" : "Pass",
        defectCategory,
        qaScoreImpact: isFail ? -4 : 0,
      });
    }
  }

  return samples;
}

export const OPS_QA_SAMPLES: OpsQaSample[] = buildSamples();

export const OPS_QA_SAMPLE_COUNT = OPS_QA_SAMPLES.length;
