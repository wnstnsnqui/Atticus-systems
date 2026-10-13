type StatusIndicatorProps = {
  readonly children: string;
};

// The text carries the meaning; the amber dot and its halo are decoration.
// Under reduced motion the halo is hidden, leaving a static dot.
export function StatusIndicator({ children }: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-label text-gray uppercase">
      <span
        aria-hidden="true"
        className="relative inline-block size-2 shrink-0 rounded-full bg-amber after:absolute after:inset-0 after:animate-status-pulse after:rounded-full after:bg-amber motion-reduce:after:hidden"
      />
      {children}
    </span>
  );
}
