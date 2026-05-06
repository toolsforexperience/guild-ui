import type { ReactNode } from "react";
import { BorderKnot } from "../ornaments";

interface IlluminatedHeaderProps {
  children: ReactNode;
  /** Optional small italic line above the title — eyebrow / kicker. */
  eyebrow?: ReactNode;
  /** Optional subtitle below. */
  subtitle?: ReactNode;
  className?: string;
  /** When false, omits flanking knotwork strips for a cleaner look. */
  flanked?: boolean;
  as?: "h1" | "h2";
}

/**
 * Title block in the rubricated manuscript style: red display caps,
 * optionally flanked by short knotwork strips. Use as the page header
 * inside a <Charter />.
 */
export function IlluminatedHeader({
  children,
  eyebrow,
  subtitle,
  className = "",
  flanked = true,
  as = "h1",
}: IlluminatedHeaderProps) {
  const Heading = as;
  return (
    <header className={`text-center ${className}`}>
      {eyebrow && (
        <div className="font-insular italic text-ink-brown/60 text-sm tracking-wide mb-2">
          {eyebrow}
        </div>
      )}
      <div className="flex items-center justify-center gap-4">
        {flanked && (
          <BorderKnot
            className="text-rubric/70 hidden sm:block"
            width={72}
            height={20}
          />
        )}
        <Heading
          className={`font-display font-semibold text-rubric tracking-[0.04em] ${
            as === "h1" ? "text-4xl sm:text-5xl" : "text-3xl"
          }`}
        >
          {children}
        </Heading>
        {flanked && (
          <BorderKnot
            className="text-rubric/70 hidden sm:block"
            width={72}
            height={20}
            style={{ transform: "scaleX(-1)" }}
          />
        )}
      </div>
      {subtitle && (
        <div className="font-serif italic text-ink-brown/70 mt-3">{subtitle}</div>
      )}
    </header>
  );
}
