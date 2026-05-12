import { useId, type CSSProperties, type SVGProps } from "react";

/**
 * Lightweight, hand-drawn alternatives to the formal interlace decals in
 * Knotwork.tsx. Where `BorderKnot` is a heavy three-strand braid with
 * gilt diamond accents, these decals are scribal hairlines: a single
 * stroke or two, drawn with strict mirror symmetry about the centre so
 * the eye reads regularity, not scribble. All draw in `currentColor`
 * (recoloured via Tailwind classes) and pass through the global
 * `#ink-wobble` filter for an organic, faintly trembling line.
 *
 * Each is a horizontal "border" ornament in the same shape as
 * `BorderKnot` — `preserveAspectRatio="none"` so it stretches to flank
 * titles or section headings at any width.
 */

type Tone = "ink" | "rubric" | "gilt";

interface DecalBaseProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  /** Optional explicit tone; otherwise inherits via `currentColor`/className. */
  tone?: Tone;
}

function toneColor(tone?: Tone): string | undefined {
  if (!tone) return undefined;
  if (tone === "gilt") return "var(--color-gilt)";
  if (tone === "rubric") return "var(--color-rubric)";
  return "var(--color-ink-brown)";
}

/* ---------------------------------------------------------------- */
/* TendrilBorder                                                    */
/* ---------------------------------------------------------------- */

/**
 * A central gilt fleuron with two mirror-symmetric calligraphic arms
 * that sweep outward and end in matching spiral terminals. Strict
 * left/right symmetry — the only "irregularity" is the ink-wobble
 * filter's faint tremble. Reads as one deliberate pen lift per side.
 */
export function TendrilBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Mirror-symmetric arms about x=70 (centre).
  // Right arm: from centre (70,14) sweeping out and curling back at (134,14).
  const rightArm =
    "M 70 14 C 86 14, 102 9, 118 11 C 130 12.5, 134 14, 132 17 C 130 19, 126 19, 126 16";
  const leftArm =
    "M 70 14 C 54 14, 38 9, 22 11 C 10 12.5, 6 14, 8 17 C 10 19, 14 19, 14 16";

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g
        filter="url(#ink-wobble)"
        stroke="currentColor"
        strokeOpacity={0.7}
        fill="none"
      >
        <path d={rightArm} strokeWidth={1} />
        <path d={leftArm} strokeWidth={1} />
      </g>
      {/* Central fleuron — small gilt rosette tying the two arms together */}
      <g filter="url(#ink-wobble)">
        <circle cx="70" cy="14" r="1.6" fill="var(--color-gilt)" opacity={0.9} />
        <circle
          cx="70"
          cy="14"
          r="1.6"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.5}
        />
        <circle cx="70" cy="14" r="0.5" fill="currentColor" fillOpacity={0.7} />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* IvyBorder                                                        */
/* ---------------------------------------------------------------- */

/**
 * A horizontal hairline stem with leaves rooted exactly at its peaks
 * and troughs, in mirror-symmetric pairs about the centre. The stem
 * is built from cubic segments joining seven waypoints with horizontal
 * tangents at each, so the curve is C¹-smooth and demonstrably passes
 * through every leaf-attachment point. A small gilt fleuron marks the
 * centre.
 */
