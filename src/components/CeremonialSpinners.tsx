export interface CeremonialSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

/* ─────────────── 1 · Hourglass ───────────────
   A pen-and-ink hourglass as if drawn by a Renaissance hand:
   slightly imperfect curves, cross-hatched shadows on the bulbs,
   wood-grain on the caps, sand piles dotted with individual grains.
   The whole assembly rests, then flips 180° smoothly, rests at the
   pole, then continues another 180° back to start. A column of grains
   trickles continuously through the neck during the rest poses. */
export function HourglassSpinner({
  size = 80,
  className = "",
  label = "Loading",
}: CeremonialSpinnerProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <svg
        viewBox="-10 -10 84 84"
        width={size}
        height={size}
        overflow="visible"
      >
        <g
          className="hourglass-flip"
          stroke="var(--color-ink-brown)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ink-wobble)"
        >
          {/* ── TOP PLATE: a thin moulded bar; outer rule, inner rule,
                end-caps. The overhang past the side posts forms the
                small moulding shadow of a turned profile. ── */}
          <path d="M 9 5.4 Q 32 4.9 55 5.4" strokeWidth="1.05" />
          <path d="M 9.3 5.7 Q 32 5.3 54.7 5.7" strokeWidth="0.4" opacity="0.55" />
          <path d="M 9 9.4 Q 32 9.7 55 9.4" strokeWidth="1.05" />
          <path d="M 9.3 9.0 Q 32 9.2 54.7 9.0" strokeWidth="0.4" opacity="0.5" />
          <path d="M 9 5.4 L 9 9.4" strokeWidth="0.9" />
          <path d="M 55 5.4 L 55 9.4" strokeWidth="0.9" />
          {/* hatched grain on plate (vertical pen ticks) */}
          <g strokeWidth="0.3" opacity="0.4">
            <path d="M 11.5 6.2 L 11.7 8.8" />
            <path d="M 14 6.1 L 14.2 8.9" />
            <path d="M 16.5 6.2 L 16.7 8.8" />
            <path d="M 19 6.1 L 19.2 8.9" />
            <path d="M 21.5 6.2 L 21.7 8.8" />
            <path d="M 24 6.1 L 24.2 8.9" />
            <path d="M 26.5 6.2 L 26.7 8.8" />
            <path d="M 29 6.1 L 29.2 8.9" />
            <path d="M 31.5 6.2 L 31.7 8.8" />
            <path d="M 34 6.1 L 34.2 8.9" />
            <path d="M 36.5 6.2 L 36.7 8.8" />
            <path d="M 39 6.1 L 39.2 8.9" />
            <path d="M 41.5 6.2 L 41.7 8.8" />
            <path d="M 44 6.1 L 44.2 8.9" />
            <path d="M 46.5 6.2 L 46.7 8.8" />
            <path d="M 49 6.1 L 49.2 8.9" />
            <path d="M 51.5 6.2 L 51.7 8.8" />
            <path d="M 53.5 6.1 L 53.7 8.9" />
          </g>

          {/* ── SIDE POSTS — vertical, doubled for hand-drawn weight ── */}
          <path d="M 12 9.4 L 12 54.6" strokeWidth="1.1" />
          <path d="M 12.35 9.6 L 12.35 54.4" strokeWidth="0.4" opacity="0.5" />
          <path d="M 52 9.4 L 52 54.6" strokeWidth="1.1" />
          <path d="M 51.65 9.6 L 51.65 54.4" strokeWidth="0.4" opacity="0.5" />

          {/* ── BOTTOM PLATE: mirror of top ── */}
          <path d="M 9 54.6 Q 32 54.3 55 54.6" strokeWidth="1.05" />
          <path d="M 9.3 55.0 Q 32 54.8 54.7 55.0" strokeWidth="0.4" opacity="0.5" />
          <path d="M 9 58.6 Q 32 59.1 55 58.6" strokeWidth="1.05" />
          <path d="M 9.3 58.3 Q 32 58.7 54.7 58.3" strokeWidth="0.4" opacity="0.55" />
          <path d="M 9 54.6 L 9 58.6" strokeWidth="0.9" />
          <path d="M 55 54.6 L 55 58.6" strokeWidth="0.9" />
          <g strokeWidth="0.3" opacity="0.4">
            <path d="M 11.5 55.4 L 11.7 58" />
            <path d="M 14 55.3 L 14.2 58.1" />
            <path d="M 16.5 55.4 L 16.7 58" />
            <path d="M 19 55.3 L 19.2 58.1" />
            <path d="M 21.5 55.4 L 21.7 58" />
            <path d="M 24 55.3 L 24.2 58.1" />
            <path d="M 26.5 55.4 L 26.7 58" />
            <path d="M 29 55.3 L 29.2 58.1" />
            <path d="M 31.5 55.4 L 31.7 58" />
            <path d="M 34 55.3 L 34.2 58.1" />
            <path d="M 36.5 55.4 L 36.7 58" />
            <path d="M 39 55.3 L 39.2 58.1" />
            <path d="M 41.5 55.4 L 41.7 58" />
            <path d="M 44 55.3 L 44.2 58.1" />
            <path d="M 46.5 55.4 L 46.7 58" />
            <path d="M 49 55.3 L 49.2 58.1" />
            <path d="M 51.5 55.4 L 51.7 58" />
            <path d="M 53.5 55.3 L 53.7 58.1" />
          </g>

          {/* ── GLASS: late-medieval pear/onion bulbs, narrower and
                taller than the cartoon spheres. Each wall: meets the
                plate, swells out to the wide point, draws back in to
                the neck. A faint redrawn inner curve gives the
                "second pen pass" hand-drawn quality. ── */}
          {/* upper-left wall */}
          <path d="M 18 9.4 Q 14 13 13.5 19 Q 14.5 26 30 31.5" strokeWidth="1.05" />
          <path d="M 18.3 9.7 Q 14.4 13.2 14 19 Q 15 26 30.3 31.1" strokeWidth="0.4" opacity="0.45" />
          {/* upper-right wall */}
          <path d="M 46 9.4 Q 50 13 50.5 19 Q 49.5 26 34 31.5" strokeWidth="1.05" />
          <path d="M 45.7 9.7 Q 49.6 13.2 50 19 Q 49 26 33.7 31.1" strokeWidth="0.4" opacity="0.45" />
          {/* lower-left wall (mirror) */}
          <path d="M 18 54.6 Q 14 51 13.5 45 Q 14.5 38 30 32.5" strokeWidth="1.05" />
          <path d="M 18.3 54.3 Q 14.4 50.8 14 45 Q 15 38 30.3 32.9" strokeWidth="0.4" opacity="0.45" />
          {/* lower-right wall */}
          <path d="M 46 54.6 Q 50 51 50.5 45 Q 49.5 38 34 32.5" strokeWidth="1.05" />
          <path d="M 45.7 54.3 Q 49.6 50.8 50 45 Q 49 38 33.7 32.9" strokeWidth="0.4" opacity="0.45" />

          {/* neck pinch — the slot between the bulbs */}
          <path d="M 30 31.5 Q 31.5 32 30 32.5" strokeWidth="0.7" />
          <path d="M 34 31.5 Q 32.5 32 34 32.5" strokeWidth="0.7" />

          {/* cross-hatched shading: right side of each bulb */}
          <g strokeWidth="0.32" opacity="0.5">
            <path d="M 45 13 L 47.5 17" />
            <path d="M 44 16 L 46.8 21" />
            <path d="M 43 19 L 46 24" />
            <path d="M 41.5 22 L 44.5 27" />
            <path d="M 39 25.5 L 42 29.5" />

            <path d="M 45 51 L 47.5 47" />
            <path d="M 44 48 L 46.8 43" />
            <path d="M 43 45 L 46 40" />
            <path d="M 41.5 42 L 44.5 37" />
            <path d="M 39 38.5 L 42 34.5" />
          </g>
          <g strokeWidth="0.28" opacity="0.32">
            <path d="M 43 16 L 47 16" />
            <path d="M 42 19.5 L 46.5 19.5" />
            <path d="M 40.5 23 L 45 23" />

            <path d="M 43 48 L 47 48" />
            <path d="M 42 44.5 L 46.5 44.5" />
            <path d="M 40.5 41 L 45 41" />
          </g>

        </g>

        {/* ── falling stream — outside the flip group so it always
            trickles vertically; gated to be visible only during the
            rest poses, not during the flip itself. ── */}
        <g className="hourglass-stream" fill="var(--color-rubric-deep)">
          <circle className="grain g1" cx="32" cy="32.5" r="0.85" />
          <circle className="grain g2" cx="32" cy="32.5" r="0.75" />
          <circle className="grain g3" cx="32" cy="32.5" r="0.85" />
          <circle className="grain g4" cx="32" cy="32.5" r="0.75" />
        </g>
      </svg>
    </div>
  );
}

