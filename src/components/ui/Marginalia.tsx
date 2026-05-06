import type { ReactNode } from "react";

interface MarginaliaProps {
  children: ReactNode;
  className?: string;
  /** Side the bracket sits on — defaults to left. */
  side?: "left" | "right";
}

/**
 * A small italic side-note in the manuscript style: bracketed by a thin
 * rubric-red rule. Inline by default; works as marginal commentary,
 * inline footnote, or contextual hint.
 */
export function Marginalia({
  children,
  className = "",
  side = "left",
}: MarginaliaProps) {
  const borderClass =
    side === "left"
      ? "border-l-2 pl-3"
      : "border-r-2 pr-3 text-right";
  return (
    <aside
      className={`font-insular italic text-ink-brown/70 text-sm ${borderClass} border-rubric/50 ${className}`}
    >
      {children}
    </aside>
  );
}
