import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3;
export type HeadingSize = "display" | "h1" | "h2" | "h3";

export const headingVariants = cva("text-white", {
  variants: {
    size: {
      display: "text-display",
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
    },
  },
});

// Size and level are separate so the document outline stays correct whatever
// the visual size. Display is only ever an explicit opt in.
export const defaultHeadingSize = (level: HeadingLevel): HeadingSize => `h${level}`;

export const headingTags = { 1: "h1", 2: "h2", 3: "h3" } as const;

type HeadingProps = {
  readonly level: HeadingLevel;
  readonly size?: HeadingSize;
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
};

export function Heading({ level, size, id, className, children }: HeadingProps) {
  const Tag = headingTags[level];
  return (
    <Tag
      id={id}
      className={clsx(headingVariants({ size: size ?? defaultHeadingSize(level) }), className)}
    >
      {children}
    </Tag>
  );
}
