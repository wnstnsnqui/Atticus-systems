"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { groupTransition, revealViewport } from "./reveal-motion";

const elements = { div: m.div, ul: m.ul, ol: m.ol } as const;

// The group itself never hides; it only names the states its items inherit.
const groupVariants = { hidden: {}, visible: {} };

type RevealGroupProps = {
  readonly children: ReactNode;
  readonly as?: keyof typeof elements;
  readonly className?: string;
};

// Reveals its RevealItem children one after another, 60ms apart.
export function RevealGroup({ children, as = "div", className }: RevealGroupProps) {
  const reduced = useReducedMotion() ?? false;
  const Element = elements[as];
  return (
    <Element
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={groupVariants}
      transition={groupTransition(reduced)}
    >
      {children}
    </Element>
  );
}
