import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gold" | "amber" | "ghost";
  hoverable?: boolean;
}

/**
 * Cartouche-style panel: deckled parchment paper layer with a tone-matched
 * border, an inner gilt hairline, and a soft directional drop shadow so the
 * sheet lifts subtly off the page. Content sits in a sibling layer above the
 * deckled box so text/inputs stay crisp.
 *
 * Used app-wide as the default container. For ceremonial pages, prefer the
 * full <Cartouche /> which adds CornerKnot ornaments.
 */
export function Card({
  children,
  className = "",
  variant = "default",
  hoverable = false,
}: CardProps) {
  const styles = {
    default: {
      border: "border-gilt/55",
      ring: "var(--color-card-ring)",
      bg: "var(--color-card-surface)",
    },
    gold: {
      border: "border-gilt/70",
      ring: "var(--color-card-ring-strong)",
      bg: "var(--color-card-surface-gold)",
    },
    amber: {
      border: "border-rubric/50",
      ring: "var(--color-card-ring-rubric)",
      bg: "var(--color-card-surface-amber)",
    },
    ghost: {
      border: "border-ink-brown/20",
      ring: "var(--color-card-ring-ink)",
      bg: "var(--color-card-surface-ghost)",
    },
  } as const;

  const v = styles[variant];

  const hoverClasses = hoverable
    ? "group [&>[data-paper]]:transition-[filter,box-shadow] hover:[&>[data-paper]]:[filter:url(#parchment-deckle-card)_drop-shadow(0_1px_1px_rgba(40,25,10,0.14))_drop-shadow(3px_5px_8px_rgba(40,25,10,0.14))]"
    : "";

  return (
    <div className={`relative ${hoverClasses} ${className}`}>
      <div
        data-paper
        className={`absolute inset-0 border ${v.border}`}
        style={{
          backgroundColor: v.bg,
          filter: [
            "url(#parchment-deckle-card)",
            "drop-shadow(0 1px 1px rgba(40, 25, 10, 0.1))",
            "drop-shadow(2px 3px 5px rgba(40, 25, 10, 0.08))",
          ].join(" "),
          boxShadow: `inset 0 0 0 1px ${v.ring}`,
        }}
        aria-hidden
      />
      <div className="relative px-8 py-7">{children}</div>
    </div>
  );
}
