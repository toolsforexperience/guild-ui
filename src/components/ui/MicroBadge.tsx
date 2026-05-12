import type { ReactNode } from 'react';

interface MicroBadgeProps {
    children: ReactNode;
    variant?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';
    className?: string;
}

// Manuscript-tuned status variants — green/red/yellow share semantic tokens
// with CalloutBox. The historically-named "blue" variant uses verdigris
// (aged-copper pigment) so nothing on the page renders as browser blue;
// "purple" stays as a dusky rose lifted from the same palette.
const variantClasses: Record<NonNullable<MicroBadgeProps['variant']>, string> = {
    default: 'bg-sunken text-label border border-ink-brown/15',
    green: 'bg-success-subtle text-success border border-success',
    red: 'bg-error-subtle text-error border border-error',
    yellow: 'bg-warning-subtle text-warning border border-warning',
    blue: 'bg-verdigris-soft text-verdigris border border-verdigris/40 dark:bg-verdigris/20 dark:text-verdigris-dark dark:border-verdigris-dark/35',
    purple: 'bg-mauve-soft text-mauve border border-mauve/40 dark:bg-mauve/20 dark:text-mauve-dark dark:border-mauve-dark/35',
};

export function MicroBadge({ children, variant = 'default', className = '' }: MicroBadgeProps) {
    return (
        <span className={`text-sm font-medium px-1.5 py-0.5 ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
