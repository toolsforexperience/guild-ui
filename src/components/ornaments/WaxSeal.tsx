/**
 * A static pendant wax seal — aged wax with an irregular pressed edge,
 * a Latin circumscription around the rim, and a heraldic device
 * impressed in the inner field. Decorative only.
 *
 * Variations:
 *  - `tone`    — wax colour (rubric / gilt / ink / forest / azure / violet)
 *  - `shape`   — silhouette (blob / quatrefoil / scalloped / oval / hex / shield)
 *  - `pattern` — secondary motif in the inner field (pellets / stars / rays / none)
 */
export type WaxSealTone =
  | "rubric"
  | "gilt"
  | "ink"
  | "forest"
  | "azure"
  | "violet";

export type WaxSealShape =
  | "blob"
  | "quatrefoil"
  | "scalloped"
  | "oval"
  | "hex"
  | "shield";

export type WaxSealPattern = "pellets" | "stars" | "rays" | "none";

export interface WaxSealProps {
  size?: number;
  /** Latin (or any) inscription that runs around the rim. */
  legend?: string;
  /** Single glyph impressed at the centre. Defaults to ⚜ */
  device?: string;
  /** Wax colour. Defaults to `rubric` (aged oxblood). */
  tone?: WaxSealTone;
  /** Silhouette of the seal. Defaults to `blob` (irregular round). */
  shape?: WaxSealShape;
  /** Decorative motif in the inner field. Defaults to `pellets`. */
  pattern?: WaxSealPattern;
  className?: string;
}

/* ─── tones ────────────────────────────────────────────────────── */

const TONES: Record<WaxSealTone, { body: string; accent: string }> = {
  rubric: { body: "var(--color-rubric-deep)", accent: "var(--color-rubric)" },
  gilt: { body: "#8a6520", accent: "#d4af37" },
  ink: { body: "#1f160b", accent: "#5a4530" },
  forest: { body: "#234a2a", accent: "#5a8a55" },
  azure: { body: "#1f3a5e", accent: "#5a7ab8" },
  violet: { body: "#3a1f4e", accent: "#7a4f9a" },
};

/* ─── silhouettes ──────────────────────────────────────────────── */
/* All shapes are described inside the same 64×64 viewBox with the
 * centre at (32, 32). Outer silhouette stays within ~r=28.            */

const SHAPES: Record<WaxSealShape, string> = {
  blob:
    "M 32 4 C 39 4 46 6.5 51 11.5 C 56 16 59 24 59.5 31 C 60 39 55.5 47 49.5 53 " +
    "C 44 57.5 37 60 31 59.5 C 25 59 19 57 13 53 C 8 48 3.5 40 3.5 32 " +
    "C 3 24 8 16 13.5 10.5 C 19 6.5 25 4 32 4 Z",

  quatrefoil:
    "M 32 4 A 14 14 0 0 1 46 18 A 14 14 0 0 1 60 32 " +
    "A 14 14 0 0 1 46 46 A 14 14 0 0 1 32 60 " +
    "A 14 14 0 0 1 18 46 A 14 14 0 0 1 4 32 " +
    "A 14 14 0 0 1 18 18 A 14 14 0 0 1 32 4 Z",

  // 8-lobed cusped circle, drawn as cusp-to-cusp quadratic bumps with
  // the lobe-tip used as the control handle.
  scalloped:
    "M 52.3 23.6 " +
    "Q 60 32 52.3 40.4 " +
    "Q 51.8 51.8 40.4 52.3 " +
    "Q 32 60 23.6 52.3 " +
    "Q 12.2 51.8 11.7 40.4 " +
    "Q 4 32 11.7 23.6 " +
    "Q 12.2 12.2 23.6 11.7 " +
    "Q 32 4 40.4 11.7 " +
    "Q 51.8 12.2 52.3 23.6 Z",

  oval:
    "M 32 4 A 22 28 0 0 1 32 60 A 22 28 0 0 1 32 4 Z",

  hex:
    "M 32 4 L 56.25 18 L 56.25 46 L 32 60 L 7.75 46 L 7.75 18 Z",

  // Heater shield — flat shoulders, curving to a point at the foot.
  shield:
    "M 8 5 Q 8 4 9 4 L 55 4 Q 56 4 56 5 L 56 30 " +
    "C 56 44 44 56 32 60 C 20 56 8 44 8 30 Z",
};

/* ─── inner-field metrics ──────────────────────────────────────── */
/* Each shape gets its own inner radius for the legend ring + the
 * pressed-die circle. Narrow shapes pull the ring inward so the
 * inscription doesn't clip the silhouette.                            */

type ShapeMetrics = {
  /** radius of the legend textPath circle */
  legendR: number;
  /** radius of the inner pressed-die circle (shadow + rule) */
  fieldR: number;
  /** radius of the outer rim hairline */
  rimR: number;
  /** radius of the pellet ring */
  pelletR: number;
  /** whether the legend reads well on this silhouette */
  showLegend: boolean;
};

