import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("trace theme tokens", () => {
  const configPath = path.join(process.cwd(), "tailwind.config.ts");
  const configSource = fs.readFileSync(configPath, "utf-8");

  const requiredTokens = [
    "primary: \"#2F7BF0\"",
    "cyan: \"#5BE1F0\"",
    "page: \"#F7FAFD\"",
    "card: \"#FFFFFF\"",
    "heading: \"#0F1B2D\"",
    "body: \"#3A4A5E\"",
    "border: \"#DCE6F2\"",
  ];

  for (const token of requiredTokens) {
    it(`trace namespace includes ${token.split(":")[0].trim()}`, () => {
      expect(configSource).toContain("trace:");
      expect(configSource).toContain(token);
    });
  }

  it("does not modify signal token values", () => {
    expect(configSource).toContain('bg: "#0F1720"');
    expect(configSource).toContain('accent: "#FF8200"');
  });

  it("does not modify ourox token values", () => {
    expect(configSource).toContain('orange: "#FF8200"');
    expect(configSource).toContain('obsidian: "#101820"');
  });
});
