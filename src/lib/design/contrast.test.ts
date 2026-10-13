import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { parseColorTokens } from "./tokens";

const BACKGROUND = "#000000";

// Thresholds from spec 0002's color table. Black, hairline, and surface are
// excluded: the page color itself and two decorative tokens.
const THRESHOLDS: Readonly<Record<string, number>> = {
  white: 4.5,
  gray: 4.5,
  muted: 4.5,
  amber: 4.5,
  "field-line": 3,
};

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const failingTokens = (css: string) =>
  parseColorTokens(css)
    .filter(({ name }) => name in THRESHOLDS)
    .filter(({ name, value }) => contrastRatio(value, BACKGROUND) < (THRESHOLDS[name] ?? 0))
    .map(({ name }) => name);

describe("contrastRatio", () => {
  it("is 21 for white on black and 1 for identical colors", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
    expect(contrastRatio("#888888", "#888888")).toBe(1);
  });

  it("is symmetric and accepts shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(contrastRatio("#FFFFFF", "#000000"), 10);
  });

  it("matches the ratios recorded in the spec", () => {
    expect(contrastRatio("#888888", BACKGROUND)).toBeCloseTo(5.92, 2);
    expect(contrastRatio("#777777", BACKGROUND)).toBeCloseTo(4.69, 2);
    expect(contrastRatio("#FFB000", BACKGROUND)).toBeCloseTo(11.46, 2);
    expect(contrastRatio("#666666", BACKGROUND)).toBeCloseTo(3.66, 2);
  });

  it("rejects values that are not hex colors", () => {
    expect(() => contrastRatio("red", BACKGROUND)).toThrow();
  });
});

describe("color tokens in globals.css", () => {
  it("defines every tested token", () => {
    const names = parseColorTokens(globalsCss).map(({ name }) => name);

    expect(names).toEqual(expect.arrayContaining(Object.keys(THRESHOLDS)));
  });

  it("meets WCAG AA contrast on black", () => {
    expect(failingTokens(globalsCss)).toEqual([]);
  });

  it("fails the guard when a text token drops below its threshold", () => {
    const fixture = globalsCss.replace(/--color-muted:\s*#[0-9a-f]+;/i, "--color-muted: #666666;");

    expect(failingTokens(fixture)).toEqual(["muted"]);
  });
});
