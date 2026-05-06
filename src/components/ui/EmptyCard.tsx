import type { ReactNode } from 'react';

interface EmptyCardProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyCard({ icon, title, description, action, className = '' }: EmptyCardProps) {
    return (
        <div className={`text-center py-8 text-subtle ${className}`}>
            <div className="flex justify-center mx-auto mb-2 opacity-50">{icon}</div>
            <p className="text-sm">{title}</p>
            {description && <p className="text-sm mt-1">{description}</p>}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
