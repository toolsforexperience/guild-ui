import type { ReactNode } from 'react';

export const VARIANTS = {
    info: {
        box: 'bg-info-subtle border-info',
        label: 'text-info',
        title: 'text-info',
        body: 'text-info',
        icon: 'text-info',
    },
    warning: {
        box: 'bg-warning-subtle border-warning',
        label: 'text-warning',
        title: 'text-warning',
        body: 'text-warning',
        icon: 'text-warning',
    },
    success: {
        box: 'bg-success-subtle border-success',
        label: 'text-success',
        title: 'text-success',
        body: 'text-success',
        icon: 'text-success',
    },
    error: {
        box: 'bg-error-subtle border-error',
        label: 'text-error',
        title: 'text-error',
        body: 'text-error',
        icon: 'text-error',
    },
} as const;

export type CalloutBoxVariant = keyof typeof VARIANTS;

interface CalloutBoxProps {
    variant: CalloutBoxVariant;
    label?: string;
    icon?: ReactNode;
    title?: string;
    children?: ReactNode;
    className?: string;
    padding?: 'sm' | 'md';
}

export function CalloutBox({ variant, label, icon, title, children, className, padding = 'md' }: CalloutBoxProps) {
    const s = VARIANTS[variant];
    const p = padding === 'sm' ? 'p-3' : 'p-4';

    return (
        <div className={` border ${p} ${s.box}${className ? ` ${className}` : ''}`}>
            {label && <p className={`text-sm font-semibold tracking-wider mb-1.5 ${s.label}`}>{label}</p>}
            {icon !== undefined || title !== undefined ? (
                <div className="flex items-start gap-2">
                    {icon && <div className={`flex-shrink-0 mt-0.5 ${s.icon}`}>{icon}</div>}
                    <div>
                        {title && <p className={`text-sm font-medium ${s.title}`}>{title}</p>}
                        {children && <div className={s.body}>{children}</div>}
                    </div>
                </div>
            ) : (
                children && <div className={s.body}>{children}</div>
            )}
        </div>
    );
}
