"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Loads Motion's DOM features once. `strict` throws if a full `motion.*`
// component slips in, so every animated element must use `m.*`.
export function MotionProvider({ children }: { readonly children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
