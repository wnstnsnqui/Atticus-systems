import { describe, expect, it } from "vitest";
import {
  blockTransition,
  blockVariants,
  groupTransition,
  noscriptRevealStyle,
  wordTransition,
  wordVariants,
  wordWrapperTransition,
} from "./reveal-motion";

describe("reveal variants", () => {
  it("hide blocks 16px low and words 0.3em low, and always include y", () => {
    expect(blockVariants.hidden).toEqual({ opacity: 0, y: 16 });
    expect(wordVariants.hidden).toEqual({ opacity: 0, y: "0.3em" });
  });

  it("animate only opacity and transform", () => {
    const animated = [blockVariants, wordVariants].flatMap((variants) =>
      Object.values(variants).flatMap((target) => Object.keys(target as object)),
    );

    expect(new Set(animated)).toEqual(new Set(["opacity", "y"]));
  });
});

describe("full motion transitions", () => {
  it("reveal blocks over 600ms with the shared ease out and an optional delay", () => {
    expect(blockTransition(false, 120)).toEqual({
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
      delay: 0.12,
    });
  });

  it("stagger group items by 60ms and heading words by 40ms", () => {
    expect(groupTransition(false)).toEqual({ staggerChildren: 0.06 });
    expect(wordWrapperTransition(false)).toMatchObject({ staggerChildren: 0.04 });
    expect(wordTransition(false)).toMatchObject({ duration: 0.6 });
  });
});

describe("reduced motion transitions", () => {
  it("fade blocks over 150ms with no movement and no delay", () => {
    const transition = blockTransition(true, 120);

    expect(transition).toEqual({
      opacity: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
      y: { duration: 0 },
    });
  });

  it("drop every stagger", () => {
    expect(groupTransition(true)).toEqual({ staggerChildren: 0 });
    expect(wordWrapperTransition(true)).toMatchObject({ staggerChildren: 0 });
  });

  it("fade the heading as one block while its words snap into place", () => {
    expect(wordWrapperTransition(true)).toMatchObject({ opacity: { duration: 0.15 } });
    expect(wordTransition(true)).toEqual({ duration: 0 });
  });
});

describe("noscript fallback", () => {
  it("forces every reveal target visible and in place", () => {
    expect(noscriptRevealStyle).toBe("[data-reveal]{opacity:1!important;transform:none!important}");
  });
});
