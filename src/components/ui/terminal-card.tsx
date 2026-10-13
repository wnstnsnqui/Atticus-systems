import type { ReactNode } from "react";
import { Card } from "./card";

type TerminalCardProps = {
  readonly title: string;
  readonly children: ReactNode;
};

// A Card with a window bar. The three dots are decoration; the title and the
// mono body are real text.
export function TerminalCard({ title, children }: TerminalCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-overlay" />
          <span className="size-2 rounded-full bg-overlay" />
          <span className="size-2 rounded-full bg-overlay" />
        </span>
        <p className="mono-label text-muted">{title}</p>
      </div>
      <div className="mt-6 font-mono text-small whitespace-pre-wrap text-copy">{children}</div>
    </Card>
  );
}
