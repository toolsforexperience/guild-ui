import type { ReactNode } from 'react';

type CardHeaderVariant = 'default' | 'compact';

interface CardHeaderProps {
    children: ReactNode;
    icon?: ReactNode;
    variant?: CardHeaderVariant;
    as?: 'h2' | 'h3' | 'h4';
    className?: string;
}

const VARIANT_CLASSES: Record<CardHeaderVariant, string> = {
    default: 'font-semibold text-primary',
    compact: 'text-sm font-medium text-label',
};

export function CardHeader({ children, icon, variant = 'default', as: Tag = 'h3', className = '' }: CardHeaderProps) {
    return (
        <Tag className={`flex items-center gap-2 ${VARIANT_CLASSES[variant]} ${className}`}>
            {icon}
            {children}
        </Tag>
    );
}
