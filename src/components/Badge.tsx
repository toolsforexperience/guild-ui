export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "ink" | "outline";
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  className = "" 
}: BadgeProps) {
  const variants = {
    default: "bg-ink-brown/[0.06] text-ink-brown/80",
    gold: "bg-gilt/10 text-gilt border border-gilt/40",
    ink: "bg-ink-brown text-parchment-100",
    outline: "border border-ink-brown/25 text-ink-brown/80",
  };

  return (
    <span
      className={`text-sm font-display uppercase tracking-[0.12em] px-2 py-1 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

