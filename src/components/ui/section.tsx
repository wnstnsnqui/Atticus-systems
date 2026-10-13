import type { ReactNode } from "react";

type SectionProps = {
  readonly id: string;
  readonly labelledBy?: string;
  readonly children: ReactNode;
};

// An in page anchor target: nav and footer links scroll here, landing below the nav.
export function Section({ id, labelledBy, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-anchor py-section">
      {children}
    </section>
  );
}