// Note on quatrefoil/scalloped: the cusps between the lobes sit closer to
// the centre than the lobe-tips do, so the rim circle must inscribe the
// CUSP radius (not the tip radius) or the hairline will poke outside the
// silhouette at the indents.
//   - quatrefoil cusps ≈ r 19.8
//   - scalloped  cusps ≈ r 22
const METRICS: Record<WaxSealShape, ShapeMetrics> = {
  blob: { legendR: 22.5, fieldR: 18.5, rimR: 27, pelletR: 15.5, showLegend: true },
  quatrefoil: { legendR: 16, fieldR: 13, rimR: 18.5, pelletR: 10.5, showLegend: true },
  scalloped: { legendR: 18, fieldR: 15, rimR: 20.5, pelletR: 12.5, showLegend: true },
  oval: { legendR: 17, fieldR: 14, rimR: 20, pelletR: 11.5, showLegend: true },
  hex: { legendR: 19, fieldR: 16, rimR: 22, pelletR: 13, showLegend: true },
  shield: { legendR: 0, fieldR: 16, rimR: 20, pelletR: 13, showLegend: false },
};

/* ─── pattern renderers ────────────────────────────────────────── */

function PatternPellets({ accent, r }: { accent: string; r: number }) {
  return (
    <g fill={accent} opacity="0.7">
      <circle cx="32" cy={32 - r} r="0.8" />
      <circle cx="32" cy={32 + r} r="0.8" />
      <circle cx={32 - r} cy="32" r="0.8" />
      <circle cx={32 + r} cy="32" r="0.8" />
    </g>
  );
}

function PatternStars({ accent, r }: { accent: string; r: number }) {
  // 8 small 4-point stars — cardinals + ordinals.
  const d = r * 0.7071;
  const points: [number, number][] = [
    [32, 32 - r],
    [32 + d, 32 - d],
    [32 + r, 32],
    [32 + d, 32 + d],
    [32, 32 + r],
    [32 - d, 32 + d],
    [32 - r, 32],
    [32 - d, 32 - d],
  ];
  return (
    <g fill={accent} opacity="0.65">
      {points.map(([cx, cy], i) => (
        <path
          key={i}
          d={`M ${cx} ${cy - 1.4} L ${cx + 0.4} ${cy - 0.4} L ${cx + 1.4} ${cy} ` +
            `L ${cx + 0.4} ${cy + 0.4} L ${cx} ${cy + 1.4} ` +
            `L ${cx - 0.4} ${cy + 0.4} L ${cx - 1.4} ${cy} L ${cx - 0.4} ${cy - 0.4} Z`}
        />
      ))}
    </g>
  );
}

function PatternRays({ accent, r }: { accent: string; r: number }) {
  // 16 short rays radiating from inside the pressed field.
  const inner = r - 4;
  const rays = Array.from({ length: 16 }).map((_, i) => {
    const a = (i * Math.PI) / 8;
    const x1 = 32 + Math.cos(a) * inner;
    const y1 = 32 + Math.sin(a) * inner;
    const x2 = 32 + Math.cos(a) * r;
    const y2 = 32 + Math.sin(a) * r;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={accent}
        strokeWidth="0.3"
        opacity="0.55"
      />
    );
  });
  return <g>{rays}</g>;
}

/* ─── component ────────────────────────────────────────────────── */

export function WaxSeal({
  size = 96,
  legend = "⚜ SIGILLVM · GVILDAE · MMXXVI ⚜",
  device = "⚜",
  tone = "rubric",
  shape = "blob",
  pattern = "pellets",
  className = "",
}: WaxSealProps) {
  const path = SHAPES[shape];
  const m = METRICS[shape];
  const { body, accent } = TONES[tone];

  // legend path id is unique-per-shape so multiple seals on a page don't collide.
  const legendId = `wax-seal-legend-${shape}`;
  const legendD =
    `M 32 ${32 - m.legendR} ` +
    `A ${m.legendR} ${m.legendR} 0 1 1 31.999 ${32 - m.legendR}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {m.showLegend && <path id={legendId} d={legendD} fill="none" />}
      </defs>

      {/* cast shadow on the parchment */}
      <path d={path} fill="var(--color-ink-brown)" opacity="0.3" transform="translate(1.2, 1.8)" />

      {/* main wax body */}
      <path d={path} fill={body} />

      {/* darker silhouette stroke — implies wax thickness */}
      <path
        d={path}
        fill="none"
        stroke="#000"
        strokeWidth="0.5"
        opacity="0.35"
        transform="translate(0.4, 0.6)"
      />

      {/* outer rim — raised lip of the matrix */}
      <circle
        cx="32"
        cy="32"
        r={m.rimR}
        fill="none"
        stroke={accent}
        strokeWidth="0.5"
        opacity="0.55"
      />

      {/* recessed inner field — slight darkening where the die pressed */}
      <circle cx="32" cy="32" r={m.fieldR} fill="#000" opacity="0.18" />
      <circle
        cx="32"
        cy="32"
        r={m.fieldR}
        fill="none"
        stroke={accent}
        strokeWidth="0.4"
        opacity="0.5"
      />

      {/* circumscription — legend along the rim */}
      {m.showLegend && (
        <text
          fill={accent}
          fontSize="3.4"
          fontFamily="var(--font-display)"
          fontWeight="600"
          letterSpacing="0.9"
          opacity="0.92"
        >
          <textPath href={`#${legendId}`} startOffset="0">
            {legend}
          </textPath>
        </text>
      )}

      {/* pattern in the inner field */}
      {pattern === "pellets" && <PatternPellets accent={accent} r={m.pelletR} />}
      {pattern === "stars" && <PatternStars accent={accent} r={m.pelletR} />}
      {pattern === "rays" && <PatternRays accent={accent} r={m.fieldR - 1} />}

      {/* heraldic device — single glyph, impressed */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="22"
        fill={accent}
        fontFamily="var(--font-display)"
        fontWeight="700"
        opacity="0.88"
      >
        {device}
      </text>
    </svg>
  );
}
