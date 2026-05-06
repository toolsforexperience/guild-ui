import { cn } from "../../lib/utils";

/**
 * Split a prose string on blank lines into an array of paragraphs.
 * Trims each paragraph and drops empties.
 */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

interface ParagraphsProps {
  /** Source prose. Paragraphs are separated by blank lines. */
  text: string;
  /** Skip the first N paragraphs (useful when the first one is rendered separately, e.g. inside a DropCap). */
  skip?: number;
  className?: string;
}

/**
 * Render a prose string as a series of <p> elements. Use when the source
 * content lives in a plain-text data field rather than JSX.
 */
export function Paragraphs({ text, skip = 0, className }: ParagraphsProps) {
  const visible = splitParagraphs(text).slice(skip);
  return (
    <>
      {visible.map((p, i) => (
        <p key={i} className={cn("mt-5 first:mt-0", className)}>
          {p}
        </p>
      ))}
    </>
  );
}
