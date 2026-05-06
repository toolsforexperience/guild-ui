import type { ReactNode } from 'react';

interface MicroBadgeProps {
    children: ReactNode;
    variant?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';
    className?: string;
}

// Manuscript-tuned status variants — green/red/yellow share semantic tokens
// with CalloutBox; blue & purple are dusky tones inspired by the same palette.
const variantClasses: Record<NonNullable<MicroBadgeProps['variant']>, string> = {
    default: 'bg-sunken text-label border border-ink-brown/15',
    green: 'bg-success-subtle text-success border border-success',
    red: 'bg-error-subtle text-error border border-error',
    yellow: 'bg-warning-subtle text-warning border border-warning',
    blue: 'bg-[#dde0ea] text-[#3a4a6e] border border-[rgba(58,74,110,0.4)] dark:bg-[rgba(58,74,110,0.18)] dark:text-[#a8b3cf] dark:border-[rgba(168,179,207,0.35)]',
    purple: 'bg-[#e8d8de] text-[#5a2e4a] border border-[rgba(90,46,74,0.4)] dark:bg-[rgba(90,46,74,0.18)] dark:text-[#c9a8b8] dark:border-[rgba(201,168,184,0.35)]',
};

export function MicroBadge({ children, variant = 'default', className = '' }: MicroBadgeProps) {
    return (
        <span className={`text-sm font-medium px-1.5 py-0.5 ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
