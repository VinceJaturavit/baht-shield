import { describe, it, expect } from "vitest";
import { traceAnchorCase } from "@/data/trace/trace-cases";
import { TRACE_VICTIM_IDS, TRACE_SEIZED_AMOUNT } from "@/lib/trace/boundary";
import {
  getAllocationForParty,
  validateMethodAllocations,
  getAliceOutcomesByMethod,
  getScammerOutcomesByMethod,
} from "@/lib/trace/methods";
import { buildSamePoolMatrix } from "@/lib/trace/method-display";

describe("trace method allocations — anchor case", () => {
  const comparisons = traceAnchorCase.methodComparisons;

  it("FIFO: Alice 10000, Bob 2000, Scammer 0", () => {
    const fifo = comparisons.find((m) => m.method === "FIFO")!;
    expect(getAllocationForParty(fifo, TRACE_VICTIM_IDS.alice)).toBe(10_000);
    expect(getAllocationForParty(fifo, TRACE_VICTIM_IDS.bob)).toBe(2_000);
    expect(getAllocationForParty(fifo, TRACE_VICTIM_IDS.scammer)).toBe(0);
  });

  it("LIFO: Alice 0, Bob 7000, Scammer 5000", () => {
    const lifo = comparisons.find((m) => m.method === "LIFO")!;
    expect(getAllocationForParty(lifo, TRACE_VICTIM_IDS.alice)).toBe(0);
    expect(getAllocationForParty(lifo, TRACE_VICTIM_IDS.bob)).toBe(7_000);
    expect(getAllocationForParty(lifo, TRACE_VICTIM_IDS.scammer)).toBe(5_000);
  });

  it("pro-rata: Alice 4800, Bob 4800, Scammer 2400", () => {
    const pr = comparisons.find((m) => m.method === "pro-rata")!;
    expect(getAllocationForParty(pr, TRACE_VICTIM_IDS.alice)).toBe(4_800);
    expect(getAllocationForParty(pr, TRACE_VICTIM_IDS.bob)).toBe(4_800);
    expect(getAllocationForParty(pr, TRACE_VICTIM_IDS.scammer)).toBe(2_400);
  });

  it("LIBR: Alice 7000, Bob 0, Scammer 5000", () => {
    const libr = comparisons.find((m) => m.method === "LIBR")!;
    expect(getAllocationForParty(libr, TRACE_VICTIM_IDS.alice)).toBe(7_000);
    expect(getAllocationForParty(libr, TRACE_VICTIM_IDS.bob)).toBe(0);
    expect(getAllocationForParty(libr, TRACE_VICTIM_IDS.scammer)).toBe(5_000);
  });

  it("each method total allocated equals 12000", () => {
    const { valid, errors } = validateMethodAllocations(comparisons);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
    for (const c of comparisons) {
      const total = c.allocations.reduce((s, a) => s + a.allocatedAmount, 0);
      expect(total).toBe(TRACE_SEIZED_AMOUNT);
    }
  });

  it("same pool produces different Alice outcomes across methods", () => {
    const alice = getAliceOutcomesByMethod(comparisons);
    expect(new Set(Object.values(alice)).size).toBeGreaterThan(1);
    expect(alice.FIFO).toBe(10_000);
    expect(alice.LIFO).toBe(0);
  });

  it("same pool produces different Scammer outcomes across methods", () => {
    const scammer = getScammerOutcomesByMethod(comparisons);
    expect(new Set(Object.values(scammer)).size).toBeGreaterThan(1);
    expect(scammer.FIFO).toBe(0);
    expect(scammer.LIFO).toBe(5_000);
  });
});

describe("frozen pool ledger", () => {
  it("matches anchor case running balances", () => {
    const ledger = traceAnchorCase.poolLedger;
    expect(ledger[0]).toMatchObject({ time: "t1", depositor: "Alice", amount: 10_000, runningBalance: 10_000 });
    expect(ledger[1]).toMatchObject({ time: "t2", depositor: "Bob", amount: 10_000, runningBalance: 20_000 });
    expect(ledger[2]).toMatchObject({ time: "t3", depositor: "Scammer", amount: 5_000, runningBalance: 25_000 });
    expect(ledger[3]).toMatchObject({ time: "t4", amount: 12_000, runningBalance: 13_000 });
  });
});

describe("same-pool comparison matrix presentation", () => {
  const matrix = buildSamePoolMatrix(traceAnchorCase.methodComparisons);

  it("includes Alice, Bob, and Scammer rows", () => {
    const parties = matrix.map((r) => r.party);
    expect(parties).toEqual(["Alice", "Bob", "Scammer"]);
  });

  it("FIFO Alice remains 10000", () => {
    const alice = matrix.find((r) => r.party === "Alice")!;
    expect(alice.allocations.FIFO).toBe(10_000);
  });

  it("LIFO Alice remains 0", () => {
    const alice = matrix.find((r) => r.party === "Alice")!;
    expect(alice.allocations.LIFO).toBe(0);
  });

  it("method comparisons retain weakness text for caveats disclosure", () => {
    for (const comparison of traceAnchorCase.methodComparisons) {
      expect(comparison.weakness.length).toBeGreaterThan(0);
      expect(comparison.defensibility.length).toBeGreaterThan(0);
      expect(comparison.uncertainty.length).toBeGreaterThan(0);
    }
  });
});
