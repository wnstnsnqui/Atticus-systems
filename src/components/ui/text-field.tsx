"use client";

import { Field } from "@base-ui/react/field";
import { clsx } from "clsx";

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

// Rounded and filled. Focus turns the border violet and adds the violet ring at
// a 2px offset; an error keeps the border red at rest and under focus.
const controlClassName = [
  "block w-full rounded-control border border-field-line bg-raised px-4",
  "text-body text-heading caret-violet",
  "transition-colors duration-(--duration-fast) ease-out-strong",
  "not-data-invalid:focus:border-violet focus-visible:outline-offset-2",
  "data-invalid:border-red",
  "data-disabled:cursor-not-allowed data-disabled:text-muted",
  "forced-colors:border-[CanvasText]",
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
        className={clsx(controlClassName, multiline ? "min-h-32 resize-y py-3" : "min-h-12")}
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
