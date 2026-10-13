"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { blockTransition, blockVariants } from "./reveal-motion";

const elements = { div: m.div, li: m.li, p: m.p } as const;

type RevealItemProps = {
  readonly children: ReactNode;
  readonly as?: keyof typeof elements;
  readonly className?: string;
};

// One staggered block. Must sit inside a RevealGroup, which drives its state.
export function RevealItem({ children, as = "div", className }: RevealItemProps) {
  const reduced = useReducedMotion() ?? false;
  const Element = elements[as];
  return (
    <Element
      data-reveal=""
      className={className}
      variants={blockVariants}
      transition={blockTransition(reduced)}
    >
      {children}
    </Element>
  );
}
