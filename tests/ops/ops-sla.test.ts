import { describe, it, expect } from "vitest";
import { OPS_STREAMS, OPS_STREAM_CODES } from "@/lib/ops/streams";
import { OPS_SLA_RULES } from "@/lib/ops/sla-rules";
import {
  OPS_CASES,
  OPS_CASE_COUNT,
  getOpsStreamDistribution,
} from "@/data/ops/ops-cases";
import {
  getSlaPressure,
  getSlaPressureScore,
  sortOpsCases,
  OPS_REFERENCE_NOW,
} from "@/lib/ops/sla";
import type { OpsCase } from "@/lib/ops/types";

const FORBIDDEN = ["TrueMoney", "Kraken", "Payward", "SignalOS"];

const REQUIRED_FIELDS: (keyof OpsCase)[] = [
  "id",
  "stream",
  "type",
  "priorityTier",
  "urgencyReason",
  "createdAt",
  "slaRuleRef",
  "slaDue",
  "ageMinutes",
  "status",
  "owner",
  "queue",
];

describe("OPS_STREAMS", () => {
  it("defines all five stream codes", () => {
    expect(OPS_STREAM_CODES).toEqual(["RFR", "LAR", "PRO", "DSP", "PRF"]);
    expect(OPS_STREAMS).toHaveLength(5);
  });

  it("does not treat Urgent as a stream", () => {
    for (const stream of OPS_STREAMS) {
      expect(stream.code).not.toBe("Urgent");
      expect(stream.label.toLowerCase()).not.toContain("urgent overlay");
    }
  });
});

describe("OPS_CASES", () => {
  it("has 40–70 synthetic cases", () => {
    expect(OPS_CASE_COUNT).toBeGreaterThanOrEqual(40);
    expect(OPS_CASE_COUNT).toBeLessThanOrEqual(70);
    expect(OPS_CASES).toHaveLength(56);
  });

  it("includes every required field on each case", () => {
    for (const c of OPS_CASES) {
      for (const field of REQUIRED_FIELDS) {
        expect(c[field], `${c.id}.${field}`).toBeTruthy();
      }
    }
  });

  it("references a valid SLA rule for every case", () => {
    const refs = new Set(OPS_SLA_RULES.map((r) => r.ruleRef));
    for (const c of OPS_CASES) {
      expect(refs.has(c.slaRuleRef)).toBe(true);
      const rule = OPS_SLA_RULES.find((r) => r.ruleRef === c.slaRuleRef)!;
      expect(rule.stream).toBe(c.stream);
    }
  });

  it("spreads cases across all five streams", () => {
    const dist = getOpsStreamDistribution();
    for (const code of OPS_STREAM_CODES) {
      expect(dist[code as keyof typeof dist]).toBeGreaterThanOrEqual(8);
    }
  });

  it("contains no forbidden organization strings", () => {
    const blob = JSON.stringify(OPS_CASES);
    for (const term of FORBIDDEN) {
      expect(blob.includes(term)).toBe(false);
    }
  });
});

describe("sortOpsCases", () => {
  it("orders Urgent before High before Standard", () => {
    const sorted = sortOpsCases(OPS_CASES, OPS_REFERENCE_NOW);
    let lastPriority = -1;
    const priorityRank = { Urgent: 0, High: 1, Standard: 2 };
    for (const c of sorted) {
      const rank = priorityRank[c.priorityTier];
      expect(rank).toBeGreaterThanOrEqual(lastPriority);
      if (rank > lastPriority) lastPriority = rank;
    }
  });

  it("places breached/near-breach above on-track within same priority", () => {
    const sample = OPS_CASES.filter((c) => c.priorityTier === "Standard" && c.stream === "DSP");
    const sorted = sortOpsCases(sample, OPS_REFERENCE_NOW);
    for (let i = 1; i < sorted.length; i++) {
      const prev = getSlaPressureScore(sorted[i - 1], OPS_REFERENCE_NOW);
      const curr = getSlaPressureScore(sorted[i], OPS_REFERENCE_NOW);
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it("does not sort by created-at FIFO alone", () => {
    const sorted = sortOpsCases(OPS_CASES, OPS_REFERENCE_NOW);
    const fifoOrder = [...OPS_CASES].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    expect(sorted.map((c) => c.id)).not.toEqual(fifoOrder.map((c) => c.id));
  });
});

describe("getSlaPressure", () => {
  it("varies SLA pressure across the dataset", () => {
    const pressures = new Set(OPS_CASES.map((c) => getSlaPressure(c, OPS_REFERENCE_NOW)));
    expect(pressures.size).toBeGreaterThanOrEqual(3);
    expect(pressures.has("Breached")).toBe(true);
    expect(pressures.has("On track")).toBe(true);
  });
});
