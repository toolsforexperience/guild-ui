import type { ReactNode } from "react";
import { CornerKnot } from "../ornaments";

interface CartoucheProps {
  children: ReactNode;
  className?: string;
  /** Border tone — gilt for treasured items, rubric for emphasized, ink for muted. */
  tone?: "gilt" | "rubric" | "ink";
  /** Hide the corner knots for a cleaner panel that still uses the gilt border. */
  bare?: boolean;
}

/**
 * Knotwork-bordered card variant. A thin gilt (or rubric) border with small
 * Celtic knot ornaments in the corners. Use sparingly — one or two per page.
 */
export function Cartouche({
  children,
  className = "",
  tone = "gilt",
  bare = false,
}: CartoucheProps) {
  const borderColor =
    tone === "rubric"
      ? "border-rubric/60"
      : tone === "ink"
        ? "border-ink-brown/30"
        : "border-gilt/70";
  const knotColor =
    tone === "rubric"
      ? "text-rubric/80"
      : tone === "ink"
        ? "text-ink-brown/60"
        : "text-gilt";

  return (
    <div className={`relative ${className}`}>
      {/* Paper layer — deckled background + border. Content above stays crisp. */}
      <div
        className={`absolute inset-0 border ${borderColor}`}
        style={{
          backgroundColor: "#fdf7e8",
          filter: [
            "url(#parchment-deckle-sm)",
            // Ambient ring around the deckled edge
            "drop-shadow(0 1px 1px rgba(40, 25, 10, 0.25))",
            // Smaller directional drop (boxes lift less off the surface)
            "drop-shadow(4px 6px 8px rgba(40, 25, 10, 0.22))",
          ].join(" "),
          boxShadow: "inset 0 0 0 1px rgba(184, 137, 58, 0.15)",
        }}
        aria-hidden
      />

      {!bare && (
        <>
          <CornerKnot
            className={`absolute -top-2 -left-2 ${knotColor}`}
            size={28}
          />
          <CornerKnot
            className={`absolute -top-2 -right-2 ${knotColor}`}
            size={28}
            style={{ transform: "scaleX(-1)" }}
          />
          <CornerKnot
            className={`absolute -bottom-2 -left-2 ${knotColor}`}
            size={28}
            style={{ transform: "scaleY(-1)" }}
          />
          <CornerKnot
            className={`absolute -bottom-2 -right-2 ${knotColor}`}
            size={28}
            style={{ transform: "scale(-1, -1)" }}
          />
        </>
      )}

      {/* Content sits above the deckled paper layer */}
      <div className="relative px-8 py-7">{children}</div>
    </div>
  );
}
