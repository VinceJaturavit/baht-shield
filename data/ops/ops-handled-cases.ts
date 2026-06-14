/**
 * Synthetic weekly handled-case sample for Performance and QA views.
 * Separate from the live ops case queue — illustrative only.
 */

import { OPS_TEAM } from "./ops-team";
import type { OpsHandledCase, OpsHandledCaseOutcome } from "@/lib/ops/performance-types";
import type { OpsStreamCode } from "@/lib/ops/types";

const REFERENCE_NOW = new Date("2026-06-14T12:00:00.000Z");

type CaseSeed = {
  analystId: string;
  stream: OpsStreamCode;
  caseType: string;
  outcome: OpsHandledCaseOutcome;
  daysAgo: number;
  wasUrgentOrNearBreach: boolean;
  slaMet: boolean;
};

/** Per-analyst volume targets for the synthetic week (Off/Leave get fewer). */
const VOLUME_TARGETS: Record<string, number> = {
  "FA-001": 14,
  "FA-002": 12,
  "FA-003": 11,
  "FA-004": 13,
  "FA-005": 10,
  "FA-006": 9,
  "JA-001": 11,
  "JA-002": 10,
  "JA-003": 9,
  "JA-004": 10,
  "JA-005": 9,
  "JA-006": 3,
  "JA-007": 9,
  "JA-008": 2,
  "JA-009": 8,
};

/** Urgent-share multiplier — values below 1.0 reduce urgent pickup for behaviour demo. */
const URGENT_MULTIPLIER: Record<string, number> = {
  "FA-005": 0.35,
  "JA-003": 0.4,
};

const FA_STREAMS: OpsStreamCode[] = ["RFR", "LAR", "PRO"];
const JA_STREAMS: OpsStreamCode[] = ["DSP", "PRF"];

const FA_CASE_TYPES: Record<OpsStreamCode, string[]> = {
  RFR: ["Statutory fraud report", "Suspicious transaction report", "Registry submission follow-up"],
  LAR: ["Authority information request", "Court order response", "Regulator inquiry"],
  PRO: ["Funds-in-flight alert", "Hold confirmation", "Payment reversal review"],
  DSP: ["Dispute intake"],
  PRF: ["Profile verification"],
};

const JA_CASE_TYPES: Record<OpsStreamCode, string[]> = {
  DSP: ["Dispute intake", "Complaint escalation", "Chargeback review"],
  PRF: ["Profile verification", "Document re-verification", "Identity check"],
  RFR: ["Intake prep"],
  LAR: ["Evidence assembly"],
  PRO: ["Alert triage"],
};

function memberById(id: string) {
  const member = OPS_TEAM.find((m) => m.id === id);
  if (!member) throw new Error(`Unknown analyst ${id}`);
  return member;
}

function buildSeeds(): CaseSeed[] {
  const seeds: CaseSeed[] = [];
  let seq = 0;

  for (const [analystId, target] of Object.entries(VOLUME_TARGETS)) {
    const member = memberById(analystId);
    const streams = member.role === "Fraud Analyst" ? FA_STREAMS : JA_STREAMS;
    const typesByStream =
      member.role === "Fraud Analyst" ? FA_CASE_TYPES : JA_CASE_TYPES;
    const urgentMultiplier = URGENT_MULTIPLIER[analystId] ?? 1;

    for (let i = 0; i < target; i++) {
      seq += 1;
      const stream = streams[i % streams.length];
      const typeOptions = typesByStream[stream];
      const caseType = typeOptions[i % typeOptions.length];

      const baseUrgentRate = member.role === "Fraud Analyst" ? 0.38 : 0.28;
      const urgentRoll = (seq * 17 + i * 7) % 100;
      const wasUrgentOrNearBreach =
        urgentRoll < baseUrgentRate * 100 * urgentMultiplier;

      const slaRoll = (seq * 13 + i * 11) % 100;
      const slaMet = wasUrgentOrNearBreach
        ? slaRoll > 8
        : slaRoll > 4;

      const outcomeRoll = (seq + i) % 10;
      let outcome: OpsHandledCaseOutcome = "Closed";
      if (member.role === "Fraud Analyst" && outcomeRoll === 0) outcome = "Escalated";
      else if (outcomeRoll === 1) outcome = "Handed off";

      seeds.push({
        analystId,
        stream,
        caseType,
        outcome,
        daysAgo: (i % 6) + 1,
        wasUrgentOrNearBreach,
        slaMet,
      });
    }
  }

  return seeds;
}

function toHandledCase(seed: CaseSeed, index: number): OpsHandledCase {
  const member = memberById(seed.analystId);
  const handledAt = new Date(
    REFERENCE_NOW.getTime() - seed.daysAgo * 24 * 60 * 60 * 1000,
  ).toISOString();

  return {
    id: `HND-${String(index + 1).padStart(3, "0")}`,
    analystId: seed.analystId,
    analystName: member.name,
    stream: seed.stream,
    caseType: seed.caseType,
    outcome: seed.outcome,
    handledAt,
    wasUrgentOrNearBreach: seed.wasUrgentOrNearBreach,
    slaMet: seed.slaMet,
  };
}

export const OPS_HANDLED_CASES: OpsHandledCase[] = buildSeeds().map(toHandledCase);

export const OPS_HANDLED_CASE_COUNT = OPS_HANDLED_CASES.length;
