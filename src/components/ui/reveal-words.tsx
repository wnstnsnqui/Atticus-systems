"use client";

import { m, useReducedMotion } from "motion/react";
import {
  defaultHeadingSize,
  headingTags,
  headingVariants,
  type HeadingLevel,
  type HeadingSize,
} from "./heading";
import {
  revealViewport,
  wordTransition,
  wordVariants,
  wordWrapperTransition,
  wordWrapperVariants,
} from "./reveal-motion";

type RevealWordsProps = {
  readonly text: string;
  readonly level: HeadingLevel;
  readonly size?: HeadingSize;
  readonly id?: string;
};

export const splitWords = (text: string): readonly string[] => text.trim().split(/\s+/);

// A heading that reveals word by word. Screen readers get the full sentence
// once; the split words are a visual copy hidden from them.
export function RevealWords({ text, level, size, id }: RevealWordsProps) {
  const reduced = useReducedMotion() ?? false;
  const Tag = headingTags[level];
  return (
    <Tag id={id} className={headingVariants({ size: size ?? defaultHeadingSize(level) })}>
      <span className="sr-only">{text}</span>
      <m.span
        aria-hidden="true"
        data-reveal=""
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={wordWrapperVariants}
        transition={wordWrapperTransition(reduced)}
      >
        {splitWords(text).map((word, index) => (
          <span key={index}>
            {index > 0 && " "}
            <m.span
              data-reveal=""
              className="inline-block"
              variants={wordVariants}
              transition={wordTransition(reduced)}
            >
              {word}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