/* ─────────────── 2 · Astrolabe ───────────────
   Behaves as a real planispheric astrolabe: the mater (outer body) and
   climate plate are fixed. Only the rete drifts slowly westward with
   celestial motion, and the alidade pivots faster like a scholar
   taking a sighting. */
export function AstrolabeSpinner({
  size = 56,
  className = "",
  label = "Loading",
}: CeremonialSpinnerProps) {
  const ticks = (count: number, rInner: number, rOuter: number) =>
    Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      return {
        key: i,
        x1: 28 + Math.cos(a) * rInner,
        y1: 28 + Math.sin(a) * rInner,
        x2: 28 + Math.cos(a) * rOuter,
        y2: 28 + Math.sin(a) * rOuter,
      };
    });

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <svg viewBox="0 0 56 56" width={size} height={size}>
        {/* mater — the fixed body with the degree limb */}
        <g className="astro-mater">
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="var(--color-gilt)"
            strokeWidth="0.9"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="var(--color-gilt)"
            strokeWidth="0.4"
            opacity="0.6"
          />
          {ticks(12, 22, 24).map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="var(--color-gilt)"
              strokeWidth="0.9"
            />
          ))}
        </g>

        {/* climate plate — also fixed, engraved coordinate ring */}
        <circle
          cx="28"
          cy="28"
          r="10"
          fill="none"
          stroke="var(--color-gilt-bright)"
          strokeWidth="0.7"
          opacity="0.85"
        />

        {/* rete — the only autonomous motion: drifts slowly with the sky */}
        <g className="astro-rete">
          <circle
            cx="28"
            cy="28"
            r="17"
            fill="none"
            stroke="var(--color-rubric)"
            strokeWidth="0.7"
            opacity="0.85"
          />
          {ticks(8, 14, 17).map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="var(--color-rubric)"
              strokeWidth="0.9"
            />
          ))}
          {/* a single star pointer — breaks symmetry so drift is visible */}
          <line
            x1="28"
            y1="13.4"
            x2="28"
            y2="15.5"
            stroke="var(--color-rubric)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="28" cy="12.4" r="1.3" fill="var(--color-rubric)" />
        </g>

        {/* alidade — sighting rule, pivots about the center */}
        <g className="astro-alidade">
          <line
            x1="18.5"
            y1="28"
            x2="37.5"
            y2="28"
            stroke="var(--color-rubric-deep)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* sights at each end (one larger, the foresight) */}
          <circle cx="37.5" cy="28" r="1.6" fill="var(--color-rubric-deep)" />
          <circle cx="18.5" cy="28" r="1.0" fill="var(--color-rubric-deep)" />
        </g>

        {/* hub — the pin that holds the whole assembly */}
        <circle cx="28" cy="28" r="2.2" fill="var(--color-gilt)" />
        <circle cx="28" cy="28" r="0.9" fill="var(--color-ink-brown)" />
      </svg>
    </div>
  );
}

