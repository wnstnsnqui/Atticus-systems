import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { parseColorTokens } from "./tokens";

type ContrastPair = {
  readonly fg: readonly string[];
  readonly on: readonly string[];
  readonly min: number;
};

const SURFACES = ["void", "base", "raised", "overlay"] as const;

// The Contrast pairs table from spec 0002, the single authority on what is tested.
const PAIRS: readonly ContrastPair[] = [
  { fg: ["heading", "copy", "muted", "violet", "violet-hover", "red"], on: SURFACES, min: 4.5 },
  { fg: ["heading", "copy", "muted", "violet", "red"], on: ["dot"], min: 4.5 },
  { fg: ["green"], on: SURFACES, min: 3 },
  { fg: ["ink"], on: ["button", "button-hover"], min: 4.5 },
  { fg: ["violet-deep"], on: ["button"], min: 3 },
  { fg: ["field-line"], on: ["base", "raised"], min: 3 },
  { fg: ["violet"], on: ["void", "base", "raised"], min: 3 },
  { fg: ["ink"], on: ["violet"], min: 4.5 },
];

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

// Every pair below its threshold, as "fg on bg". A missing token always fails.
const contrastFailures = (css: string): readonly string[] => {
  const tokens = new Map(parseColorTokens(css).map(({ name, value }) => [name, value]));
  return PAIRS.flatMap(({ fg, on, min }) =>
    fg.flatMap((foreground) =>
      on
        .filter((background) => {
          const a = tokens.get(foreground);
          const b = tokens.get(background);
          return a === undefined || b === undefined || contrastRatio(a, b) < min;
        })
        .map((background) => `${foreground} on ${background}`),
    ),
  );
};

describe("contrastRatio", () => {
  it("is 21 for white on black and 1 for identical colors", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
    expect(contrastRatio("#888888", "#888888")).toBe(1);
  });

  it("is symmetric and accepts shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(contrastRatio("#FFFFFF", "#000000"), 10);
  });

  it("matches the lowest ratios recorded in the spec", () => {
    expect(contrastRatio("#8C89A6", "#1C1B24")).toBeCloseTo(5.07, 2);
    expect(contrastRatio("#8C89A6", "#262433")).toBeCloseTo(4.52, 2);
    expect(contrastRatio("#5B4BDB", "#D6D5E2")).toBeCloseTo(4.17, 2);
    expect(contrastRatio("#6E6994", "#15141B")).toBeCloseTo(3.58, 2);
  });

  it("rejects values that are not hex colors", () => {
    expect(() => contrastRatio("red", "#000000")).toThrow();
  });
});

describe("color tokens in globals.css", () => {
  it("meets every pair in the contrast matrix", () => {
    expect(contrastFailures(globalsCss)).toEqual([]);
  });

  it("names the token and each surface it misses when a text token is too dark", () => {
    const fixture = globalsCss.replace(/--color-muted:\s*#[0-9a-f]+;/i, "--color-muted: #66637A;");

    expect(contrastFailures(fixture)).toEqual([
      "muted on void",
      "muted on base",
      "muted on raised",
      "muted on overlay",
      "muted on dot",
    ]);
  });

  it("fails when a tested token is missing", () => {
    const fixture = globalsCss.replace(/--color-red:\s*#[0-9a-f]+;/i, "");

    expect(contrastFailures(fixture)).toContain("red on base");
  });

  it("resets Tailwind's default color, radius, and shadow scales", () => {
    expect(globalsCss).toMatch(/--color-\*:\s*initial;/);
    expect(globalsCss).toMatch(/--radius-\*:\s*initial;/);
    expect(globalsCss).toMatch(/--shadow-\*:\s*initial;/);
  });
});
