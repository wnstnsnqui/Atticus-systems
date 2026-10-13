"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { reveal as revealMotion } from "@/lib/motion";

export type GlowHue = "violet" | "blue" | "cyan" | "violet-blue";
export type GlowPosition =
  "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
export type GlowSize = "sm" | "md" | "lg";

const hueClassNames: Readonly<Record<GlowHue, string>> = {
  violet: "glow-violet",
  blue: "glow-blue",
  cyan: "glow-cyan",
  "violet-blue": "glow-violet-blue",
};

// The box center sits on that edge or corner, half outside the section. The
// translate utilities set the CSS translate property, never transform.
const positionClassNames: Readonly<Record<GlowPosition, string>> = {
  top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-right": "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const sizeClassNames: Readonly<Record<GlowSize, string>> = {
  sm: "size-[min(24rem,70vw)]",
  md: "size-[min(40rem,90vw)]",
  lg: "size-[min(64rem,120vw)]",
};

type GlowProps = {
  readonly hue: GlowHue;
  readonly position: GlowPosition;
  readonly size?: GlowSize;
  /** Fade in once on first view. Pass false in the first viewport (the hero). */
  readonly reveal?: boolean;
};

// Soft decorative light behind a section's content (use it in Section's decor).
// It fades in once through an IntersectionObserver and a CSS transition, then
// stays still. Without JavaScript the noscript rule on [data-reveal] shows it.
export function Glow({ hue, position, size = "md", reveal = true }: GlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!reveal || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin: revealMotion.viewport.margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reveal]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-glow={hue}
      data-reveal={reveal ? "" : undefined}
      data-in={reveal && seen ? "" : undefined}
      className={clsx(
        "pointer-events-none absolute z-1 forced-colors:hidden",
        hueClassNames[hue],
        positionClassNames[position],
        sizeClassNames[size],
        reveal &&
          "opacity-0 transition-opacity duration-(--duration-glow) ease-out-strong data-in:opacity-100 motion-reduce:duration-(--duration-fast)",
      )}
    />
  );
}
