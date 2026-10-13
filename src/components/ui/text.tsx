import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      base: "text-body",
      sm: "text-small",
    },
    tone: {
      body: "text-gray",
      muted: "text-muted",
      strong: "text-white",
    },
  },
  defaultVariants: { size: "base", tone: "body" },
});

type TextProps = VariantProps<typeof textVariants> & {
  readonly as?: "p" | "span" | "li";
  readonly className?: string;
  readonly children: ReactNode;
};

export function Text({ size, tone, as: Tag = "p", className, children }: TextProps) {
  return <Tag className={clsx(textVariants({ size, tone }), className)}>{children}</Tag>;
}
