/**
 * A static pendant wax seal — aged oxblood wax with an irregular
 * pressed edge, a Latin circumscription around the rim, and a heraldic
 * device impressed in the inner field. Decorative only.
 */
export interface WaxSealProps {
  size?: number;
  /** Latin (or any) inscription that runs around the rim. */
  legend?: string;
  /** Single glyph impressed at the centre. Defaults to ✠ */
  device?: string;
  className?: string;
}

export function WaxSeal({
  size = 96,
  legend = "⚜ SIGILLVM · GVILDAE · MMXXVI ⚜",
  device = "⚜",
  className = "",
}: WaxSealProps) {
  // Irregular wax-blob path — used for shadow + body so the silhouette matches.
  const blob =
    "M 32 4 C 39 4 46 6.5 51 11.5 C 56 16 59 24 59.5 31 C 60 39 55.5 47 49.5 53 C 44 57.5 37 60 31 59.5 C 25 59 19 57 13 53 C 8 48 3.5 40 3.5 32 C 3 24 8 16 13.5 10.5 C 19 6.5 25 4 32 4 Z";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* circumscription path — slightly inside the rim */}
        <path
          id="wax-seal-legend"
          d="M 32 9.5 A 22.5 22.5 0 1 1 31.999 9.5"
          fill="none"
        />
      </defs>

      {/* cast shadow on the parchment */}
      <path
        d={blob}
        fill="var(--color-ink-brown)"
        opacity="0.3"
        transform="translate(1.2, 1.8)"
      />

      {/* main wax body — aged oxblood, matte */}
      <path d={blob} fill="var(--color-rubric-deep)" />

      {/* darker offset of the silhouette — implies the wax is thick */}
      <path
        d={blob}
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
        r="27"
        fill="none"
        stroke="var(--color-rubric)"
        strokeWidth="0.5"
        opacity="0.55"
      />

      {/* recessed inner field — slight darkening where the die pressed */}
      <circle cx="32" cy="32" r="18.5" fill="#000" opacity="0.18" />
      <circle
        cx="32"
        cy="32"
        r="18.5"
        fill="none"
        stroke="var(--color-rubric)"
        strokeWidth="0.4"
        opacity="0.5"
      />

      {/* circumscription — Latin legend along the rim */}
      <text
        fill="var(--color-rubric)"
        fontSize="3.8"
        fontFamily="var(--font-display)"
        fontWeight="600"
        letterSpacing="0.9"
        opacity="0.92"
      >
        <textPath href="#wax-seal-legend" startOffset="0">
          {legend}
        </textPath>
      </text>

      {/* pellets at the cardinal points */}
      <circle cx="32" cy="16.5" r="0.8" fill="var(--color-rubric)" opacity="0.7" />
      <circle cx="32" cy="47.5" r="0.8" fill="var(--color-rubric)" opacity="0.7" />
      <circle cx="16.5" cy="32" r="0.8" fill="var(--color-rubric)" opacity="0.7" />
      <circle cx="47.5" cy="32" r="0.8" fill="var(--color-rubric)" opacity="0.7" />

      {/* heraldic device — single glyph, impressed */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="22"
        fill="var(--color-rubric)"
        fontFamily="var(--font-display)"
        fontWeight="700"
        opacity="0.88"
      >
        {device}
      </text>
    </svg>
  );
}
