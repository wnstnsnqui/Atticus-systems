"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { ArrowUpRight } from "./arrow-up-right";

export type ButtonVariant = "primary" | "secondary";
type ButtonState = "rest" | "pending" | "disabled";

export const buttonVariants = cva(
  [
    "relative inline-flex min-h-12 items-center justify-center gap-2 rounded-control border px-6",
    "text-body font-medium transition-[background-color,translate,scale]",
    "duration-(--duration-fast) ease-out-strong forced-colors:border-[CanvasText]",
  ],
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
      },
      // Pending keeps the variant's colors; disabled swaps them for muted ones.
      state: {
        rest: "cursor-pointer motion-safe:hover:-translate-y-px motion-safe:active:scale-97",
        pending: "cursor-default",
        disabled: "cursor-not-allowed border-field-line bg-raised text-muted shadow-control",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        state: ["rest", "pending"],
        className:
          "border-border bg-button text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.5),var(--shadow-control)]",
      },
      { variant: "primary", state: "rest", className: "hover:bg-button-hover" },
      {
        variant: "secondary",
        state: ["rest", "pending"],
        className: "border-field-line bg-raised text-heading shadow-control",
      },
      { variant: "secondary", state: "rest", className: "hover:bg-overlay" },
    ],
  },
);

const arrowColor: Readonly<Record<ButtonVariant, string>> = {
  primary: "text-violet-deep",
  secondary: "text-heading",
};

type ButtonProps = Omit<BaseButton.Props, "children" | "className"> & {
  readonly children: string;
  readonly variant?: ButtonVariant;
  readonly pending?: boolean;
  /** Shown while pending. Falls back to the normal label. */
  readonly pendingLabel?: string;
  readonly arrow?: boolean;
  /** Applied to the wrapper, for layout. */
  readonly className?: string;
};

const buttonState = (pending: boolean, disabled: boolean): ButtonState =>
  pending ? "pending" : disabled ? "disabled" : "rest";

// While pending the button stays focusable but announces itself as disabled
// and ignores click and Enter, so a form cannot submit twice. The wrapper is
// the hover group: it holds the primary hover halo behind the button.
export function Button({
  children,
  variant = "primary",
  pending = false,
  pendingLabel,
  arrow = false,
  type = "button",
  disabled = false,
  className,
  ...rest
}: ButtonProps) {
  const state = buttonState(pending, Boolean(disabled));
  return (
    <span className={clsx("group/button relative inline-flex", className)}>
      {variant === "primary" && state === "rest" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 glow-halo opacity-0 transition-opacity duration-(--duration-reveal) ease-out-strong group-hover/button:opacity-100 motion-reduce:transition-none forced-colors:hidden"
        />
      )}
      <BaseButton
        {...rest}
        type={type}
        disabled={pending || disabled}
        focusableWhenDisabled={pending}
        className={buttonVariants({ variant, state })}
      >
        {pending ? (pendingLabel ?? children) : children}
        {arrow && (
          <span
            aria-hidden="true"
            className={clsx(
              "inline-flex transition-[translate] duration-(--duration-fast) ease-out-strong",
              state === "disabled" ? "text-muted" : arrowColor[variant],
              state === "rest" &&
                "motion-safe:group-hover/button:translate-x-0.5 motion-safe:group-hover/button:-translate-y-0.5",
            )}
          >
            <ArrowUpRight />
          </span>
        )}
      </BaseButton>
    </span>
  );
}
