import type { CSSProperties } from "react";

interface KnotDividerProps {
  className?: string;
  tone?: "rubric" | "gilt" | "ink";
  width?: number;
}

const GILT = "#b8893a";
const INK = "#3a2a18";

/**
 * Section break: same Insular interlace as `CelticDivider` — eight
 * strand crossings, gilt diamond accents, terminal rosettes, and a
 * centre medallion — but the dark ink outline pass on the strands
 * is gone. The coloured strand carries the line on its own;
 * stroke-width is bumped to keep similar perceived weight to the
 * original. Drop-in replacement for `<hr />` on ceremonial pages.
 */
export function KnotDivider({
  className = "",
  tone = "rubric",
  width = 240,
}: KnotDividerProps) {
  const toneClass =
    tone === "gilt"
      ? "text-gilt"
      : tone === "ink"
        ? "text-ink-brown/70"
        : "text-rubric/85";

  // Same 8-crossing geometry as CelticDivider — viewBox 280×40.
  const topStrand =
    "M 28 14 C 42 14, 42 26, 56 26 C 70 26, 70 14, 84 14 C 98 14, 98 26, 112 26 C 126 26, 126 14, 140 14 C 154 14, 154 26, 168 26 C 182 26, 182 14, 196 14 C 210 14, 210 26, 224 26 C 238 26, 238 14, 252 14";
  const botStrand =
    "M 28 26 C 42 26, 42 14, 56 14 C 70 14, 70 26, 84 26 C 98 26, 98 14, 112 14 C 126 14, 126 26, 140 26 C 154 26, 154 14, 168 14 C 182 14, 182 26, 196 26 C 210 26, 210 14, 224 14 C 238 14, 238 26, 252 26";
  const CROSSINGS = [42, 70, 98, 126, 154, 182, 210, 238];

  return (
    <div
      className={`flex justify-center my-8 ${toneClass} ${className}`}
      role="separator"
    >
      <svg
        viewBox="0 0 280 40"
        width={width}
        height={32}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        preserveAspectRatio="none"
        aria-hidden
        style={{ maxWidth: width } as CSSProperties}
      >
        <g filter="url(#ink-wobble)">
          {/* Single coloured-strand pass — no dark ink outline.
              Width bumped from CelticDivider's 1.9 (which sat on top
              of a 4-wide ink line) to 3 so perceived weight stays
              similar to the original now that the outline is gone. */}
          <g fill="none" stroke="currentColor">
            <path d={topStrand} strokeWidth={3} />
            <path d={botStrand} strokeWidth={3} />
          </g>

          {/* Gilt diamond accents at each strand crossing */}
          {CROSSINGS.map((cx) => (
            <g key={cx} transform={`translate(${cx} 20) rotate(45)`}>
              <rect
                x="-1.7"
                y="-1.7"
                width="3.4"
                height="3.4"
                fill={GILT}
                stroke={INK}
                strokeWidth={0.4}
              />
            </g>
          ))}

          {/* Knot-cap rosettes at the strand terminals */}
          <g transform="translate(28 14)">
            <circle r="2.4" fill={GILT} stroke={INK} strokeWidth={0.6} />
          </g>
          <g transform="translate(252 14)">
            <circle r="2.4" fill={GILT} stroke={INK} strokeWidth={0.6} />
          </g>

          {/* Centre focal medallion — sits over the strands at midpoint */}
          <g transform="translate(140 20)">
            <circle r="5.2" fill="none" stroke={INK} strokeWidth={1.6} />
            <circle r="3.6" fill="none" stroke={GILT} strokeWidth={0.7} />
            <circle r="1.5" fill={GILT} stroke={INK} strokeWidth={0.4} />
          </g>
        </g>
      </svg>
    </div>
  );
}
