import { CelticDivider } from "../ornaments";

interface KnotDividerProps {
  className?: string;
  tone?: "rubric" | "gilt" | "ink";
  width?: number;
}

/**
 * Section break with a small triquetra at the center, flanked by short rules.
 * Drop-in replacement for <hr /> on ceremonial pages.
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
        ? "text-ink-brown/40"
        : "text-rubric/80";
  return (
    <div
      className={`flex justify-center my-8 ${toneClass} ${className}`}
      role="separator"
    >
      <CelticDivider width={width} height={32} />
    </div>
  );
}
