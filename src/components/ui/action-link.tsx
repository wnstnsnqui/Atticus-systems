import Link from "next/link";
import { SplitLetters } from "./split-letters";

const actionClassName =
  "letter-roll inline-flex items-center gap-2 py-2 text-body font-medium text-violet transition-colors duration-(--duration-fast) ease-out-strong hover:text-violet-hover";

type ActionLinkProps = {
  readonly href: string;
  readonly children: string;
  readonly arrow?: boolean;
  readonly external?: boolean;
};

function ActionArrow() {
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
