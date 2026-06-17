import { describe, it, expect } from "vitest";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { getAllTraceAddresses, traceAnchorCase } from "@/data/trace/trace-cases";

describe("trace product boundary copy", () => {
  const serialized = JSON.stringify(TRACE_BOUNDARY);

  it("Ourox Trace is not a tracing engine", () => {
    expect(serialized).toMatch(/not a tracing engine/i);
  });

  it("does not replace vendor tracing tools", () => {
    expect(serialized).toMatch(/does not replace vendor tracing/i);
  });

  it("synthetic vendor export stated", () => {
    expect(TRACE_BOUNDARY.vendorEvidenceCaption).toMatch(/Synthetic vendor export/i);
  });

  it("does not perform the trace", () => {
    expect(TRACE_BOUNDARY.vendorEvidenceCaption).toMatch(/does not perform the trace/i);
  });

  it("decision-support AI boundary", () => {
    expect(TRACE_BOUNDARY.aiRoleStatement).toMatch(/decision-support/i);
    expect(TRACE_BOUNDARY.aiRoleStatement).toMatch(/cannot choose/i);
  });

  it("human-owned method selection", () => {
    expect(TRACE_BOUNDARY.methodComparisonCaption).toMatch(/not automatic/i);
  });

  it("not legal advice", () => {
    expect(TRACE_BOUNDARY.evidencePackageBanner).toMatch(/not legal advice/i);
  });

  it("not a real recovery filing", () => {
    expect(TRACE_BOUNDARY.evidencePackageBanner).toMatch(/not a real recovery filing/i);
  });
});

describe("trace address safety", () => {
  const addresses = getAllTraceAddresses();

  it("all addresses include SYNTH or DEMO", () => {
    for (const addr of addresses) {
      expect(addr).toMatch(/SYNTH|DEMO/i);
    }
  });

  it("no realistic 0x hex addresses", () => {
    for (const addr of addresses) {
      expect(addr).not.toMatch(/^0x[a-fA-F0-9]{20,}$/);
    }
  });

  it("no realistic bc1 addresses", () => {
    for (const addr of addresses) {
      expect(addr).not.toMatch(/^bc1[a-zA-Z0-9]{20,}$/);
    }
  });
});

describe("anchor case pool math", () => {
  it("pool totals match spec", () => {
    expect(traceAnchorCase.poolTotalBeforeOutflow).toBe(25_000);
    expect(traceAnchorCase.remainingPoolBalance).toBe(13_000);
    expect(traceAnchorCase.frozenAmount).toBe(12_000);
  });
});
