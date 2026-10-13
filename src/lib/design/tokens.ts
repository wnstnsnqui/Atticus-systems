export type ColorToken = {
  readonly name: string;
  readonly value: string;
};

// The first `@theme { ... }` block, skipping `@theme inline` and other modifiers.
const themeBlock = /@theme\s*\{([^}]*)\}/;
const colorDeclaration = /--color-([a-z][a-z0-9-]*)\s*:\s*(#[0-9a-f]{3,8})\s*;/gi;

// Reads the color tokens from globals.css, in source order. Wildcard resets
// such as `--color-*: initial` are ignored.
export const parseColorTokens = (css: string): readonly ColorToken[] => {
  const block = themeBlock.exec(css)?.[1] ?? "";
  return Array.from(block.matchAll(colorDeclaration), ([, name = "", value = ""]) => ({
    name,
    value: value.toUpperCase(),
  }));
};
