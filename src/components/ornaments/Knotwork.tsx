import type { SVGProps } from "react";

/**
 * Celtic-style knotwork rendered with the medieval double-stroke technique:
 * each strand is drawn twice — once thick in dark ink as an outline, once
 * thinner in red on top. Combined with spiral terminals and small gilt
 * accents at crossings, this produces a much more authentic illuminated-
 * manuscript feel than plain stroked paths.
 *
 * Colors come from the theme palette; override via props if needed.
 */

const INK = "#3a2a18"; // dark outline
const STRAND = "#9a1f1a"; // rubric red
const GILT = "#b8893a"; // gold accents
const TINT = "rgba(58, 42, 24, 0.06)"; // subtle background block

interface KnotworkColors {
  ink?: string;
  strand?: string;
  gilt?: string;
  tint?: string;
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number } & KnotworkColors;

/* ---------------------------------------------------------------- */
/* CornerKnot                                                       */
/* ---------------------------------------------------------------- */

/**
 * Insular-style corner ornament: a double-rule L-bracket framing a small
 * triquetra. The outer rule is the heavy ink line, the inner is a fine
 * gilt rule running concentrically inside it; the triquetra (Celtic
 * trinity knot) sits inside the elbow as the focal motif. Designed to
 * be mirrored to all four corners.
 */
