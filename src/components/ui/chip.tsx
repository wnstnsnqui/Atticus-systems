type ChipProps = {
  readonly children: string;
};

// A mono tag, such as a tech label. Not uppercased.
export function Chip({ children }: ChipProps) {
  return (
    <span className="inline-flex rounded-chip bg-overlay px-2 py-1 font-mono text-label text-copy">
      {children}
    </span>
  );
}
