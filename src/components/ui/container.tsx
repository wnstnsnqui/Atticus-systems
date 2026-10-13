import { clsx } from "clsx";
import type { ReactNode } from "react";

type ContainerProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

// 1280px outer width with fluid gutters on both sides.
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-content px-gutter", className)}>{children}</div>
  );
}
