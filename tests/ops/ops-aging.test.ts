import { describe, it, expect } from "vitest";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_CASES } from "@/data/ops/ops-cases";
import {
  getAgingBucket,
  getWaitingSplit,
  groupAgingCases,
  isActiveAgingCase,
  getSlaElapsedPercent,
} from "@/lib/ops/aging";
import { getSlaRuleForCase } from "@/lib/ops/sla";

function makeCase(overrides: Partial<OpsCase> & Pick<OpsCase, "id">): OpsCase {
  const base = OPS_CASES[0];
  return { ...base, ...overrides };
}

function caseWithElapsedPercent(pct: number): OpsCase {
  const base = OPS_CASES.find((c) => c.status !== "Closed")!;
  const rule = getSlaRuleForCase(base);
  return {
    ...base,
    id: `TEST-PCT-${pct}`,
    ageMinutes: Math.round(rule.durationMinutes * pct),
    status: "In progress",
  };
}

describe("getAgingBucket", () => {
  it("maps SLA percent to the correct bucket", () => {
    expect(getAgingBucket(caseWithElapsedPercent(0.1))).toBe("Fresh");
    expect(getAgingBucket(caseWithElapsedPercent(0.5))).toBe("Mid");
    expect(getAgingBucket(caseWithElapsedPercent(0.9))).toBe("At-Risk");
    expect(getAgingBucket(caseWithElapsedPercent(1.1))).toBe("Breached");
  });

  it("keeps At-Risk and Breached as separate buckets", () => {
    const atRisk = getAgingBucket(caseWithElapsedPercent(0.95));
    const breached = getAgingBucket(caseWithElapsedPercent(1.05));
    expect(atRisk).toBe("At-Risk");
    expect(breached).toBe("Breached");
    expect(atRisk).not.toBe(breached);
  });
});

describe("getSlaElapsedPercent", () => {
  it("uses ageMinutes over SLA duration", () => {
    const c = caseWithElapsedPercent(0.5);
    expect(getSlaElapsedPercent(c)).toBeCloseTo(0.5, 5);
  });
});

describe("getWaitingSplit", () => {
  it("maps Awaiting external to external", () => {
    const c = makeCase({
      id: "TEST-EXT",
      status: "Awaiting external",
    });
    expect(getWaitingSplit(c)).toBe("external");
  });

  it("maps New, In progress, Blocked, and Unassigned to on_us", () => {
    for (const status of ["New", "In progress", "Blocked"] as const) {
      expect(getWaitingSplit(makeCase({ id: `TEST-${status}`, status }))).toBe("on_us");
    }
    expect(
      getWaitingSplit(
        makeCase({ id: "TEST-UNASSIGNED", status: "New", owner: "Unassigned" }),
      ),
    ).toBe("on_us");
  });
});

describe("isActiveAgingCase", () => {
  it("excludes Closed cases from active aging", () => {
    const closed = OPS_CASES.filter((c) => c.status === "Closed");
    expect(closed.length).toBeGreaterThan(0);
    for (const c of closed) {
      expect(isActiveAgingCase(c)).toBe(false);
    }
    const active = OPS_CASES.filter((c) => c.status !== "Closed");
    expect(active.every(isActiveAgingCase)).toBe(true);
  });
});

describe("groupAgingCases", () => {
  it("groups by queue with bucket counts", () => {
    const rows = groupAgingCases(OPS_CASES, "queue");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.total).toBe(row.fresh + row.mid + row.atRisk + row.breached);
      expect(row.total).toBe(row.waitingOnUs + row.waitingOnExternal);
    }
  });

  it("groups by owner", () => {
    const rows = groupAgingCases(OPS_CASES, "owner");
    expect(rows.length).toBeGreaterThan(0);
    const owners = new Set(rows.map((r) => r.groupKey));
    expect(owners.has("Unassigned")).toBe(true);
  });

  it("groups by case type", () => {
    const rows = groupAgingCases(OPS_CASES, "caseType");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((r) => r.groupKey.includes("report") || r.groupKey.includes("request"))).toBe(
      true,
    );
  });

  it("excludes closed cases from totals", () => {
    const allRows = groupAgingCases(OPS_CASES, "queue");
    const closedCount = OPS_CASES.filter((c) => c.status === "Closed").length;
    const activeTotal = allRows.reduce((sum, r) => sum + r.total, 0);
    expect(activeTotal).toBe(OPS_CASES.length - closedCount);
  });
});
