interface MenuDividerProps {
  className?: string;
  /** Width in svg units. The component still scales to the container width. */
  width?: number;
}

/**
 * Quiet section separator: a single hairline that fades to transparent at
 * both ends, with a tiny gilt diamond at center. The default rhythm marker
 * across the app — used in the sidebar menu and between page sections.
 */
export function MenuDivider({ className = "", width = 240 }: MenuDividerProps) {
  return (
    <div className={`px-3 ${className}`} role="separator" aria-hidden>
      <svg
        viewBox={`0 0 ${width} 6`}
        width="100%"
        height={6}
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="menu-rule-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3a2a18" stopOpacity="0" />
            <stop offset="0.2" stopColor="#3a2a18" stopOpacity="0.3" />
            <stop offset="0.5" stopColor="#3a2a18" stopOpacity="0.45" />
            <stop offset="0.8" stopColor="#3a2a18" stopOpacity="0.3" />
            <stop offset="1" stopColor="#3a2a18" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="2.5" width={width} height="1" fill="url(#menu-rule-fade)" />
        <g transform={`translate(${width / 2} 3) rotate(45)`}>
          <rect
            x="-1.4"
            y="-1.4"
            width="2.8"
            height="2.8"
            fill="var(--color-gilt)"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
}
