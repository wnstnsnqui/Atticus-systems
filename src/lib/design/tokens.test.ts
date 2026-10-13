import { describe, expect, it } from "vitest";
import { parseColorTokens } from "./tokens";

describe("parseColorTokens", () => {
  it("reads colors from the first @theme block in source order, uppercased", () => {
    const css = `
      @import "tailwindcss";
      @theme {
        --color-*: initial;
        --color-black: #000000;
        --color-field-line: #666;
        --text-h1: 4rem;
      }
    `;

    expect(parseColorTokens(css)).toEqual([
      { name: "black", value: "#000000" },
      { name: "field-line", value: "#666" },
    ]);
  });

  it("ignores @theme inline blocks and colors outside the theme", () => {
    const css = `
      :root { --color-stray: #123456; }
      @theme inline { --color-alias: var(--color-black); }
      @theme { --color-white: #ffffff; }
      @theme { --color-later: #abcdef; }
    `;

    expect(parseColorTokens(css)).toEqual([{ name: "white", value: "#FFFFFF" }]);
  });

  it("returns an empty list when there is no @theme block", () => {
    expect(parseColorTokens("body { color: red; }")).toEqual([]);
  });
});