export function CornerKnot({
  size = 72,
  ink = INK,
  strand = STRAND,
  gilt = GILT,
  ...rest
}: IconProps) {
  // L-bracket: arms run from (52,8) along top, curve concentrically at
  // (20,20), then down along left to (8,52). Bend faces page corner.
  const outerL = "M 52 8 L 20 8 A 12 12 0 0 0 8 20 L 8 52";
  const innerL = "M 52 14 L 20 14 A 6 6 0 0 0 14 20 L 14 52";
  // Triquetra (three vesicas meeting at 120°) — the canonical Insular knot.
  const triquetra =
    "M 0 -9 C 4.5 -9 8.5 -5.5 7.8 0 C 7.2 4.6 3 6 0 4.5 C -3 6 -7.2 4.6 -7.8 0 C -8.5 -5.5 -4.5 -9 0 -9 Z";

  return (
    <svg
      viewBox="0 0 72 72"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        {/* Outer L — double stroke (ink outline + red strand fill) */}
        <path d={outerL} stroke={ink} strokeWidth={4.4} />
        <path d={outerL} stroke={strand} strokeWidth={2} />
        {/* Inner concentric gilt rule */}
        <path d={innerL} stroke={gilt} strokeWidth={1.1} opacity={0.85} />

        {/* Triquetra in the elbow */}
        <g transform="translate(34 34)">
          <path d={triquetra} stroke={ink} strokeWidth={2.8} />
          <path d={triquetra} stroke={strand} strokeWidth={1.3} />
          <circle r="2.2" fill={gilt} stroke={ink} strokeWidth={0.5} />
        </g>

        {/* Trefoil finials at the open ends of the bracket */}
        <g>
          <circle cx="52" cy="8" r="2.4" fill={gilt} stroke={ink} strokeWidth={0.6} />
          <circle cx="56" cy="11" r="1" fill={ink} opacity={0.6} />
        </g>
        <g>
          <circle cx="8" cy="52" r="2.4" fill={gilt} stroke={ink} strokeWidth={0.6} />
          <circle cx="11" cy="56" r="1" fill={ink} opacity={0.6} />
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* BorderKnot                                                       */
/* ---------------------------------------------------------------- */

/**
 * Horizontally repeating three-strand braid with diamond accents.
 * Tileable when placed end-to-end; preserveAspectRatio="none" lets it
 * stretch to fill arbitrary widths without distorting the strand thickness.
 */
export function BorderKnot({
  width = 120,
  height = 28,
  ink = INK,
  strand = STRAND,
  gilt = GILT,
  ...rest
}: IconProps & { width?: number; height?: number }) {
  // Two interweaving sinuous strands
  const upper = "M 0 8 Q 30 8 30 14 Q 30 20 60 20 Q 90 20 90 14 Q 90 8 120 8";
  const lower = "M 0 20 Q 30 20 30 14 Q 30 8 60 8 Q 90 8 90 14 Q 90 20 120 20";
  // Central thread between them
  const center = "M 0 14 L 120 14";

  return (
    <svg
      viewBox="0 0 120 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        <g stroke={ink} fill="none">
          <path d={upper} strokeWidth={4.2} />
          <path d={lower} strokeWidth={3.9} />
        </g>
        <g stroke={strand} fill="none">
          <path d={upper} strokeWidth={1.9} />
          <path d={lower} strokeWidth={1.7} />
        </g>

        {/* Thin gilt thread between the two strands */}
        <path d={center} stroke={gilt} strokeWidth={0.7} opacity={0.65} />

        {/* Diamond accents — each rotated slightly differently */}
        {[
          { cx: 30, rot: 43 },
          { cx: 60, rot: 46 },
          { cx: 90, rot: 44 },
        ].map(({ cx, rot }) => (
          <g key={cx} transform={`translate(${cx} 14) rotate(${rot})`}>
            <rect
              x="-2.4"
              y="-2.5"
              width="4.9"
              height="4.7"
              fill={gilt}
              stroke={ink}
              strokeWidth="0.6"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* CelticDivider                                                    */
/* ---------------------------------------------------------------- */

/**
 * Insular illuminated band: a filled pill of deep rubric red with two
 * gold strands woven through it as continuous interlace, gilt diamond
 * accents at each crossing, and small gilt knot-caps at the
 * ends. Inspired by the carpet-page borders of the Lindisfarne Gospels
 * and the Book of Kells, where filled red bands carry gold knotwork.
 *
 * Note: this version stretches via preserveAspectRatio="none" so the
 * band reads correctly across container widths.
 */
export function CelticDivider({
  width = 280,
  height = 40,
  ink = INK,
  strand = STRAND,
  gilt = GILT,
  ...rest
}: IconProps & { width?: number; height?: number }) {
  // Two sinuous strands waving between y=14 and y=26 across the band,
  // crossing each other at every midpoint to create an over/under weave.
  // Cubic control points are placed at segment midpoints with horizontal
  // tangents so each crossing is a smooth S, not a kink.
  const topStrand =
    "M 28 14 C 42 14, 42 26, 56 26 C 70 26, 70 14, 84 14 C 98 14, 98 26, 112 26 C 126 26, 126 14, 140 14 C 154 14, 154 26, 168 26 C 182 26, 182 14, 196 14 C 210 14, 210 26, 224 26 C 238 26, 238 14, 252 14";
  const botStrand =
    "M 28 26 C 42 26, 42 14, 56 14 C 70 14, 70 26, 84 26 C 98 26, 98 14, 112 14 C 126 14, 126 26, 140 26 C 154 26, 154 14, 168 14 C 182 14, 182 26, 196 26 C 210 26, 210 14, 224 14 C 238 14, 238 26, 252 26";

  const CROSSINGS = [42, 70, 98, 126, 154, 182, 210, 238];

  return (
    <svg
      viewBox="0 0 280 40"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        {/* Interlace strands — heavy ink outline + red strand on top */}
        <g fill="none" stroke={ink}>
          <path d={topStrand} strokeWidth={4} />
          <path d={botStrand} strokeWidth={4} />
        </g>
        <g fill="none" stroke={strand}>
          <path d={topStrand} strokeWidth={1.9} />
          <path d={botStrand} strokeWidth={1.9} />
        </g>

        {/* Gilt diamond accents at each strand crossing */}
        {CROSSINGS.map((cx) => (
          <g key={cx} transform={`translate(${cx} 20) rotate(45)`}>
            <rect
              x="-1.7"
              y="-1.7"
              width="3.4"
              height="3.4"
              fill={gilt}
              stroke={ink}
              strokeWidth={0.4}
            />
          </g>
        ))}

        {/* Knot-cap rosettes at the strand terminals */}
        <g transform="translate(28 14)">
          <circle r="2.4" fill={gilt} stroke={ink} strokeWidth={0.6} />
        </g>
        <g transform="translate(252 14)">
          <circle r="2.4" fill={gilt} stroke={ink} strokeWidth={0.6} />
        </g>

        {/* Center focal medallion — sits over the strands at midpoint */}
        <g transform="translate(140 20)">
          <circle r="5.2" fill="none" stroke={ink} strokeWidth={1.6} />
          <circle r="3.6" fill="none" stroke={gilt} strokeWidth={0.7} />
          <circle r="1.5" fill={gilt} stroke={ink} strokeWidth={0.4} />
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* DropCapFrame                                                     */
/* ---------------------------------------------------------------- */

/**
 * Square frame for an illuminated dropcap. Filled background, double border
 * (outer thicker, inner gilt rule), and small interlace knots in each
 * corner instead of mere arcs.
 */
export function DropCapFrame({
  size = 96,
  ink = INK,
  strand = STRAND,
  gilt = GILT,
  tint = TINT,
  ...rest
}: IconProps) {
  // Small triquetra centered at (8, 8) — same Insular motif as CornerKnot,
  // scaled to fit a 16x16 corner cell. Drawn in three smooth vesicas.
  const miniTriquetra =
    "M 8 2 C 11 2 13.6 4.5 13 8 C 12.5 11 10 12 8 11 C 6 12 3.5 11 3 8 C 2.4 4.5 5 2 8 2 Z";

  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {/* Background tint */}
      <rect x="2" y="2" width="92" height="92" fill={tint} />

      <g filter="url(#ink-wobble)">
        {/* Outer frame — double stroke for depth, varied weights */}
        <rect x="2" y="2" width="92" height="92" stroke={ink} strokeWidth={2.7} fill="none" />
        <rect x="6" y="6" width="84" height="84" stroke={gilt} strokeWidth={1} fill="none" />
        <rect
          x="11"
          y="11"
          width="74"
          height="74"
          stroke={ink}
          strokeWidth={0.7}
          opacity={0.5}
          fill="none"
        />

        {/* Mini knots in each corner — slight rotation jitter so each is unique */}
        {[
          { x: 4, y: 4, rotation: -2 },
          { x: 78, y: 4, rotation: 92 },
          { x: 78, y: 78, rotation: 178 },
          { x: 4, y: 78, rotation: 271 },
        ].map((c) => (
          <g
            key={`${c.x}-${c.y}`}
            transform={`translate(${c.x} ${c.y}) rotate(${c.rotation} 8 8)`}
          >
            <path d={miniTriquetra} stroke={ink} strokeWidth={1.8} fill="none" />
            <path d={miniTriquetra} stroke={strand} strokeWidth={0.9} fill="none" />
            <circle cx="8" cy="8" r="1.3" fill={gilt} stroke={ink} strokeWidth={0.4} />
          </g>
        ))}
      </g>
    </svg>
  );
}
