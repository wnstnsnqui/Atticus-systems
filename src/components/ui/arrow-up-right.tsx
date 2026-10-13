type ArrowUpRightProps = {
  readonly className?: string;
};

// 16px decorative arrow, drawn in the current text color.
export function ArrowUpRight({ className }: ArrowUpRightProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}
