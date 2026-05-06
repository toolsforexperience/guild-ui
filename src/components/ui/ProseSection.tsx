import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ProseSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}

/**
 * Lightweight prose section in the manuscript style: a rubric-red display
 * heading above body text. Unlike <Section />, no card chrome — pure prose.
 * Use for case studies, charters, long-form pages.
 */
export function ProseSection({
  title,
  children,
  className,
  as = "h2",
}: ProseSectionProps) {
  const Heading = as;
  const headingSize = as === "h2" ? "text-2xl" : "text-xl";
  return (
    <section className={cn("mt-12 leading-relaxed text-ink-100", className)}>
      <Heading
        className={cn(
          "font-display text-rubric mb-4 tracking-[0.04em]",
          headingSize,
        )}
      >
        {title}
      </Heading>
      {children}
    </section>
  );
}
