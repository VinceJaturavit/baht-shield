import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import {
  TRACING_METHODOLOGY_PANEL,
  TRACING_METHODOLOGY_SECTIONS,
  TRACING_METHODOLOGY_REQUIRED_STRINGS,
} from "@/lib/verity/onchain-methodology-copy";

describe("verity on-chain tracing methodology content", () => {
  const serialized = JSON.stringify({
    panel: TRACING_METHODOLOGY_PANEL,
    sections: TRACING_METHODOLOGY_SECTIONS,
  });

  it("exports panel title and caption", () => {
    expect(TRACING_METHODOLOGY_PANEL.title).toBe("Tracing methodology");
    expect(TRACING_METHODOLOGY_PANEL.caption).toContain("forward tracing");
    expect(TRACING_METHODOLOGY_PANEL.caption).toContain("co-mingling");
  });

  it("covers all required methodology sections", () => {
    const headings = TRACING_METHODOLOGY_SECTIONS.map((s) => s.heading);
    expect(headings).toContain("Forward vs backward tracing");
    expect(headings).toContain("Co-mingling");
    expect(headings).toContain("Tracing methods");
    expect(headings).toContain("Method choice is a judgment call");
    expect(headings).toContain("VASP attribution and recovery endpoint");
    expect(headings).toContain("Recovery pathway");
    expect(headings).toContain("Synthetic boundary");
  });

  it("includes all required content strings", () => {
    for (const required of TRACING_METHODOLOGY_REQUIRED_STRINGS) {
      expect(serialized.toLowerCase()).toContain(required.toLowerCase());
    }
  });

  it("states forward trace is demo-assisted and backward is human-led", () => {
    const forwardSection = TRACING_METHODOLOGY_SECTIONS.find(
      (s) => s.id === "forward-vs-backward"
    )!;
    const text = forwardSection.body.join(" ");
    expect(text).toContain("This demo assists the forward trace");
    expect(text).toContain("human-led roadmap");
    expect(text).toContain("not an automated feature");
  });

  it("includes FIFO, LIFO, LIBR, and pro-rata method lines", () => {
    const methodsSection = TRACING_METHODOLOGY_SECTIONS.find(
      (s) => s.id === "tracing-methods"
    )!;
    expect(methodsSection.methods).toBeDefined();
    const labels = methodsSection.methods!.map((m) => m.label);
    expect(labels).toEqual(["FIFO", "LIFO", "LIBR", "Pro-rata"]);
  });

  it("includes UTXO vs account-based note", () => {
    const methodsSection = TRACING_METHODOLOGY_SECTIONS.find(
      (s) => s.id === "tracing-methods"
    )!;
    const text = methodsSection.body.join(" ").toLowerCase();
    expect(text).toContain("utxo");
    expect(text).toContain("account-based");
  });

  it("includes recovery pathway definitions", () => {
    const recoverySection = TRACING_METHODOLOGY_SECTIONS.find(
      (s) => s.id === "recovery-pathway"
    )!;
    const text = recoverySection.body.join(" ");
    expect(text).toContain("Freeze");
    expect(text).toContain("Seize");
    expect(text).toContain("Restitution");
    expect(text).toContain("does not execute legal");
  });

  it("includes synthetic boundary with no live chain query", () => {
    const syntheticSection = TRACING_METHODOLOGY_SECTIONS.find(
      (s) => s.id === "synthetic-boundary"
    )!;
    const text = syntheticSection.body.join(" ");
    expect(text.toLowerCase()).toContain("synthetic demo");
    expect(text.toLowerCase()).toContain("no live blockchain");
    expect(text).toContain("human investigator");
    expect(text).toContain("audit trail");
  });
});

describe("verity on-chain methodology — no working backtrace", () => {
  it("no runBackwardTrace or generateRecoveryBacktrace function exists in lib/verity", () => {
    const libDir = join(process.cwd(), "lib/verity");
    const files = readdirSync(libDir).filter((f) => f.endsWith(".ts"));
    const contents = files
      .map((f) => readFileSync(join(libDir, f), "utf-8"))
      .join("\n");
    expect(contents).not.toMatch(/function runBackwardTrace/);
    expect(contents).not.toMatch(/function generateRecoveryBacktrace/);
  });
});