export function IvyBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Waypoints, mirror-symmetric about x=70:
  //   start (10,14) → upper-peak (35,10) → lower-trough (55,18)
  //                 → centre (70,14)
  //                 → lower-trough (85,18) → upper-peak (105,10)
  //                 → end (130,14)
  // Each cubic segment gets cp1/cp2 placed one-third of the segment's
  // dx along its endpoints' y-levels — that gives horizontal tangents
  // at every waypoint, so the stem actually passes through them.
  const stem =
    "M 10 14 C 18.33 14, 26.67 10, 35 10" +
    " C 41.67 10, 48.33 18, 55 18" +
    " C 60 18, 65 14, 70 14" +
    " C 75 14, 80 18, 85 18" +
    " C 91.67 18, 98.33 10, 105 10" +
    " C 113.33 10, 121.67 14, 130 14";

  // Leaves rooted exactly on the stem waypoints. Outer pair on the
  // upper peaks (point up-and-outward); inner pair on the lower
  // troughs (point down-and-outward, i.e. ±155° = ±(180−25°)).
  const leaf = "M 0 0 C -2.5 -3, -2 -8, 0 -11 C 2 -8, 2.5 -3, 0 0 Z";
  const leaves: { x: number; y: number; angle: number }[] = [
    { x: 35, y: 10, angle: -25 },
    { x: 105, y: 10, angle: 25 },
    { x: 55, y: 18, angle: -155 },
    { x: 85, y: 18, angle: 155 },
  ];

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        <path
          d={stem}
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.9}
          fill="none"
        />
        {leaves.map((l, i) => (
          <g
            key={i}
            transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`}
          >
            <path
              d={leaf}
              fill="currentColor"
              fillOpacity={0.45}
              stroke="currentColor"
              strokeOpacity={0.7}
              strokeWidth={0.55}
            />
            <path
              d="M 0 -1 L 0 -9.5"
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeWidth={0.4}
              fill="none"
            />
          </g>
        ))}
        {/* Central gilt fleuron — sits on the stem at (70,14) */}
        <circle cx="70" cy="14" r="1.4" fill="var(--color-gilt)" opacity={0.9} />
        <circle
          cx="70"
          cy="14"
          r="1.4"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.4}
        />
      </g>
    </svg>
  );
}

/* ================================================================ */
/* Hairline family — tapered rules with varied centre motifs        */
/* ================================================================ */

/**
 * Shared rule for the hairline family: a single horizontal line whose
 * opacity fades to zero at both ends, drawn in `currentColor` so the
 * whole family inherits theme colour. The four `Hairline*Border`
 * variants below differ only in the central motif placed over this
 * rule.
 *
 * Returns a `<defs>` block (with a per-instance gradient id) and a
 * `<rect>` painted with that gradient. The gradient id is derived
 * from `useId` so multiple instances on the same page never collide.
 */
function useHairlineRule(opacity = 0.55) {
  const rawId = useId();
  const gradientId = `hairline-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rule = (width: number, y: number, height = 0.9) => (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.18" stopColor="currentColor" stopOpacity={opacity * 0.6} />
          <stop offset="0.42" stopColor="currentColor" stopOpacity={opacity} />
          <stop offset="0.58" stopColor="currentColor" stopOpacity={opacity} />
          <stop offset="0.82" stopColor="currentColor" stopOpacity={opacity * 0.6} />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y={y - height / 2}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
      />
    </>
  );
  return rule;
}

/**
 * Hairline + small fleuron rosette at the centre: a gilt circle
 * pinched at top and bottom by tiny pen-flicks (small leaf-cap
 * shapes), the way illuminated rules often anchor a centerpiece. The
 * quietest member of the hairline family.
 */
export function HairlineFleuronBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  const renderRule = useHairlineRule();
  const cx = 70;
  const cy = 14;
  // Tiny "petal" pen-flick — small almond used at top and bottom of the boss
  const petal = "M 0 0 C -1.6 -1.5, -1.2 -4, 0 -5.5 C 1.2 -4, 1.6 -1.5, 0 0 Z";

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      {renderRule(140, cy)}
      <g filter="url(#ink-wobble)">
        {/* Top + bottom petals */}
        <g transform={`translate(${cx} ${cy - 1.4}) rotate(0)`}>
          <path
            d={petal}
            fill="currentColor"
            fillOpacity={0.6}
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={0.4}
          />
        </g>
        <g transform={`translate(${cx} ${cy + 1.4}) rotate(180)`}>
          <path
            d={petal}
            fill="currentColor"
            fillOpacity={0.6}
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={0.4}
          />
        </g>
        {/* Central gilt boss */}
        <circle cx={cx} cy={cy} r={1.5} fill="var(--color-gilt)" opacity={0.9} />
        <circle
          cx={cx}
          cy={cy}
          r={1.5}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.4}
        />
        <circle cx={cx} cy={cy} r={0.45} fill="currentColor" fillOpacity={0.7} />
      </g>
    </svg>
  );
}

/**
 * Hairline + three diamonds clustered at the centre: one larger gilt
 * lozenge flanked by two smaller hollow ones. A symmetric heraldic
 * triad. The middle is busier than MenuDivider's single diamond, but
 * the rule still tapers to nothing at both ends.
 */
export function HairlineTriadBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  const renderRule = useHairlineRule();
  const cy = 14;

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      {renderRule(140, cy)}
      <g filter="url(#ink-wobble)">
        {/* Outer hollow lozenges, mirror-symmetric about cx=70 */}
        {[60, 80].map((cx) => (
          <g key={cx} transform={`translate(${cx} ${cy}) rotate(45)`}>
            <rect
              x="-1.6"
              y="-1.6"
              width="3.2"
              height="3.2"
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.75}
              strokeWidth={0.6}
            />
          </g>
        ))}
        {/* Central larger gilt lozenge */}
        <g transform={`translate(70 ${cy}) rotate(45)`}>
          <rect
            x="-2.4"
            y="-2.4"
            width="4.8"
            height="4.8"
            fill="var(--color-gilt)"
            fillOpacity={0.9}
            stroke="currentColor"
            strokeOpacity={0.75}
            strokeWidth={0.5}
          />
        </g>
      </g>
    </svg>
  );
}

