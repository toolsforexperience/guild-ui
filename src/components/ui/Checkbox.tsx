import { type InputHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    indeterminate?: boolean;
};

/**
 * Paper checkbox: a small parchment square outlined in ink-brown. The
 * checked state isn't a fill — it's a rubric tick drawn over the box, the
 * way a scribe would mark a line with a quill. Indeterminate is a single
 * struck-through rubric stroke.
 */
export function Checkbox({ className, indeterminate, disabled, ...props }: CheckboxProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate ?? false;
    }, [indeterminate]);

    return (
        <span
            className={cn(
                'relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center align-middle',
                disabled && 'opacity-50',
                className,
            )}
        >
            <input
                ref={ref}
                type="checkbox"
                disabled={disabled}
                className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                {...props}
            />

            {/* parchment box: deckled edge + soft paper-on-paper shadow */}
            <span
                aria-hidden
                className={cn(
                    'absolute inset-0 border bg-chit',
                    'border-ink-brown/55',
                    'transition-colors duration-150',
                    'peer-hover:border-ink-brown/80 peer-hover:bg-chit-hover',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gilt/55',
                    'peer-checked:border-ink-brown/70',
                )}
                style={{
                    filter:
                        'url(#parchment-deckle-card) drop-shadow(0 1px 1px rgba(40,25,10,0.10)) drop-shadow(1px 2px 3px rgba(40,25,10,0.08))',
                }}
            />

            {/* rubric quill mark — checked: tick, indeterminate: a struck stroke.
                Both use the same red-ink color and the ink-wobble filter so the
                stroke wavers organically off perfect curves like a real nib.
                The tick draws itself in via stroke-dashoffset on toggle. */}
            <svg
                viewBox="0 0 18 18"
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 h-full w-full overflow-visible',
                    // checked: snap clip open instantly, then draw the stroke
                    // along the path (left→right). Pure quill-draw effect.
                    !indeterminate && [
                        'peer-checked:[&_path]:[clip-path:inset(0_0_0_0)]',
                        'peer-checked:[&_path]:[stroke-dashoffset:0]',
                        'peer-checked:[&_path]:[transition:clip-path_0ms,stroke-dashoffset_450ms_ease-out]',
                    ],
                )}
            >
                <g
                    style={{ filter: 'url(#ink-wobble)' }}
                    fill="none"
                    stroke="#9a1f1a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {indeterminate ? (
                        <>
                            <path d="M3.6 9.0 Q 9 9.6 14.4 8.9" strokeWidth="1.9" />
                            <path
                                d="M3.8 9.2 Q 9 9.8 14.2 9.1"
                                strokeWidth="1"
                                opacity="0.45"
                            />
                        </>
                    ) : (
                        <>
                            <path
                                pathLength={100}
                                d="M3.6 9.4 C 5.0 10.8, 6.4 11.9, 7.6 12.7 C 9.4 10.6, 11.4 8.0, 14.4 5.3"
                                strokeWidth="2"
                                strokeLinecap="butt"
                                className={cn(
                                    '[stroke-dasharray:100] [stroke-dashoffset:100]',
                                    // clipped fully from the LEFT at rest, so on exit the
                                    // scrub eats from the start (bottom-left of curve) toward
                                    // the right — opposite to a dashoffset tail-retract.
                                    '[clip-path:inset(0_0_0_100%)]',
                                    // exit: clip-path scrubs right→left; dashoffset snaps after,
                                    // so only the scrub is visible on the way out.
                                    '[transition:clip-path_260ms_ease-in,stroke-dashoffset_0ms_260ms]',
                                )}
                            />
                            <path
                                pathLength={100}
                                d="M3.8 9.5 C 5.1 10.9, 6.5 12.0, 7.6 12.6 C 9.5 10.7, 11.5 8.1, 14.2 5.5"
                                strokeWidth="0.9"
                                strokeLinecap="butt"
                                opacity="0.45"
                                className={cn(
                                    'under',
                                    '[stroke-dasharray:100] [stroke-dashoffset:100]',
                                    // clipped fully from the LEFT at rest, so on exit the
                                    // scrub eats from the start (bottom-left of curve) toward
                                    // the right — opposite to a dashoffset tail-retract.
                                    '[clip-path:inset(0_0_0_100%)]',
                                    '[transition:clip-path_260ms_ease-in,stroke-dashoffset_0ms_260ms]',
                                )}
                            />
                        </>
                    )}
                </g>
            </svg>
        </span>
    );
}
