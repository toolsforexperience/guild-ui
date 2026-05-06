import { cn } from '../../lib/utils';
import type { LabelHTMLAttributes, ReactNode } from 'react';

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

export function FieldLabel({ children, className, ...props }: FieldLabelProps) {
    return (
        <label
            className={cn('flex items-center gap-1.5 min-h-[1.25rem] text-sm font-medium text-label mb-1', className)}
            {...props}
        >
            {children}
        </label>
    );
}
