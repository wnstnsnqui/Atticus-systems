import type { Transition, Variants } from "motion/react";
import { duration, ease, reveal, stagger, toSeconds } from "@/lib/motion";

// Shared by Reveal, RevealGroup, RevealItem, and RevealWords. Hidden variants
// never change with the reduced motion setting (the server cannot know it, and
// the first client render must match); only the transitions do.

const easeOut: [number, number, number, number] = [...ease.out];

// Without JavaScript, Motion's inline initial styles would hide reveal content
// forever. The root layout puts this inside <noscript>.
export const noscriptRevealStyle = "[data-reveal]{opacity:1!important;transform:none!important}";

export const revealViewport = reveal.viewport;

export const blockVariants: Variants = {
  hidden: { opacity: 0, y: reveal.distance },
  visible: { opacity: 1, y: 0 },
};

export const wordVariants: Variants = {
  hidden: { opacity: 0, y: reveal.wordDistance },
  visible: { opacity: 1, y: 0 },
};

// The word wrapper only exists so reduced motion can fade the heading as one block.
export const wordWrapperVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const reducedFade: Transition = {
  opacity: { duration: toSeconds(duration.fast), ease: easeOut },
  y: { duration: 0 },
};

export const blockTransition = (reduced: boolean, delayMs = 0): Transition =>
  reduced
    ? reducedFade
    : { duration: toSeconds(duration.reveal), ease: easeOut, delay: toSeconds(delayMs) };

export const groupTransition = (reduced: boolean): Transition => ({
  staggerChildren: reduced ? 0 : toSeconds(stagger.children),
});

export const wordWrapperTransition = (reduced: boolean): Transition =>
  reduced
    ? { ...reducedFade, staggerChildren: 0 }
    : { opacity: { duration: 0 }, staggerChildren: toSeconds(stagger.words) };

export const wordTransition = (reduced: boolean): Transition =>
  reduced ? { duration: 0 } : { duration: toSeconds(duration.reveal), ease: easeOut };