/**
 * Hairline + tiny Insular triquetra at the centre — the Celtic
 * trinity knot in miniature, drawn as one closed loop. A vestige of
 * the formal interlace family, scaled down so it reads as a small
 * centrepiece on a fading rule rather than a full ornament.
 */
export function HairlineKnotBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  const renderRule = useHairlineRule();
  const cy = 14;
  // Small triquetra — three vesicas meeting at 120°, scaled to ~10x10
  const triquetra =
    "M 0 -5 C 2.5 -5, 4.7 -3, 4.3 0 C 4 2.5, 1.6 3.3, 0 2.5 C -1.6 3.3, -4 2.5, -4.3 0 C -4.7 -3, -2.5 -5, 0 -5 Z";

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      {renderRule(140, cy)}
      <g filter="url(#ink-wobble)" transform={`translate(70 ${cy})`}>
        <path
          d={triquetra}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={0.9}
        />
        <circle r={0.9} fill="var(--color-gilt)" opacity={0.9} />
      </g>
    </svg>
  );
}

/**
 * Hairline + concentric framed lozenge at the centre: an outer hollow
 * lozenge, a thin inner one, and a tiny gilt diamond at the exact
 * centre. Reads as a small framed cartouche on the rule — the most
 * structured of the hairline family.
 */
export function HairlineLozengeBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  const renderRule = useHairlineRule();
  const cy = 14;

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      {renderRule(140, cy)}
      <g filter="url(#ink-wobble)" transform={`translate(70 ${cy}) rotate(45)`}>
        {/* Outer frame */}
        <rect
          x="-3.6"
          y="-3.6"
          width="7.2"
          height="7.2"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={0.7}
        />
        {/* Inner frame */}
        <rect
          x="-2.2"
          y="-2.2"
          width="4.4"
          height="4.4"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth={0.45}
        />
        {/* Central gilt diamond */}
        <rect
          x="-1"
          y="-1"
          width="2"
          height="2"
          fill="var(--color-gilt)"
          fillOpacity={0.9}
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth={0.3}
        />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* DiamondBorder                                                    */
/* ---------------------------------------------------------------- */

/**
 * Geometric medieval direction: a horizontal hairline threaded
 * through five evenly-spaced gilt diamonds, with two slightly larger
 * diamonds at the termini as bookends. Crisp and rhythmic.
 */
export function DiamondBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Inner diamonds: 5 pieces, evenly spaced about centre
  const inner = [40, 55, 70, 85, 100];
  // Bookends slightly larger
  const ends = [12, 128];

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        {/* Continuous baseline rule */}
        <line
          x1="6"
          y1="14"
          x2="134"
          y2="14"
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth={0.8}
        />
        {/* Inner diamonds — gilt, ink hairline border */}
        {inner.map((cx) => (
          <g key={cx} transform={`translate(${cx} 14) rotate(45)`}>
            <rect
              x="-2.2"
              y="-2.2"
              width="4.4"
              height="4.4"
              fill="var(--color-gilt)"
              fillOpacity={0.9}
              stroke="currentColor"
              strokeOpacity={0.75}
              strokeWidth={0.5}
            />
          </g>
        ))}
        {/* Bookend diamonds — slightly larger, hollow */}
        {ends.map((cx) => (
          <g key={cx} transform={`translate(${cx} 14) rotate(45)`}>
            <rect
              x="-3"
              y="-3"
              width="6"
              height="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.75}
              strokeWidth={0.7}
            />
            <rect
              x="-1.1"
              y="-1.1"
              width="2.2"
              height="2.2"
              fill="var(--color-gilt)"
              fillOpacity={0.85}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* ArcBorder                                                        */
/* ---------------------------------------------------------------- */

/**
 * Architectural direction: a small Romanesque arcade — five round
 * arches springing from a baseline, with a tiny gilt boss centred on
 * each capital. Reads like an illuminated cloister border.
 */
export function ArcBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Five arches, span 18 units each, sitting on baseline y=20
  const arches = [22, 44, 66, 88, 110];
  const r = 7; // arch radius
  // Capital bosses sit on baseline at the springline of each arch
  const bosses: number[] = [];
  arches.forEach((cx) => {
    bosses.push(cx - r, cx + r);
  });
  // Dedupe shared springline points where two arches meet
  const uniqueBosses = Array.from(new Set(bosses));

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        {/* Baseline */}
        <line
          x1="6"
          y1="20"
          x2="134"
          y2="20"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.9}
        />
        {/* Arches — half-circles built from a single arc command */}
        {arches.map((cx) => (
          <path
            key={cx}
            d={`M ${cx - r} 20 A ${r} ${r} 0 0 1 ${cx + r} 20`}
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={0.9}
            fill="none"
          />
        ))}
        {/* Tiny gilt bosses on each capital */}
        {uniqueBosses.map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={20}
            r={1}
            fill="var(--color-gilt)"
            opacity={0.85}
          />
        ))}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* DotDashBorder                                                    */
