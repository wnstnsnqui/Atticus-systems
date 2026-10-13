import type { CSSProperties } from "react";

type SplitLettersProps = {
  readonly children: string;
  /** Id for the readable label, so a parent can point aria-labelledby at it. */
  readonly labelId?: string;
};

// Shared by server and client components (no hooks, no "use client"). Screen
// readers get the label once as normal text; the per letter copy is visual only.
// Short CTA labels only: it renders one span per letter.
export function SplitLetters({ children, labelId }: SplitLettersProps) {
  return (
    <>
      <span id={labelId} className="sr-only">
        {children}
      </span>
      <span aria-hidden="true" className="inline-flex leading-[1.3]">
        {Array.from(children, (char, index) => (
          <span key={index} className="letter-roll-clip">
            <span
              className="letter-roll-char"
              data-char={char}
              style={{ "--i": index } as CSSProperties}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
