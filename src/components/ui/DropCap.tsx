import type { ReactNode } from "react";
import { DropCapFrame } from "../ornaments";

interface DropCapProps {
  /** The capital letter to illuminate. */
  letter: string;
  /** Body text that flows around it. */
  children: ReactNode;
  className?: string;
  /** "framed" wraps the cap in a knotwork box; "plain" is just a large red letter. */
  variant?: "framed" | "plain";
}

/**
 * Renders the first letter as an illuminated capital: large display font in
 * rubric red, optionally framed by a small knotwork square. Wrap a paragraph
 * to start a section in manuscript style.
 */
export function DropCap({
  letter,
  children,
  className = "",
  variant = "framed",
}: DropCapProps) {
  if (variant === "plain") {
    return (
      <p className={`dropcap font-serif text-ink-brown leading-relaxed ${className}`}>
        <span aria-hidden>{letter}</span>
        {children}
      </p>
    );
  }

  return (
    <p
      className={`font-serif text-ink-brown leading-relaxed ${className}`}
      style={{ overflow: "hidden" }}
    >
      <span
        className="float-left mr-3 mt-1 relative"
        style={{ width: 88, height: 88 }}
        aria-hidden
      >
        <DropCapFrame className="text-gilt absolute inset-0" size={88} />
        <span
          className="absolute inset-0 flex items-center justify-center font-display text-rubric"
          style={{ fontSize: 56, lineHeight: 1, paddingBottom: 4 }}
        >
          {letter}
        </span>
      </span>
      {children}
    </p>
  );
}