/* ---------------------------------------------------------------- */

/**
 * Typographic direction: a Morse-like punctuation rhythm of dashes and
 * dots with a small gilt fleuron at the exact centre. The lightest of
 * the geometric set; reads almost as printed dingbat punctuation.
 */
export function DotDashBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Mirror-symmetric pattern about x=70:
  // dash · dash · dash · [centre] · dash · dash · dash
  const dashes = [
    { x1: 12, x2: 24 },
    { x1: 32, x2: 44 },
    { x1: 52, x2: 64 },
    { x1: 76, x2: 88 },
    { x1: 96, x2: 108 },
    { x1: 116, x2: 128 },
  ];
  const dots = [28, 48, 68, 72, 92, 112];

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        {dashes.map((d, i) => (
          <line
            key={i}
            x1={d.x1}
            y1={14}
            x2={d.x2}
            y2={14}
            stroke="currentColor"
            strokeOpacity={0.75}
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}
        {dots.map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={14}
            r={0.9}
            fill="currentColor"
            fillOpacity={0.7}
          />
        ))}
        {/* Central gilt fleuron */}
        <circle cx="70" cy="14" r="1.6" fill="var(--color-gilt)" opacity={0.9} />
        <circle
          cx="70"
          cy="14"
          r="1.6"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={0.4}
        />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* ChevronBorder                                                    */
/* ---------------------------------------------------------------- */

/**
 * Heraldic direction: a continuous mirror-symmetric chevron (zigzag),
 * with a small fleuron at the centre breaking the run. Crisp angular
 * cousin to the soft swashes of TendrilBorder.
 */
export function ChevronBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Zig-zag from x=8 to x=64 (left half), and x=76 to x=132 (right half),
  // with a 12-unit gap centred on x=70 for the fleuron.
  // Peaks at y=10, troughs at y=18, crossings at y=14.
  const left =
    "M 8 14 L 16 10 L 24 18 L 32 10 L 40 18 L 48 10 L 56 18 L 64 14";
  const right =
    "M 76 14 L 84 10 L 92 18 L 100 10 L 108 18 L 116 10 L 124 18 L 132 14";

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g filter="url(#ink-wobble)">
        <path
          d={left}
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={1}
          fill="none"
        />
        <path
          d={right}
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={1}
          fill="none"
        />
        {/* Central fleuron — slightly larger so it anchors the gap */}
        <g transform="translate(70 14) rotate(45)">
          <rect
            x="-2.6"
            y="-2.6"
            width="5.2"
            height="5.2"
            fill="var(--color-gilt)"
            fillOpacity={0.9}
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={0.5}
          />
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* WovenBorder                                                      */
/* ---------------------------------------------------------------- */

/**
 * A two-strand weave with three crossings, evenly spaced. Same shape
 * language as `BorderKnot` but stripped to single hairlines (no
 * double-stroke ink outline, no inset gilt diamonds), with small
 * pen-dots at each crossing. The hand-drawn cousin of the formal
 * braid — symmetric by construction.
 */
export function WovenBorder({
  width = 140,
  height = 28,
  tone,
  style,
  ...rest
}: DecalBaseProps) {
  const color = toneColor(tone);
  // Crossings at x = 35, 70, 105 — evenly spaced about centre 70.
  // Cubic curves with horizontal tangents at every crossing produce
  // smooth S-shaped weaves (no kinks) and exact mirror symmetry.
  const upper =
    "M 6 9 C 20 9, 21 14, 35 14 C 49 14, 50 9, 70 9 C 90 9, 91 14, 105 14 C 119 14, 120 9, 134 9";
  const lower =
    "M 6 19 C 20 19, 21 14, 35 14 C 49 14, 50 19, 70 19 C 90 19, 91 14, 105 14 C 119 14, 120 19, 134 19";
  const crossings = [35, 70, 105];

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(color ? { color } : {}), ...style } as CSSProperties}
      {...rest}
    >
      <g
        filter="url(#ink-wobble)"
        stroke="currentColor"
        strokeOpacity={0.7}
        fill="none"
      >
        <path d={upper} strokeWidth={1} />
        <path d={lower} strokeWidth={1} />
        <g fill="currentColor" stroke="none" fillOpacity={0.7}>
          {crossings.map((cx) => (
            <circle key={cx} cx={cx} cy={14} r={0.85} />
          ))}
        </g>
      </g>
    </svg>
  );
}
