import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { duration, ease, stagger, toCubicBezier, toSeconds } from "./motion";

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const cssValue = (property: string): string | undefined =>
  new RegExp(`${property}\\s*:\\s*([^;]+);`).exec(globalsCss)?.[1]?.trim();

describe("motion tokens", () => {
  it("converts milliseconds to the seconds Motion expects", () => {
    expect(toSeconds(600)).toBe(0.6);
    expect(toSeconds(0)).toBe(0);
  });

  it("formats an easing tuple as a CSS cubic-bezier", () => {
    expect(toCubicBezier([0.23, 1, 0.32, 1])).toBe("cubic-bezier(0.23, 1, 0.32, 1)");
  });
});

describe("CSS mirror in globals.css", () => {
  it.each([
    ["--duration-fast", duration.fast],
    ["--duration-roll", duration.roll],
    ["--duration-reveal", duration.reveal],
    ["--duration-glow", duration.glow],
    ["--duration-pulse", duration.pulse],
    ["--stagger-letters", stagger.letters],
  ])("%s equals the motion.ts value", (property, ms) => {
    expect(cssValue(property)).toBe(`${ms}ms`);
  });

  it("--ease-out-strong equals ease.out", () => {
    expect(cssValue("--ease-out-strong")).toBe(toCubicBezier(ease.out));
  });
});
