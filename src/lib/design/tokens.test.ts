import { describe, expect, it } from "vitest";
import { parseColorTokens } from "./tokens";

describe("parseColorTokens", () => {
  it("reads colors from the first @theme block in source order, uppercased", () => {
    const css = `
      @import "tailwindcss";
      @theme {
        --color-*: initial;
        --color-void: #000000;
        --color-field-line: #666;
        --text-h1: 4rem;
      }
    `;

    expect(parseColorTokens(css)).toEqual([
      { name: "void", value: "#000000" },
      { name: "field-line", value: "#666" },
    ]);
  });

  it("ignores @theme inline blocks and colors outside the theme", () => {
    const css = `
      :root { --color-stray: #123456; }
      @theme inline { --color-alias: var(--color-void); }
      @theme { --color-heading: #ffffff; }
      @theme { --color-later: #abcdef; }
    `;

    expect(parseColorTokens(css)).toEqual([{ name: "heading", value: "#FFFFFF" }]);
  });

  it("keeps reading past nested blocks such as @keyframes", () => {
    const css = `
      @theme {
        --color-void: #000000;
        @keyframes pulse { from { opacity: 1; } to { opacity: 0; } }
        --color-violet: #a99bff;
      }
      @theme { --color-later: #abcdef; }
    `;

    expect(parseColorTokens(css).map(({ name }) => name)).toEqual(["void", "violet"]);
  });

  it("returns an empty list when there is no @theme block", () => {
    expect(parseColorTokens("body { color: red; }")).toEqual([]);
  });
});
