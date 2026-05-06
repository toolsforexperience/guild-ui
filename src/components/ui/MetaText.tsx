import type { ReactNode } from 'react';

interface MetaTextProps {
    children: ReactNode;
    className?: string;
    as?: 'span' | 'p' | 'div' | 'time';
    size?: 'xs' | 'sm';
}

const sizeClasses = { xs: 'text-sm', sm: 'text-sm' } as const;

export function MetaText({ children, className = '', as: Tag = 'span', size = 'xs' }: MetaTextProps) {
    return <Tag className={`${sizeClasses[size]} text-muted ${className}`}>{children}</Tag>;
}
