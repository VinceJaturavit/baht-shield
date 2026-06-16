import { describe, it, expect } from "vitest";
import { runEvidenceAssembly } from "@/lib/verity/agent-engine";
import type { VerityAgentScenario, VerityTracingMethod } from "@/lib/verity/agent-types";
import {
  buildOnChainTraceForScenario,
  getCashOutEndpoint,
  getTraceSummary,
  RECOVERY_BACKTRACE_ROADMAP_COPY,
  TRACE_GOVERNANCE_COPY,
  validateSyntheticTraceAddresses,
} from "@/lib/verity/onchain-trace";
import * as fs from "fs";
import * as path from "path";

const SCENARIOS: Array<{ caseId: string; scenario: VerityAgentScenario }> = [
  { caseId: "CASE_APP_001", scenario: "APP Scam Cash-out Ring" },
  { caseId: "CASE_MF_001", scenario: "Onboarding Mule Farm" },
  { caseId: "CASE_SM_001", scenario: "Sleeper Mule Activation" },
];

const VALID_METHODS: VerityTracingMethod[] = [
  "FIFO",
  "LIFO",
  "LIBR",
  "pro-rata",
  "not_applicable",
];

describe("verity on-chain trace data model", () => {
  it("all three scenarios produce a trace", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      expect(trace).toBeDefined();
      expect(trace.caseId).toBe(caseId);
      expect(trace.scenario).toBe(scenario);
    }
  });

  it("trace direction is forward", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      expect(trace.traceDirection).toBe("forward");
      expect(trace.traceDirection).not.toBe("backward");
    }
  });

  it("every trace has ordered hops with sequential indexes", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      expect(trace.hops.length).toBeGreaterThanOrEqual(4);
      trace.hops.forEach((hop, i) => {
        expect(hop.index).toBe(i + 1);
      });
    }
  });

  it("every hop has fake synthetic from/to addresses", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      for (const hop of trace.hops) {
        expect(hop.fromAddress).toMatch(/SYNTH|DEMO|SYNTHETIC/i);
        expect(hop.toAddress).toMatch(/SYNTH|DEMO|SYNTHETIC/i);
        expect(hop.asset).toBeTruthy();
        expect(hop.chain).toBeTruthy();
        expect(hop.hopType).toBeTruthy();
        expect(hop.attributionLabel).toBeTruthy();
      }
      expect(validateSyntheticTraceAddresses(trace)).toBe(true);
    }
  });

  it("cash-out endpoint exists and references a hop", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      const endpoint = getCashOutEndpoint(trace);
      expect(endpoint.hopIndex).toBeGreaterThan(0);
      expect(endpoint.vaspLabel).toContain("SYNTH");
      expect(endpoint.recoveryPointLabel).toBe("Actionable recovery point");
      const hop = trace.hops.find((h) => h.index === endpoint.hopIndex);
      expect(hop).toBeDefined();
    }
  });

  it("same case/scenario produces same trace twice", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const a = buildOnChainTraceForScenario({ caseId, scenario });
      const b = buildOnChainTraceForScenario({ caseId, scenario });
      expect(a).toEqual(b);
    }
  });

  it("evidence pack includes onChainTrace", () => {
    for (const { caseId } of SCENARIOS) {
      const pack = runEvidenceAssembly(caseId)!;
      expect(pack.onChainTrace).toBeDefined();
      expect(pack.onChainTrace!.traceDirection).toBe("forward");
    }
  });

  it("onchain_exposure finding references trace", () => {
    const pack = runEvidenceAssembly("CASE_APP_001")!;
    const chainItem = pack.evidenceItems.find(
      (i) => i.category === "onchain_exposure"
    );
    expect(chainItem?.finding).toContain("Forward on-chain trace");
    expect(chainItem?.finding).toContain("synthetic VASP cash-out endpoint");
  });
});

