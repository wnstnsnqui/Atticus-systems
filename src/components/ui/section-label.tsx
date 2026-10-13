type SectionLabelProps = {
  readonly index: number;
  readonly children: string;
};

export const formatSectionIndex = (index: number): string => String(index).padStart(2, "0");

// Renders `01 // SERVICES`. The label is uppercased in CSS, so screen readers
// read the source case instead of spelling out capitals.
export function SectionLabel({ index, children }: SectionLabelProps) {
  return (
    <p className="font-mono text-label text-gray uppercase">
      {formatSectionIndex(index)} {"//"} {children}
    </p>
  );
}
