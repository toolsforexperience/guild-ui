import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { cn } from '../../lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    children: ReactNode;
}

export function IconButton({ label, children, className, ...props }: IconButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    aria-label={label}
                    className={cn(
                        'inline-flex items-center justify-center  p-1.5 text-muted transition-colors hover-text-primary hover-surface disabled:opacity-50',
                        className
                    )}
                    {...props}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
