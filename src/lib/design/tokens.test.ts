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

  it("keeps reading past nested blocks such as @keyframes", () => {
    const css = `
      @theme {
        --color-black: #000000;
        @keyframes pulse { from { opacity: 1; } to { opacity: 0; } }
        --color-amber: #ffb000;
      }
      @theme { --color-later: #abcdef; }
    `;

    expect(parseColorTokens(css).map(({ name }) => name)).toEqual(["black", "amber"]);
  });

  it("returns an empty list when there is no @theme block", () => {
    expect(parseColorTokens("body { color: red; }")).toEqual([]);
  });
});
