import { clsx } from "clsx";
import type { ReactNode } from "react";

type CardProps = {
  readonly children: ReactNode;
  readonly as?: "div" | "article" | "li";
  /** A soft violet halo behind the card on hover and focus within. */
  readonly glow?: boolean;
  readonly className?: string;
};

export const cardSurfaceClassName =
  "relative rounded-card border border-border bg-raised p-6 sm:p-8 forced-colors:border-[CanvasText]";

// A raised obsidian surface. Its solid fill covers the section's dot texture.
// With glow, the halo is a sibling painted before the surface, so it never
// tints the fill or covers text, including a neighboring card's.
export function Card({ children, as: Tag = "div", glow = false, className }: CardProps) {
  if (!glow) return <Tag className={clsx(cardSurfaceClassName, className)}>{children}</Tag>;

  return (
    <Tag className={clsx("group/card relative", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 glow-halo opacity-0 transition-opacity duration-(--duration-reveal) ease-out-strong group-focus-within/card:opacity-100 group-hover/card:opacity-100 motion-reduce:transition-none forced-colors:hidden"
      />
      <div className={clsx(cardSurfaceClassName, "h-full")}>{children}</div>
    </Tag>
  );
}
