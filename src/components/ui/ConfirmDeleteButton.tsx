import { useEffect, useRef, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface Props {
    onConfirm: () => void;
    disabled?: boolean;
    title?: string;
    variant?: 'icon' | 'compact';
    className?: string;
}

export function ConfirmDeleteButton({ onConfirm, disabled, title = 'Delete', variant = 'icon', className }: Props) {
    const [confirming, setConfirming] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startConfirm = () => {
        setConfirming(true);
        timerRef.current = setTimeout(() => setConfirming(false), 3000);
    };

    const cancel = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setConfirming(false);
    };

    const confirm = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setConfirming(false);
        onConfirm();
    };

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    if (confirming) {
        return (
            <div className={cn('flex items-center gap-0.5', className)}>
                <button
                    onClick={confirm}
                    disabled={disabled}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 text-sm font-medium border border-rubric-deep bg-rubric text-parchment-100 hover:bg-rubric-deep transition-colors disabled:opacity-50"
                >
                    <Check size={11} />
                    Delete?
                </button>
                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={cancel}
                                aria-label="Cancel"
                                className="p-0.5 text-subtle hover-text-secondary transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={startConfirm}
                            disabled={disabled}
                            aria-label={title}
                            className={cn(
                                'flex items-center gap-1 px-2 py-0.5 text-sm font-medium text-muted hover:text-error border border-default hover:border-error transition-colors disabled:opacity-50',
                                className
                            )}
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{title}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={startConfirm}
                        disabled={disabled}
                        aria-label={title}
                        className={cn('p-1 text-subtle hover:text-error transition-colors', className)}
                    >
                        <Trash2 size={14} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