describe("verity on-chain trace scenario shapes", () => {
  it("APP Scam trace includes fan-out/peel/layering and consolidation before VASP cash-out", () => {
    const trace = buildOnChainTraceForScenario({
      caseId: "CASE_APP_001",
      scenario: "APP Scam Cash-out Ring",
    });
    const hopTypes = trace.hops.map((h) => h.hopType);
    expect(hopTypes).toContain("peel");
    expect(hopTypes).toContain("consolidation");
    expect(hopTypes).toContain("cash-out");
    expect(trace.summary.toLowerCase()).toMatch(/fan-out|consolidation/);
    expect(trace.cashOutEndpoint.vaspLabel).toBe("SYNTH-Exchange-A");
  });

  it("Onboarding Mule Farm trace includes many-inflow or cluster-consolidation language", () => {
    const trace = buildOnChainTraceForScenario({
      caseId: "CASE_MF_001",
      scenario: "Onboarding Mule Farm",
    });
    const notes = trace.hops.map((h) => h.note + h.attributionLabel).join(" ");
    expect(notes.toLowerCase()).toMatch(/inflow|cluster|consolidation/);
    expect(trace.summary.toLowerCase()).toMatch(/mule-farm|consolidation/);
    expect(trace.cashOutEndpoint.vaspLabel).toBe("SYNTH-Exchange-B");
  });

  it("Sleeper Mule trace includes dormant activation and bridge or peel hop", () => {
    const trace = buildOnChainTraceForScenario({
      caseId: "CASE_SM_001",
      scenario: "Sleeper Mule Activation",
    });
    const hopTypes = trace.hops.map((h) => h.hopType);
    expect(hopTypes.some((t) => t === "bridge" || t === "peel")).toBe(true);
    expect(trace.summary.toLowerCase()).toMatch(/dormant|bridge/);
    expect(trace.cashOutEndpoint.vaspLabel).toBe("SYNTH-Exchange-C");
  });

  it("at least one scenario has a co-mingled hop with tracing method and method note", () => {
    const coMingledHops = SCENARIOS.flatMap(({ caseId, scenario }) =>
      buildOnChainTraceForScenario({ caseId, scenario }).hops.filter(
        (h) => h.isCoMingled
      )
    );
    expect(coMingledHops.length).toBeGreaterThan(0);
    for (const hop of coMingledHops) {
      expect(VALID_METHODS).toContain(hop.tracingMethod);
      expect(hop.tracingMethod).not.toBe("not_applicable");
      expect(hop.methodNote).toBeTruthy();
      expect(hop.methodNote!.toLowerCase()).toMatch(/judgment/);
    }
  });

  it("method labels are one of FIFO/LIFO/LIBR/pro-rata/not_applicable", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      for (const hop of trace.hops) {
        expect(VALID_METHODS).toContain(hop.tracingMethod);
      }
    }
  });

  it("getTraceSummary includes hop count and cash-out endpoint", () => {
    const trace = buildOnChainTraceForScenario({
      caseId: "CASE_APP_001",
      scenario: "APP Scam Cash-out Ring",
    });
    const summary = getTraceSummary(trace);
    expect(summary).toMatch(/^Forward trace:/);
    expect(summary).toContain(`${trace.hops.length} hops`);
    expect(summary).toContain(trace.cashOutEndpoint.vaspLabel);
    expect(summary).toContain("co-mingling");
  });
});

describe("verity on-chain trace honesty layer", () => {
  it("built trace direction never equals backward", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      expect(trace.traceDirection).not.toBe("backward");
    }
  });

  it("no runBackwardTrace or generateRecoveryBacktrace function exists in lib/verity", () => {
    const libDir = path.join(process.cwd(), "lib", "verity");
    const files = fs.readdirSync(libDir).filter((f) => f.endsWith(".ts"));
    const contents = files
      .map((f) => fs.readFileSync(path.join(libDir, f), "utf-8"))
      .join("\n");
    expect(contents).not.toMatch(/function runBackwardTrace/);
    expect(contents).not.toMatch(/function generateRecoveryBacktrace/);
    expect(contents).not.toMatch(/function generateBackwardTrace/);
  });

  it("roadmap copy includes human-led and not auto-run distinction", () => {
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.body.toLowerCase()).toContain(
      "human-led"
    );
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.body.toLowerCase()).toContain(
      "not auto-run"
    );
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.body.toLowerCase()).toContain(
      "forward trace"
    );
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.body.toLowerCase()).toContain(
      "backward trace"
    );
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.caption.toLowerCase()).toContain(
      "forward tracing"
    );
    expect(RECOVERY_BACKTRACE_ROADMAP_COPY.caption.toLowerCase()).toContain(
      "backward tracing"
    );
  });
});

describe("verity on-chain trace governance", () => {
  it("trace synthetic boundary mentions fake/synthetic addresses", () => {
    for (const { caseId, scenario } of SCENARIOS) {
      const trace = buildOnChainTraceForScenario({ caseId, scenario });
      expect(trace.syntheticBoundary.toLowerCase()).toMatch(/fake|synthetic/);
    }
  });

  it("trace governance note states no live chain query and no real VASP/vendor query", () => {
    expect(TRACE_GOVERNANCE_COPY.synthetic.toLowerCase()).toContain(
      "does not query a live blockchain"
    );
    expect(TRACE_GOVERNANCE_COPY.synthetic.toLowerCase()).toContain(
      "real vasp"
    );
    expect(TRACE_GOVERNANCE_COPY.synthetic.toLowerCase()).toContain(
      "chain-analytics vendor"
    );
  });

  it("trace governance note mentions human judgment and audit trail", () => {
    expect(TRACE_GOVERNANCE_COPY.synthetic.toLowerCase()).toContain(
      "human judgment"
    );
    expect(TRACE_GOVERNANCE_COPY.synthetic.toLowerCase()).toContain(
      "audit trail"
    );
  });

  it("method governance note states labels are not automatic truth", () => {
    expect(TRACE_GOVERNANCE_COPY.methods.toLowerCase()).toContain(
      "not automatic truth"
    );
  });
});
