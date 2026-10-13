"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
import { useId } from "react";
import { ActionArrow, actionClassName } from "./action-link";
import { SplitLetters } from "./split-letters";

type ButtonProps = Omit<BaseButton.Props, "children" | "className"> & {
  readonly children: string;
  readonly pending?: boolean;
  /** Shown while pending. Falls back to the normal label. */
  readonly pendingLabel?: string;
  readonly arrow?: boolean;
  readonly className?: string;
};

// While pending the button stays focusable but announces itself as disabled
// and ignores click and Enter, so a form cannot submit twice. The label is the
// explicit accessible name, so the change to pendingLabel is announced.
export function Button({
  children,
  pending = false,
  pendingLabel,
  arrow = false,
  type = "button",
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const labelId = useId();
  return (
    <BaseButton
      {...rest}
      type={type}
      disabled={pending || disabled}
      focusableWhenDisabled={pending}
      aria-labelledby={labelId}
      className={clsx(actionClassName, "cursor-pointer data-disabled:cursor-default", className)}
    >
      {pending ? (
        <span id={labelId} className="leading-[1.3]">
          {pendingLabel ?? children}
        </span>
      ) : (
        <SplitLetters labelId={labelId}>{children}</SplitLetters>
      )}
      {arrow && <ActionArrow />}
    </BaseButton>
  );
}
