import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const mainGuide = readFileSync(resolve(ROOT, "app/guide/page.tsx"), "utf8");

describe("Main /guide reviewer overview", () => {
  it("includes key platform and section strings", () => {
    expect(mainGuide).toContain("Ourox");
    expect(mainGuide).toContain("Arbiter");
    expect(mainGuide).toContain("Verity");
    expect(mainGuide).toContain("Ops");
    expect(mainGuide).toContain("Agentic investigation");
    expect(mainGuide).toContain(
      "AI compresses the work around a decision, not the decision"
    );
    expect(mainGuide).toContain("synthetic data");
  });

  it("links to agentic investigation and Ops guide", () => {
    expect(mainGuide).toContain('href="/verity/agent"');
    expect(mainGuide).toContain('href="/ops/guide"');
    expect(mainGuide).toContain("Open Agentic Investigation");
    expect(mainGuide).toContain("Read the Ops guide");
  });

  it("includes sticky index anchors for reviewer sections", () => {
    expect(mainGuide).toContain('id: "reviewer-overview"');
    expect(mainGuide).toContain('id: "lifecycle-loop"');
    expect(mainGuide).toContain('id: "agentic-investigation"');
    expect(mainGuide).toContain('id: "ai-philosophy"');
    expect(mainGuide).toContain('id: "where-to-click"');
  });

  it("does not reference forbidden names", () => {
    expect(mainGuide).not.toMatch(/\bKraken\b/);
    expect(mainGuide).not.toMatch(/\bPayward\b/);
    expect(mainGuide).not.toMatch(/\bSignalOS\b/);
  });
});
