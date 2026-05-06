import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ToggleProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    size?: 'sm' | 'default';
    description?: string;
}

const sizeMap = {
    sm: {
        track: 'h-5 w-9',
        thumb: 'h-3.5 w-3.5',
        on: 'translate-x-[18px]',
        off: 'translate-x-[2px]',
    },
    default: {
        track: 'h-6 w-11',
        thumb: 'h-[18px] w-[18px]',
        on: 'translate-x-[22px]',
        off: 'translate-x-[2px]',
    },
};

const PAPER_FILTER =
    'url(#parchment-deckle-card) drop-shadow(0 1px 1px rgba(40,25,10,0.10)) drop-shadow(1px 2px 3px rgba(40,25,10,0.08))';

const THUMB_FILTER =
    'url(#parchment-deckle-card) drop-shadow(0 1px 1px rgba(40,25,10,0.18)) drop-shadow(1px 1px 2px rgba(40,25,10,0.14))';

/**
 * Paper toggle: a parchment slot ruled in ink-brown holds a small token
 * that slides between two ends. Track and thumb both carry the parchment
 * deckle filter (same as Card) so their edges read as cut paper, not as
 * crisp screen shapes. ON state shows the token in rubric ink.
 */
export function Toggle({
    id,
    checked,
    onChange,
    label,
    icon,
    disabled = false,
    size = 'default',
    description,
}: ToggleProps) {
    const sz = sizeMap[size];

    return (
        <div className="flex items-center justify-between gap-3">
            <label
                htmlFor={id}
                className="flex items-center gap-1.5 font-serif text-sm text-ink-brown/85"
            >
                {icon}
                <span>
                    {label}
                    {description && (
                        <span className="block text-sm text-ink-brown/55">{description}</span>
                    )}
                </span>
            </label>

            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex shrink-0 items-center',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt/60',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    sz.track,
                )}
            >
                {/* deckled paper track */}
                <span
                    aria-hidden
                    className={cn(
                        'absolute inset-0 border bg-[#fbf3df] transition-colors duration-200',
                        checked ? 'border-[rgba(58,42,24,0.65)]' : 'border-[rgba(58,42,24,0.50)]',
                    )}
                    style={{ filter: PAPER_FILTER }}
                />

                {/* the sliding token, also deckled */}
                <span
                    aria-hidden
                    className={cn(
                        'relative inline-block border transition-transform duration-200 ease-out',
                        sz.thumb,
                        checked ? sz.on : sz.off,
                        checked
                            ? 'border-[#5a1410] bg-[#9a1f1a]'
                            : 'border-[rgba(58,42,24,0.55)] bg-[#f4ead0]',
                    )}
                    style={{ filter: THUMB_FILTER }}
                />
            </button>
        </div>
    );
}
