import { useMemo, type CSSProperties } from "react";
import { createNoise2D } from "simplex-noise";

/**
 * Lighter, hand-drawn section breaks. Where KnotDivider/CelticDivider
 * are heavy, ceremonial interlace, these are quieter scribal marks —
 * the kind of in-between rhythm a copyist would draw with a single
 * pen lift between paragraphs. All use the global #ink-wobble filter
 * for an organic, slightly-trembling line.
 */

type Tone = "rubric" | "gilt" | "ink";

interface BaseProps {
  className?: string;
  /** Total width hint in svg units; the SVG still scales to its container. */
  width?: number;
  tone?: Tone;
  /** Override vertical margin spacing; defaults to my-8. */
  spacing?: string;
}

function toneToColor(tone: Tone): string {
  switch (tone) {
    case "gilt":
      return "var(--color-gilt)";
    case "ink":
      return "var(--color-ink-brown)";
    default:
      return "var(--color-rubric)";
  }
}

function toneToOpacity(tone: Tone): number {
  // Rubric and gilt read clearly even at low opacity; ink-brown needs more.
  return tone === "ink" ? 0.55 : 0.7;
}

/* ---------------------------------------------------------------- */
/* FlourishDivider                                                  */
/* ---------------------------------------------------------------- */

/**
 * Central calligraphic swash — two opposing curls meeting at a small
 * fleuron — flanked by hairlines that fade to transparent. The curls
 * are drawn as a single hand-inked path so they read as one pen
 * stroke. Lighter than KnotDivider; suitable between paragraphs.
 */
