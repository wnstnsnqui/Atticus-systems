import { clsx } from "clsx";

type DividerProps = {
  readonly className?: string;
};

// Decorative hairline. Never the only cue that separates two things.
export function Divider({ className }: DividerProps) {
  return <hr aria-hidden="true" className={clsx("border-0 border-t border-hairline", className)} />;
}
