import {
  Children,
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

interface OwnProps {
  /** Render with the visible separator-rule shown (use for current-page links). */
  active?: boolean;
  /**
   * Render the styling onto the child element instead of an `<a>`. Use when
   * the link is a framework primitive like react-router's `<Link>`:
   *
   *   <ScribeLink asChild><Link to="/about">about</Link></ScribeLink>
   */
  asChild?: boolean;
  className?: string;
  children?: ReactNode;
}

type ScribeLinkProps = OwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof OwnProps>;

/**
 * Canonical link in the manuscript style: no decoration at rest, a thin
 * rubric rule appears underneath on hover (or when `active`). Color is left
 * to the consumer — combine with whatever `text-ink-*` is appropriate so the
 * link inherits its surrounding text tone.
 */
export function ScribeLink({
  active = false,
  asChild = false,
  className,
  children,
  ...rest
}: ScribeLinkProps) {
  const styles = cn(
    "no-underline border-b-[1.5px] pb-0.5 transition-colors",
    active ? "border-rubric/60" : "border-transparent hover:border-rubric/60",
    className,
  );

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement<{ className?: string }>(child)) return null;
    const childEl = child as ReactElement<{ className?: string }>;
    return cloneElement(childEl, {
      className: cn(styles, childEl.props.className),
    });
  }

  return (
    <a className={styles} {...rest}>
      {children}
    </a>
  );
}