/* ─────────────── 3 · Unfurling Scroll ───────────────
   A scroll unrolls horizontally to reveal a sigil, then re-rolls.
   Designed for inline use beside loading text. */
export function ScrollSpinner({
  width = 96,
  className = "",
  label = "Loading",
}: {
  width?: number;
  className?: string;
  label?: string;
}) {
  const height = Math.round((width / 96) * 32);
  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ width, height }}
      role="status"
      aria-label={label}
    >
      <svg
        viewBox="0 0 96 32"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* parchment, drawn at full size — animation scaleX from center */}
        <g className="scroll-parchment">
          <rect
            x="18"
            y="10"
            width="60"
            height="12"
            fill="var(--color-card-surface-gold)"
            stroke="var(--color-gilt)"
            strokeWidth="0.5"
          />
          {/* faint horizontal ruling */}
          <line
            x1="20"
            y1="16"
            x2="76"
            y2="16"
            stroke="var(--color-gilt)"
            strokeWidth="0.3"
            opacity="0.35"
          />
          {/* foxing */}
          <circle cx="34" cy="13" r="0.4" fill="var(--color-gilt)" opacity="0.4" />
          <circle cx="62" cy="19" r="0.5" fill="var(--color-gilt)" opacity="0.4" />
          {/* sigil revealed at peak */}
          <text
            x="48"
            y="19.4"
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-rubric)"
            fontFamily="var(--font-display)"
            fontWeight="600"
            className="scroll-glyph"
          >
            ✠
          </text>
        </g>

        {/* left roll, drawn at center, animates outward */}
        <g className="scroll-left">
          <rect
            x="44"
            y="6"
            width="4"
            height="20"
            rx="1.6"
            fill="var(--color-ink-brown)"
          />
          <line
            x1="46"
            y1="6"
            x2="46"
            y2="26"
            stroke="var(--color-gilt)"
            strokeWidth="0.4"
            opacity="0.6"
          />
          {/* wax ribbon hanging from the spindle */}
          <g className="scroll-ribbon">
            <line
              x1="46"
              y1="26"
              x2="46"
              y2="29.5"
              stroke="var(--color-rubric)"
              strokeWidth="0.9"
            />
            <circle cx="46" cy="30.2" r="1.2" fill="var(--color-rubric)" />
          </g>
        </g>

        {/* right roll, drawn at center, animates outward */}
        <g className="scroll-right">
          <rect
            x="48"
            y="6"
            width="4"
            height="20"
            rx="1.6"
            fill="var(--color-ink-brown)"
          />
          <line
            x1="50"
            y1="6"
            x2="50"
            y2="26"
            stroke="var(--color-gilt)"
            strokeWidth="0.4"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
