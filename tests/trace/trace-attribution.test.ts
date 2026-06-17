import { describe, it, expect } from "vitest";
import { traceAnchorCase } from "@/data/trace/trace-cases";
import { buildAttributionRows } from "@/lib/trace/attribution";
import { TRACE_VICTIM_IDS } from "@/lib/trace/boundary";

describe("buildAttributionRows", () => {
  it("pending method state exists before selection", () => {
    const rows = buildAttributionRows(traceAnchorCase, null);
    const poolRows = rows.filter((r) => r.victimId !== "CLAIM-AMB-001");
    expect(poolRows.every((r) => r.status === "pending-method")).toBe(true);
    expect(poolRows.every((r) => r.attributedAmount === 0)).toBe(true);
  });

  it("selected FIFO produces FIFO attribution rows", () => {
    const rows = buildAttributionRows(traceAnchorCase, "FIFO");
    const alice = rows.find((r) => r.victimId === TRACE_VICTIM_IDS.alice)!;
    const bob = rows.find((r) => r.victimId === TRACE_VICTIM_IDS.bob)!;
    const scammer = rows.find((r) => r.victimId === TRACE_VICTIM_IDS.scammer)!;
    expect(alice.attributedAmount).toBe(10_000);
    expect(alice.status).toBe("attributed");
    expect(bob.attributedAmount).toBe(2_000);
    expect(bob.status).toBe("partial");
    expect(scammer.attributedAmount).toBe(0);
    expect(scammer.status).toBe("partial");
  });

  it("selected LIFO produces LIFO attribution rows", () => {
    const rows = buildAttributionRows(traceAnchorCase, "LIFO");
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.alice)!.attributedAmount).toBe(0);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.bob)!.attributedAmount).toBe(7_000);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.scammer)!.attributedAmount).toBe(5_000);
  });

  it("selected LIBR produces LIBR attribution rows", () => {
    const rows = buildAttributionRows(traceAnchorCase, "LIBR");
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.alice)!.attributedAmount).toBe(7_000);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.bob)!.attributedAmount).toBe(0);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.scammer)!.attributedAmount).toBe(5_000);
  });

  it("selected pro-rata produces pro-rata attribution rows", () => {
    const rows = buildAttributionRows(traceAnchorCase, "pro-rata");
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.alice)!.attributedAmount).toBe(4_800);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.bob)!.attributedAmount).toBe(4_800);
    expect(rows.find((r) => r.victimId === TRACE_VICTIM_IDS.scammer)!.attributedAmount).toBe(2_400);
  });

  it("ambiguous claim remains insufficient-evidence for all methods", () => {
    for (const method of ["FIFO", "LIFO", "LIBR", "pro-rata"] as const) {
      const rows = buildAttributionRows(traceAnchorCase, method);
      const amb = rows.find((r) => r.victimId === "CLAIM-AMB-001")!;
      expect(amb.status).toBe("insufficient-evidence");
      expect(amb.attributedAmount).toBe(0);
    }
  });

  it("status attributed/partial/insufficient-evidence works", () => {
    const fifo = buildAttributionRows(traceAnchorCase, "FIFO");
    expect(fifo.find((r) => r.victimId === TRACE_VICTIM_IDS.alice)!.status).toBe("attributed");
    expect(fifo.find((r) => r.victimId === TRACE_VICTIM_IDS.bob)!.status).toBe("partial");
    expect(fifo.find((r) => r.victimId === "CLAIM-AMB-001")!.status).toBe("insufficient-evidence");
  });
});
