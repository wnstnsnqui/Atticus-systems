import type { ReactNode } from "react";

export type SectionTone = "base" | "void";

type SectionProps = {
  readonly id: string;
  readonly labelledBy?: string;
  /** `void` is the hero's pure black, fading into base over its last 200px. */
  readonly tone?: SectionTone;
  /** Glows, painted behind the content. */
  readonly decor?: ReactNode;
  readonly children: ReactNode;
};

// An in page anchor target: nav and footer links scroll here, landing below the nav.
// Isolated and clipped, so glows stay behind the content and never scroll sideways.
export function Section({ id, labelledBy, tone = "base", decor, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className="relative isolate scroll-mt-anchor overflow-clip py-section texture-dots"
    >
      {decor}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
