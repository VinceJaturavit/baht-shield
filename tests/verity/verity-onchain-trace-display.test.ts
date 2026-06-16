import { describe, it, expect } from "vitest";
import { buildOnChainTraceForScenario, getTraceSummary } from "@/lib/verity/onchain-trace";
import {
  formatHopPrimaryLine,
  getHopDetailFields,
  getHopPrimaryLineParts,
  getShortAttribution,
  RECOVERY_CHAIN_CAVEAT,
  RECOVERY_CHAIN_STAGES,
} from "@/lib/verity/onchain-trace-display";

describe("verity on-chain trace display helpers", () => {
  const appTrace = buildOnChainTraceForScenario({
    caseId: "CASE_APP_001",
    scenario: "APP Scam Cash-out Ring",
  });

  it("hop primary line includes index", () => {
    const hop = appTrace.hops[0];
    const line = formatHopPrimaryLine(hop, false);
    expect(line).toContain(`Hop ${hop.index}`);
    expect(getHopPrimaryLineParts(hop, false).index).toBe(hop.index);
  });

  it("hop primary line includes hop type", () => {
    const hop = appTrace.hops[2];
    const parts = getHopPrimaryLineParts(hop, false);
    expect(parts.hopType).toBe("Peel");
    expect(formatHopPrimaryLine(hop, false)).toContain("Peel");
  });

  it("hop primary line includes amount and asset", () => {
    const hop = appTrace.hops[0];
    const parts = getHopPrimaryLineParts(hop, false);
    expect(parts.amount).toBe(hop.amount.toLocaleString());
    expect(parts.asset).toBe(hop.asset);
    expect(formatHopPrimaryLine(hop, false)).toContain(hop.asset);
  });

  it("hop primary line includes short attribution", () => {
    const hop = appTrace.hops[3];
    const attribution = getShortAttribution(hop);
    expect(attribution).toBeTruthy();
    expect(formatHopPrimaryLine(hop, false)).toContain(attribution);
  });

  it("cash-out hop primary line includes recovery point label", () => {
    const cashOutHop = appTrace.hops.find(
      (h) => h.index === appTrace.cashOutEndpoint.hopIndex
    )!;
    const line = formatHopPrimaryLine(cashOutHop, true);
    expect(line.toLowerCase()).toContain("recovery point");
    expect(getHopPrimaryLineParts(cashOutHop, true).isCashOut).toBe(true);
  });

  it("co-mingled hop primary line includes co-mingled label", () => {
    const coMingledHop = appTrace.hops.find((h) => h.isCoMingled)!;
    const parts = getHopPrimaryLineParts(coMingledHop, false);
    expect(parts.isCoMingled).toBe(true);
    expect(formatHopPrimaryLine(coMingledHop, false).toLowerCase()).toContain(
      "co-mingled"
    );
  });

  it("co-mingled hop exposes method note in detail data", () => {
    const coMingledHop = appTrace.hops.find((h) => h.isCoMingled)!;
    const detail = getHopDetailFields(coMingledHop);
    expect(detail.methodNote).toBeTruthy();
    expect(detail.tracingMethod).toBe("pro-rata");
  });

  it("trace summary includes hop count", () => {
    const summary = getTraceSummary(appTrace);
    expect(summary).toContain(`${appTrace.hops.length} hops`);
  });

  it("trace summary includes cash-out endpoint", () => {
    const summary = getTraceSummary(appTrace);
    expect(summary).toContain(appTrace.cashOutEndpoint.vaspLabel);
  });

  it("trace summary includes co-mingling when present", () => {
    const summary = getTraceSummary(appTrace);
    expect(summary.toLowerCase()).toContain("co-mingling");
  });
});

describe("verity recovery chain display content", () => {
  it("includes Freeze, Seize, and Restitution labels", () => {
    const labels = RECOVERY_CHAIN_STAGES.map((s) => s.label);
    expect(labels).toContain("Freeze");
    expect(labels).toContain("Seize");
    expect(labels).toContain("Restitution");
  });

  it("includes gloss for each recovery stage", () => {
    expect(RECOVERY_CHAIN_STAGES[0].gloss).toContain("legal request");
    expect(RECOVERY_CHAIN_STAGES[1].gloss).toContain("custody");
    expect(RECOVERY_CHAIN_STAGES[2].gloss).toContain("victims");
  });

  it("includes explanatory-only caveat", () => {
    expect(RECOVERY_CHAIN_CAVEAT.toLowerCase()).toContain("explanatory only");
    expect(RECOVERY_CHAIN_CAVEAT.toLowerCase()).toContain("no freeze");
  });
});
