"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { blockTransition, blockVariants, revealViewport } from "./reveal-motion";

const elements = { div: m.div, p: m.p, li: m.li } as const;

type RevealProps = {
  readonly children: ReactNode;
  readonly as?: keyof typeof elements;
  /** Extra delay in milliseconds. Dropped under reduced motion. */
  readonly delay?: number;
  readonly className?: string;
};

// Fades a block in while it rises, once, the first time it scrolls into view.
// Never wrap content that is visible in the first viewport on load.
export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Element = elements[as];
  return (
    <Element
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={blockVariants}
      transition={blockTransition(reduced, delay)}
    >
      {children}
    </Element>
  );
}
