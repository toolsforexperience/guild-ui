import type { ReactNode } from "react";
import { CornerKnot } from "../ornaments";

interface CharterProps {
  children: ReactNode;
  className?: string;
  /** Show knotwork corner ornaments. Default true — reserve for "document" pages. */
  ornate?: boolean;
  /** Color of the knotwork — defaults to rubric red, can be gilt or muted ink */
  ornamentTone?: "rubric" | "gilt" | "ink";
}

/**
 * Page-level wrapper that turns the canvas into a parchment charter:
 * cream substrate, procedural grain + foxing stains, edge vignette,
 * and (optionally) Celtic knotwork corner ornaments.
 *
 * Use for ceremonial pages (proposals, certifications, charters of record).
 * Regular pages should keep the lighter `<PageContainer />` and rely on the
 * subtle body-level texture only.
 */
export function Charter({
  children,
  className = "",
  ornate = true,
  ornamentTone = "rubric",
}: CharterProps) {
  const toneClass =
    ornamentTone === "gilt"
      ? "text-gilt"
      : ornamentTone === "ink"
        ? "text-ink-brown/40"
        : "text-rubric";

  return (
    <div className={`relative mx-auto max-w-5xl my-10 fade-in ${className}`}>
      {/* Paper layer — carries the deckle-edge filter, background, textures,
          and shadow. Content sits in a sibling div above so text stays crisp. */}
      <div
        className="parchment-surface absolute inset-0"
        style={{
          filter: [
            "url(#parchment-deckle)",
            // Ambient occlusion — tight, all-around, hugs the deckled outline
            "drop-shadow(0 1px 1.5px rgba(40, 25, 10, 0.32))",
            // Directional drop — offset down-right, defined
            "drop-shadow(8px 10px 14px rgba(40, 25, 10, 0.32))",
          ].join(" "),
        }}
        aria-hidden
      >
        <div className="parchment-stains absolute inset-0 pointer-events-none" />
        <div className="parchment-fibre absolute inset-0 pointer-events-none" />
        <div className="parchment-grain absolute inset-0 pointer-events-none" />
        <div className="parchment-vignette absolute inset-0 pointer-events-none" />
      </div>

      {/* Content layer — sharp, above paper */}
      <div className="relative px-12 py-16">
        {ornate && (
          <>
            <CornerKnot
              className={`absolute top-3 left-3 ${toneClass}`}
              size={64}
            />
            <CornerKnot
              className={`absolute top-3 right-3 ${toneClass}`}
              size={64}
              style={{ transform: "scaleX(-1)" }}
            />
            <CornerKnot
              className={`absolute bottom-3 left-3 ${toneClass}`}
              size={64}
              style={{ transform: "scaleY(-1)" }}
            />
            <CornerKnot
              className={`absolute bottom-3 right-3 ${toneClass}`}
              size={64}
              style={{ transform: "scale(-1, -1)" }}
            />
          </>
        )}
        {children}
      </div>
    </div>
  );
}
