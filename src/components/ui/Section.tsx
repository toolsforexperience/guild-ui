import type { ReactNode } from 'react';
import { SectionErrorBoundary } from '../ErrorBoundary';
import { CardHeader } from './CardHeader';
import { cn } from '../../lib/utils';

interface SectionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    headerAction?: ReactNode;
    className?: string;
    as?: 'h2' | 'h3';
}

export function Section({ title, icon, children, headerAction, className, as = 'h2' }: SectionProps) {
    return (
        <div className={cn('bg-elevated border border-default  p-6', className)}>
            <div className="flex items-center justify-between mb-4">
                <CardHeader icon={icon} as={as} className={as === 'h2' ? 'text-lg' : ''}>
                    {title}
                </CardHeader>
                {headerAction}
            </div>
            <SectionErrorBoundary sectionName={title.toLowerCase()}>{children}</SectionErrorBoundary>
        </div>
    );
}
