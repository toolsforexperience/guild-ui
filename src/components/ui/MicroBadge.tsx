import type { ReactNode } from 'react';

interface MicroBadgeProps {
    children: ReactNode;
    variant?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';
    className?: string;
}

// domain colors — status badge variants
const variantClasses: Record<NonNullable<MicroBadgeProps['variant']>, string> = {
    default: 'bg-sunken text-label',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function MicroBadge({ children, variant = 'default', className = '' }: MicroBadgeProps) {
    return (
        <span className={`text-sm font-medium px-1.5 py-0.5 ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
