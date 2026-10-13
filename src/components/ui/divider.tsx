import { clsx } from "clsx";

type DividerProps = {
  readonly className?: string;
};

// Decorative hairline that fades out at both ends. Never the only cue that
// separates two things.
export function Divider({ className }: DividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={clsx(
        "h-px border-0 bg-linear-to-r from-transparent via-hairline to-transparent",
        className,
      )}
    />
  );
}
