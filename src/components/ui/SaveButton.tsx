import { Check, Loader2, RotateCcw, Stamp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SaveButtonProps {
    onClick: () => void;
    dirty: boolean;
    isPending: boolean;
    isSuccess: boolean;
    label?: string;
    pendingLabel?: string;
    successLabel?: string;
    onReset?: () => void;
    resetLabel?: string;
}

const PAPER_FILTER =
    'url(#parchment-deckle-card) drop-shadow(0 1px 1px rgba(40,25,10,0.10)) drop-shadow(1px 2px 3px rgba(40,25,10,0.08))';

const RUBRIC_FILTER =
    'url(#parchment-deckle-card) drop-shadow(0 1px 1px rgba(40,25,10,0.18)) drop-shadow(1px 2px 4px rgba(40,25,10,0.16))';

/**
 * Manuscript-styled save affordance: a rubric-inked parchment chit for
 * the primary action, a quieter parchment chit for the discard. Both
 * carry the same deckled paper edge as Card / Toggle so the buttons
 * read as cut paper, not as flat screen rectangles.
 */
export function SaveButton({
    onClick,
    dirty,
    isPending,
    isSuccess,
    label = 'Save',
    pendingLabel = 'Saving…',
    successLabel = 'Saved',
    onReset,
    resetLabel = 'Discard',
}: SaveButtonProps) {
    const disabled = !dirty || isPending;

    return (
        <div className="flex items-center justify-end gap-2">
            {isSuccess && !dirty && (
                <span className="flex items-center gap-1.5 font-display tracking-[0.18em] text-sm uppercase text-rubric/80">
                    <Check size={13} className="text-rubric" /> {successLabel}
                </span>
            )}

            {onReset && dirty && (
                <button
                    type="button"
                    onClick={onReset}
                    className={cn(
                        'group relative inline-flex items-center gap-1.5 px-3.5 py-1.5',
                        'font-display tracking-[0.14em] text-sm uppercase',
                        'text-ink-brown/85 hover:text-ink-brown',
                    )}
                >
                    <span
                        aria-hidden
                        className="absolute inset-0 border border-ink-brown/45 bg-chit transition-colors duration-150 group-hover:border-ink-brown/70 group-hover:bg-chit-hover"
                        style={{ filter: PAPER_FILTER }}
                    />
                    <RotateCcw size={13} className="relative" />
                    <span className="relative">{resetLabel}</span>
                </button>
            )}

            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    'group relative inline-flex items-center gap-1.5 px-4 py-1.5',
                    'font-display tracking-[0.14em] text-sm uppercase',
                    disabled
                        ? 'text-parchment-100/85 cursor-not-allowed'
                        : 'text-parchment-100',
                )}
            >
                <span
                    aria-hidden
                    className={cn(
                        'absolute inset-0 border transition-colors duration-150',
                        disabled
                            ? 'border-rubric-deep/35 bg-rubric-faded'
                            : 'border-rubric-darker bg-rubric group-hover:bg-rubric-deep',
                    )}
                    style={{ filter: disabled ? PAPER_FILTER : RUBRIC_FILTER }}
                />
                {isPending ? (
                    <>
                        <Loader2 size={13} className="relative animate-spin" />
                        <span className="relative">{pendingLabel}</span>
                    </>
                ) : (
                    <>
                        <Stamp size={13} className="relative" />
                        <span className="relative">{label}</span>
                    </>
                )}
            </button>
        </div>
    );
}