export function FlourishDivider({
  className = "",
  width = 280,
  tone = "ink",
  spacing = "my-8",
}: BaseProps) {
  const color = toneToColor(tone);
  const opacity = toneToOpacity(tone);
  const id = `flourish-fade-${tone}`;
  const cx = width / 2;
  const armReach = (width - 60) / 2;
  const lineY = 14;

  return (
    <div
      className={`flex justify-center ${spacing} ${className}`}
      role="separator"
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${width} 28`}
        width="100%"
        height={28}
        fill="none"
        preserveAspectRatio="none"
        style={{ color, maxWidth: width } as CSSProperties}
      >
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity={opacity} />
            <stop offset="0.55" stopColor="currentColor" stopOpacity={opacity} />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Side hairlines that fade out at the edges */}
        <rect x="0" y={lineY - 0.4} width={width} height="0.8" fill={`url(#${id})`} />
        {/* Central calligraphic swash — drawn over the hairlines, no stretch */}
        <g
          transform={`translate(${cx} 14)`}
          filter="url(#ink-wobble)"
          style={{ color } as CSSProperties}
        >
          {/* Left curl — quill descending into a loop, returning to centre */}
          <path
            d="M -28 -1 C -22 -7, -14 -7, -10 -2 C -6 3, -10 7, -16 5 C -22 3, -22 -3, -14 -3 L -2 -2"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeOpacity={opacity}
            fill="none"
            strokeLinecap="round"
          />
          {/* Right curl — mirror */}
          <path
            d="M 28 -1 C 22 -7, 14 -7, 10 -2 C 6 3, 10 7, 16 5 C 22 3, 22 -3, 14 -3 L 2 -2"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeOpacity={opacity}
            fill="none"
            strokeLinecap="round"
          />
          {/* Tiny gilt fleuron at centre */}
          <circle r="1.3" fill="var(--color-gilt)" opacity={0.85} />
          <circle r="0.5" fill="var(--color-ink-brown)" opacity={0.7} />
        </g>
        {/* Vestigial outer hairlines that don't get covered by the swash */}
        <rect
          x="0"
          y={lineY - 0.3}
          width={cx - armReach * 0.45}
          height="0.6"
          fill={`url(#${id})`}
          opacity={0.85}
        />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* VineDivider                                                      */
/* ---------------------------------------------------------------- */

/* Geometry — module-level so the randomness is shared, deterministic */

interface VineGeometry {
  stem: string;
  branches: string[];
  tendrils: { left: string; right: string };
  leaves: { x: number; y: number; angle: number; scale: number }[];
  berries: { x: number; y: number; r: number }[];
}

/**
 * Tiny seeded PRNG (mulberry32) so simplex-noise + leaf placement
 * produce the SAME vine on every render for a given seed. Without
 * this, simplex-noise would use Math.random and the vine would jitter
 * between renders.
 */
function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Smooth a polyline of points into a Catmull-Rom spline expressed as
 * cubic Béziers. Each interior segment uses its neighbour points to
 * compute tangent-aware control points so the curve through the
 * samples is C¹ continuous. Standard graphics technique — same one
 * Inkscape's "spiro" tool and many vector editors use to fit a
 * smooth curve through scribbled points.
 */
function catmullRomToBezier(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  const fmt = (n: number) => n.toFixed(2);
  const out: string[] = [`M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    out.push(
      `C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(p2.x)} ${fmt(p2.y)}`,
    );
  }
  return out.join(" ");
}

/**
 * Sample a point along the discretised stem and return its position
 * plus the local tangent angle. Used to root leaves onto the curve
 * with rotation that matches the stem's slope at that x.
 */
function sampleStem(
  pts: { x: number; y: number }[],
  t: number,
): { x: number; y: number; tangent: number } {
  const lastIdx = pts.length - 1;
  const idx = Math.max(0, Math.min(lastIdx, t * lastIdx));
  const i0 = Math.floor(idx);
  const i1 = Math.min(lastIdx, i0 + 1);
  const f = idx - i0;
  const x = pts[i0].x * (1 - f) + pts[i1].x * f;
  const y = pts[i0].y * (1 - f) + pts[i1].y * f;
  const a = pts[Math.max(0, i0 - 1)];
  const b = pts[Math.min(lastIdx, i0 + 1)];
  const tangent = Math.atan2(b.y - a.y, b.x - a.x);
  return { x, y, tangent };
}

const VINE_SAMPLES = 32;

interface VineGenOpts {
  startX: number;
  endX: number;
  centerY: number;
  amplitude: number;
  seed: number;
  leafCount: number;
}

/**
 * Generate a procedural vine: noise-perturbed stem, leaves rooted with
 * tangent-aware angles, scattered berries, terminal tendrils, and a
 * stochastic side-branch. Deterministic per (seed, opts).
 */
function generateVine(opts: VineGenOpts): VineGeometry {
  const { startX, endX, centerY, amplitude, seed, leafCount } = opts;
  const length = endX - startX;
  const rand = mulberry32(seed);
  const noise = createNoise2D(rand);

  // Sample stem y from 1-D noise. Taper amplitude with sin so the
  // wave fades to baseline at both ends — the curve doesn't slam into
  // the tendrils with full amplitude, which looks artificial.
  const samples: { x: number; y: number }[] = [];
  for (let i = 0; i <= VINE_SAMPLES; i++) {
    const t = i / VINE_SAMPLES;
    const x = startX + t * length;
    // Two octaves of noise: a slow primary undulation plus a smaller
    // higher-frequency wobble. Real plants do this — broad bends with
    // little jitters on top.
    const lo = noise(t * 2.4, 0);
    const hi = noise(t * 6.1, 11.7) * 0.35;
    const taper = Math.sin(t * Math.PI);
    const y = centerY + (lo + hi) * amplitude * taper;
    samples.push({ x, y });
  }
  const stem = catmullRomToBezier(samples);

  // Leaves. Pick t-values quasi-evenly with jitter, placing each leaf
  // perpendicular to the stem's local tangent. Side alternates so the
  // vine looks balanced; we also bias toward the convex side of the
  // local curvature (where leaves naturally grow on a real bend).
  const leaves: VineGeometry["leaves"] = [];
  // Spacing budget: each leaf gets a 1/leafCount slot, jittered by at
  // most ±15% of the slot. Keeps neighbours from colliding while still
  // breaking the metronomic look of perfectly even placement.
  const slot = 1 / leafCount;
  for (let i = 0; i < leafCount; i++) {
    const baseT = (i + 0.5) * slot;
    const jitter = (rand() - 0.5) * slot * 0.3;
    const t = Math.max(0.05, Math.min(0.95, baseT + jitter));
    const s = sampleStem(samples, t);
    // Perpendicular direction; alternate sides
    const side = i % 2 === 0 ? -1 : 1;
    const perpRad = s.tangent + (Math.PI / 2) * side;
    // Leaf path points "up" (negative y) by default, so we offset by -90°
    const tilt = (rand() - 0.5) * 0.45;
    const angle = ((perpRad + tilt) * 180) / Math.PI + 90;
    const scale = 1.05 + rand() * 0.35;
    leaves.push({ x: s.x, y: s.y, angle, scale });
  }

  // 1–3 berries clustered roughly mid-stem, never centred exactly.
  const berries: VineGeometry["berries"] = [];
  const berryCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < berryCount; i++) {
    const t = 0.25 + rand() * 0.55;
    const s = sampleStem(samples, t);
    // Nudge berry slightly off the stem so it doesn't sit on the line
    const offset = (rand() - 0.5) * 2.5;
    const nx = Math.cos(s.tangent + Math.PI / 2) * offset;
    const ny = Math.sin(s.tangent + Math.PI / 2) * offset;
    berries.push({ x: s.x + nx, y: s.y + ny, r: 0.9 + rand() * 0.7 });
  }

  // Optional side-branch — adds asymmetry. Skip with 50% prob so not
  // every divider gets one. Branch grows outward at a shallow ~30°
  // angle from the stem (not perpendicular — that reads as a "stick"),
  // curls slightly, and ends in a leaf scaled to match.
  const branches: string[] = [];
  if (rand() > 0.5) {
    // Root the branch in one of the middle gaps between main-stem
    // leaves (gap index 1..leafCount-2 → midpoint t between leaf i and
    // i+1). This guarantees the branch tip can't crowd a leaf because
    // the t-position is in the empty space between them.
    const gapIdx = 1 + Math.floor(rand() * Math.max(1, leafCount - 2));
    const tBranch = (gapIdx + 0.5) * slot;
    const root = sampleStem(samples, tBranch);
    const sideB = rand() > 0.5 ? 1 : -1;
    const len = 9 + rand() * 4;
    // Shoot outward along stem-tangent + a shallow vertical kick (~30°).
    // This gives the branch a "growing forward and away" feel rather
    // than dropping vertically.
    const dirX = rand() > 0.5 ? 1 : -1;
    const branchAngle = root.tangent + dirX * 0.5 + sideB * 0.6;
    const tipX = root.x + Math.cos(branchAngle) * len;
    const tipY = root.y + Math.sin(branchAngle) * len;
    // Curl: pull cp1 along the branch, cp2 slightly back-and-up so the
    // branch arcs rather than going straight to the tip.
    const cp1x = root.x + Math.cos(branchAngle) * len * 0.45;
    const cp1y = root.y + Math.sin(branchAngle) * len * 0.45;
    const curl = sideB * 1.8;
    const cp2x = tipX - Math.cos(branchAngle) * len * 0.25 + Math.sin(branchAngle) * curl;
    const cp2y = tipY - Math.sin(branchAngle) * len * 0.25 - Math.cos(branchAngle) * curl;
    // Branch ends with a small curl-back at the tip (a tendril flick)
    // rather than a leaf — adding a leaf here tends to crowd the
    // nearest main-stem leaf since the tip's horizontal position
    // depends on the branch length and angle.
    const curlEndX = tipX + Math.sin(branchAngle) * 2 * sideB;
    const curlEndY = tipY - Math.cos(branchAngle) * 2 * sideB;
    branches.push(
      `M ${root.x.toFixed(2)} ${root.y.toFixed(2)} ` +
        `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ` +
        `${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ` +
        `${tipX.toFixed(2)} ${tipY.toFixed(2)} ` +
        `Q ${(tipX + Math.sin(branchAngle) * 3 * sideB).toFixed(2)} ` +
        `${(tipY - Math.cos(branchAngle) * 3 * sideB).toFixed(2)}, ` +
        `${curlEndX.toFixed(2)} ${curlEndY.toFixed(2)}`,
    );
  }

  // Terminal tendrils — small spiraling pen-flicks at each end. Built
  // from cubic curves rooted at the actual sampled endpoints so they
  // continue smoothly from the stem rather than starting at a fixed
  // y=14.
  const a = samples[0];
  const z = samples[samples.length - 1];
  const tendrilLeft =
    `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} ` +
    `C ${(a.x - 6).toFixed(2)} ${a.y.toFixed(2)}, ` +
    `${(a.x - 10).toFixed(2)} ${(a.y - 3.5).toFixed(2)}, ` +
    `${(a.x - 9).toFixed(2)} ${(a.y - 7).toFixed(2)} ` +
    `C ${(a.x - 8).toFixed(2)} ${(a.y - 10).toFixed(2)}, ` +
    `${(a.x - 4).toFixed(2)} ${(a.y - 9).toFixed(2)}, ` +
    `${(a.x - 4.5).toFixed(2)} ${(a.y - 6.5).toFixed(2)}`;
  const tendrilRight =
    `M ${z.x.toFixed(2)} ${z.y.toFixed(2)} ` +
    `C ${(z.x + 6).toFixed(2)} ${z.y.toFixed(2)}, ` +
    `${(z.x + 10).toFixed(2)} ${(z.y - 3.5).toFixed(2)}, ` +
    `${(z.x + 9).toFixed(2)} ${(z.y - 7).toFixed(2)} ` +
    `C ${(z.x + 8).toFixed(2)} ${(z.y - 10).toFixed(2)}, ` +
    `${(z.x + 4).toFixed(2)} ${(z.y - 9).toFixed(2)}, ` +
    `${(z.x + 4.5).toFixed(2)} ${(z.y - 6.5).toFixed(2)}`;

  return { stem, branches, leaves, berries, tendrils: { left: tendrilLeft, right: tendrilRight } };
}

/**
 * A meandering manuscript vine. Geometry is procedural, generated
 * once via simplex-noise from a fixed seed: an organic stem, leaves
 * rooted with tangent-aware rotation, two terminal tendrils, scattered
 * berries, and an occasional side-branch. Every render of the same
 * `seed` produces the same vine — change `seed` for a different one.
 */
export function VineDivider({
  className = "",
  width = 280,
  tone = "ink",
  spacing = "my-8",
  seed = 7,
}: BaseProps & { seed?: number }) {
  const color = toneToColor(tone);
  const opacity = toneToOpacity(tone);

  // Fixed internal coord system; the SVG scales to whatever container
  // width the parent grants it. Height generous enough that ovate
  // leaves at full scale (~18 units long, perpendicular to the stem)
  // and the tendril curls don't clip at top/bottom.
  const VB_W = 280;
  const VB_H = 60;
  const PAD = 14; // tendril room at each end

  const geo = useMemo(
    () =>
      generateVine({
        startX: PAD,
        endX: VB_W - PAD,
        centerY: VB_H / 2,
        amplitude: 5,
        seed,
        leafCount: 6,
      }),
    [seed],
  );

  // Ovate manuscript leaf, rooted at origin, tip up. Two slightly
  // asymmetric sides (right cheek a hair fuller) so it doesn't look
  // mirror-perfect, with a small notch at the petiole.
  const leafPath =
    "M 0 0 C -1 -1, -3.5 -2, -4.5 -5 C -5.5 -8.5, -3.5 -11.5, 0 -13 C 3.7 -11.3, 5.6 -8, 4.6 -4.6 C 3.6 -1.7, 1.2 -0.8, 0 0 Z";
  // Curving midrib + two short side veins for that illuminated-leaf feel
  const leafVein =
    "M 0 -1 C 0.4 -4, 0.6 -8, 0.2 -11.5 M 0.3 -5 L -2.2 -6.5 M 0.3 -7.5 L 2.4 -8.5";

  return (
    <div
      className={`flex justify-center ${spacing} ${className}`}
      role="separator"
      aria-hidden
      style={{ color }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height={VB_H}
        fill="none"
        style={{ maxWidth: width } as CSSProperties}
      >
        <g
          filter="url(#ink-wobble)"
          stroke="currentColor"
          strokeOpacity={opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Stem */}
          <path d={geo.stem} strokeWidth="1.1" />
          {/* Side branches (0..N) */}
          {geo.branches.map((d, i) => (
            <path
              key={`b-${i}`}
              d={d}
              strokeWidth="0.85"
              strokeOpacity={opacity * 0.9}
            />
          ))}
          {/* Tendril curls at each terminus */}
          <path d={geo.tendrils.left} strokeWidth="0.8" />
          <path d={geo.tendrils.right} strokeWidth="0.8" />
        </g>

        {/* Leaves: filled almond + central vein, rooted to the stem */}
        <g filter="url(#ink-wobble)">
          {geo.leaves.map((l, i) => (
            <g
              key={i}
              transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.angle.toFixed(2)}) scale(${l.scale.toFixed(2)})`}
            >
              <path
                d={leafPath}
                fill="currentColor"
                fillOpacity={opacity * 0.55}
                stroke="currentColor"
                strokeOpacity={opacity}
                strokeWidth="0.7"
              />
              <path
                d={leafVein}
                stroke="currentColor"
                strokeOpacity={opacity * 0.7}
                strokeWidth="0.5"
                fill="none"
              />
            </g>
          ))}
          {/* Off-centre berries — never a tidy single dot. */}
          {geo.berries.map((b, i) => (
            <g key={`berry-${i}`}>
              <circle
                cx={b.x.toFixed(2)}
                cy={b.y.toFixed(2)}
                r={b.r.toFixed(2)}
                fill="var(--color-gilt)"
              />
              <circle
                cx={b.x.toFixed(2)}
                cy={b.y.toFixed(2)}
                r={b.r.toFixed(2)}
                fill="none"
                stroke="currentColor"
                strokeOpacity={opacity}
                strokeWidth="0.4"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* AsterismDivider                                                  */
/* ---------------------------------------------------------------- */

/**
 * Classical book-divider asterism (⁂): three small asterisks set in a
 * triangle, flanked by hairlines that fade at both ends. The lightest
 * formal divider in the set — used in printed books for centuries
 * before the dingbat era. Hairlines fade to transparent.
 */
export function AsterismDivider({
  className = "",
  width = 280,
  tone = "ink",
  spacing = "my-8",
}: BaseProps) {
  const color = toneToColor(tone);
  const opacity = toneToOpacity(tone);
  const id = `asterism-fade-${tone}`;
  const cx = width / 2;
  const lineY = 14;

  // Six-point asterisk built as three crossing lines through origin
  const Asterisk = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke="currentColor"
      strokeOpacity={opacity}
      strokeWidth={1}
      strokeLinecap="round"
    >
      <line x1="-3" y1="0" x2="3" y2="0" />
      <line x1="-1.5" y1="-2.6" x2="1.5" y2="2.6" />
      <line x1="-1.5" y1="2.6" x2="1.5" y2="-2.6" />
    </g>
  );

  return (
    <div
      className={`flex justify-center ${spacing} ${className}`}
      role="separator"
      aria-hidden
      style={{ color }}
    >
      <svg
        viewBox={`0 0 ${width} 28`}
        width="100%"
        height={28}
        fill="none"
        preserveAspectRatio="none"
        style={{ maxWidth: width } as CSSProperties}
      >
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.35" stopColor="currentColor" stopOpacity={opacity * 0.7} />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.65" stopColor="currentColor" stopOpacity={opacity * 0.7} />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y={lineY - 0.3} width={width} height="0.6" fill={`url(#${id})`} />
        <g filter="url(#ink-wobble)">
          {/* Triangle of three asterisks: two on the baseline, one above */}
          <Asterisk x={cx - 9} y={lineY + 4} />
          <Asterisk x={cx + 9} y={lineY + 4} />
          <Asterisk x={cx} y={lineY - 5} />
        </g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* InkDotsDivider                                                   */
/* ---------------------------------------------------------------- */

/**
 * The quietest divider in the set: three small ink dots, slightly
 * uneven in size and spacing, with no rule. Borrowed from the
 * scribal habit of marking a brief pause with a dot trio. Use when
 * even AsterismDivider would be too loud.
 */
export function InkDotsDivider({
  className = "",
  width = 80,
  tone = "ink",
  spacing = "my-8",
}: BaseProps) {
  const color = toneToColor(tone);
  const opacity = toneToOpacity(tone);

  return (
    <div
      className={`flex justify-center ${spacing} ${className}`}
      role="separator"
      aria-hidden
      style={{ color }}
    >
      <svg
        viewBox="0 0 80 12"
        width={width}
        height={12}
        fill="none"
      >
        <g filter="url(#ink-wobble)" fill="currentColor" fillOpacity={opacity}>
          {/* Slightly varied radii and y-offsets — the unevenness is the point */}
          <circle cx="22" cy="6" r="1.3" />
          <circle cx="40" cy="6.4" r="1.5" />
          <circle cx="58" cy="5.8" r="1.2" />
        </g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* QuillDivider                                                     */
/* ---------------------------------------------------------------- */

/**
 * A single calligraphic quill stroke: thicker at the centre, tapering
 * to a feathered point at each end. Drawn as a filled blade rather
 * than a stroked line so the swell reads correctly. Reads as a
 * single confident pen lift across the page.
 */
export function QuillDivider({
  className = "",
  width = 280,
  tone = "ink",
  spacing = "my-8",
}: BaseProps) {
  const color = toneToColor(tone);
  const opacity = toneToOpacity(tone);

  // Asymmetric blade: tapered at both ends, swelling at centre, with a
  // subtle upward arc so it doesn't look like a printed em-dash.
  const blade =
    "M 6 14.4 C 60 14.4, 110 12.8, 140 12.4 C 170 12, 220 13.2, 274 14 C 220 14.8, 170 14.6, 140 14.8 C 110 15, 60 15, 6 14.6 Z";

  return (
    <div
      className={`flex justify-center ${spacing} ${className}`}
      role="separator"
      aria-hidden
      style={{ color }}
    >
      <svg
        viewBox="0 0 280 28"
        width="100%"
        height={28}
        fill="none"
        preserveAspectRatio="none"
        style={{ maxWidth: width } as CSSProperties}
      >
        <g filter="url(#ink-wobble)">
          <path
            d={blade}
            fill="currentColor"
            fillOpacity={opacity * 0.85}
          />
          {/* Tiny gilt mid-point dot, almost invisible */}
          <circle cx="140" cy="13.6" r="0.9" fill="var(--color-gilt)" opacity={0.7} />
        </g>
      </svg>
    </div>
  );
}
