export type ColorToken = {
  readonly name: string;
  readonly value: string;
};

// The opening of the first `@theme { ... }` block, skipping `@theme inline`.
const themeOpening = /@theme\s*\{/;
const colorDeclaration = /--color-([a-z][a-z0-9-]*)\s*:\s*(#[0-9a-f]{3,8})\s*;/gi;

// Index just past the brace that closes the block opened before `start`.
// Balanced, so nested blocks such as `@keyframes` stay inside the theme.
const blockEnd = (css: string, start: number, depth = 1): number => {
  const next = css.slice(start).search(/[{}]/);
  if (next === -1) return css.length;
  const at = start + next;
  const nextDepth = css[at] === "{" ? depth + 1 : depth - 1;
  return nextDepth === 0 ? at : blockEnd(css, at + 1, nextDepth);
};

const firstThemeBlock = (css: string): string => {
  const opening = themeOpening.exec(css);
  if (!opening) return "";
  const start = opening.index + opening[0].length;
  return css.slice(start, blockEnd(css, start));
};

// Reads the color tokens from globals.css, in source order. Wildcard resets
// such as `--color-*: initial` are ignored.
export const parseColorTokens = (css: string): readonly ColorToken[] =>
  Array.from(firstThemeBlock(css).matchAll(colorDeclaration), ([, name = "", value = ""]) => ({
    name,
    value: value.toUpperCase(),
  }));
