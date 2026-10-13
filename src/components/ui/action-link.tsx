import Link from "next/link";
import { SplitLetters } from "./split-letters";

// Shared with Button so links and buttons read as one family.
export const actionClassName =
  "letter-roll inline-flex items-center gap-2 py-2 text-body font-medium text-amber";

type ActionLinkProps = {
  readonly href: string;
  readonly children: string;
  readonly arrow?: boolean;
  readonly external?: boolean;
};

export function ActionArrow() {
  return (
    <span aria-hidden="true" className="letter-roll-arrow inline-block">
      →
    </span>
  );
}

export function ActionLink({ href, children, arrow = false, external = false }: ActionLinkProps) {
  const content = (
    <>
      <SplitLetters>{children}</SplitLetters>
      {arrow && <ActionArrow />}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={actionClassName}>
      {content}
    </a>
  ) : (
    <Link href={href} className={actionClassName}>
      {content}
    </Link>
  );
}
