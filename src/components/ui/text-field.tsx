"use client";

import { Field } from "@base-ui/react/field";

type TextFieldProps = Omit<
  Field.Control.Props,
  "name" | "placeholder" | "render" | "className" | "children"
> & {
  readonly name: string;
  readonly label: string;
  readonly multiline?: boolean;
  /** Server side message for this field. Rendered as text, never as HTML. */
  readonly error?: string;
  readonly description?: string;
};

// The underline is the focus indicator, so the control drops the outline ring.
// It thickens from 1px to 2px on focus while the padding gives back 1px, so
// nothing below it moves.
const controlClassName = [
  "block w-full rounded-none border-0 border-b border-field-line bg-transparent pt-2 pb-3",
  "text-body-lg text-heading caret-violet",
  "transition-colors duration-(--duration-fast) ease-out-strong",
  "focus:border-b-2 focus:border-violet focus:pb-[calc(0.75rem-1px)] focus-visible:outline-none",
  "data-invalid:border-red",
].join(" ");

export function TextField({
  name,
  label,
  multiline = false,
  error,
  description,
  ...controlProps
}: TextFieldProps) {
  return (
    <Field.Root name={name} invalid={Boolean(error)} className="flex flex-col gap-2">
      <Field.Label className="mono-label text-muted">{label}</Field.Label>
      <Field.Control
        {...controlProps}
        render={multiline ? <textarea rows={4} /> : undefined}
        className={multiline ? `${controlClassName} min-h-32 resize-y` : controlClassName}
      />
      {description && (
        <Field.Description className="text-small text-muted">{description}</Field.Description>
      )}
      <Field.Error match={Boolean(error)} className="mt-1 font-mono text-label text-red">
        <span aria-hidden="true">ERR {"//"} </span>
        <span className="sr-only">Error: </span>
        {error}
      </Field.Error>
    </Field.Root>
  );
}
