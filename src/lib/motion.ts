// Motion values for JavaScript (Motion for React). Durations and staggers are
// milliseconds; Motion takes seconds, so convert with toSeconds. The values the
// CSS also needs are mirrored in globals.css, and motion.test.ts keeps both in sync.

export type CubicBezier = readonly [number, number, number, number];

export const ease = {
  out: [0.23, 1, 0.32, 1],
} as const satisfies Record<string, CubicBezier>;

export const duration = {
  fast: 150,
  roll: 250,
  reveal: 600,
  glow: 1200,
  pulse: 2400,
} as const;

export const stagger = {
  letters: 10,
  words: 40,
  children: 60,
} as const;

export const reveal = {
  distance: 16,
  wordDistance: "0.3em",
  viewport: { once: true, amount: "some", margin: "0px 0px -10% 0px" },
} as const;

export const toSeconds = (ms: number): number => ms / 1000;

export const toCubicBezier = ([x1, y1, x2, y2]: CubicBezier): string =>
  `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
