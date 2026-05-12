import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * Alternatives to the paper-slot Toggle. All keep the familiar
 * "horizontal track + thumb that slides" gesture so they read as
 * toggles at a glance — they only differ in materials and contour:
 *
 *   - InkMarkToggle  — typographic verdict ("Fiat / Vetat"); the
 *                       inactive word is struck through with a quill.
 *   - BeadToggle     — a bead strung on a hand-drawn cord, knotted
 *                       at each end. The bead slides between knots.
 *   - InkToggle      — the same slot+thumb form as Toggle, but the
 *                       slot is a hand-inked outline (not a CSS
 *                       border) and the thumb is an irregular wax
 *                       blob rather than a perfect rectangle.
 *
 * All three share the existing Toggle API so they are drop-in.
 */

interface ToggleBaseProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    size?: 'sm' | 'default';
    description?: string;
}

function ToggleRow({
    id,
    label,
    description,
    icon,
    children,
}: {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
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
            {children}
        </div>
    );
}

/* ─── InkMarkToggle ───────────────────────────────────────────────── */
/* Two words set side by side. The active one is underscored in rubric;
 * the inactive is crossed out with a wavering quill stroke. */

interface InkMarkToggleProps extends ToggleBaseProps {
    /** [affirmative, negative]. Defaults to ['Fiat', 'Vetat']. */
    words?: [string, string];
}

export function InkMarkToggle({
    id,
    checked,
    onChange,
    label,
    icon,
    disabled = false,
    description,
    words = ['Fiat', 'Vetat'],
}: InkMarkToggleProps) {
    const [yea, nay] = words;

    return (
        <ToggleRow id={id} label={label} description={description} icon={icon}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={checked ? yea : nay}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex items-baseline gap-2 px-1 py-0.5',
                    'font-display tracking-[0.06em] text-[15px] leading-none',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gilt/60',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                )}
            >
                <InkWord active={checked} text={yea} />
                <span aria-hidden className="font-serif italic text-ink-brown/35 px-0.5">
                    /
                </span>
                <InkWord active={!checked} text={nay} />
            </button>
        </ToggleRow>
    );
}

function InkWord({ active, text }: { active: boolean; text: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                'relative inline-block px-0.5 transition-colors duration-200',
                active ? 'text-rubric' : 'text-ink-brown/45',
            )}
        >
            {text}
            {/* underline (active) */}
            <svg
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                aria-hidden
                className={cn(
                    'pointer-events-none absolute left-0 right-0 -bottom-1 h-[6px] w-full overflow-visible',
                    'transition-opacity duration-200',
                    active ? 'opacity-100' : 'opacity-0',
                )}
            >
                <g
                    style={{ filter: 'url(#ink-wobble)' }}
                    fill="none"
                    stroke="#9a1f1a"
                    strokeLinecap="round"
                >
                    <path d="M2 4 Q 50 5.4 98 3.8" strokeWidth="1.6" />
                    <path
                        d="M2 4.4 Q 50 5.8 98 4.2"
                        strokeWidth="0.7"
                        opacity="0.45"
                    />
                </g>
            </svg>
            {/* strike (inactive) */}
            <svg
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                aria-hidden
                className={cn(
                    'pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] w-full overflow-visible',
                    'transition-opacity duration-200',
                    !active ? 'opacity-100' : 'opacity-0',
                )}
            >
                <g
                    style={{ filter: 'url(#ink-wobble)' }}
                    fill="none"
                    stroke="rgba(58,42,24,0.7)"
                    strokeLinecap="round"
                >
                    <path d="M0 4.2 Q 50 2.6 100 4.6" strokeWidth="1.4" />
                </g>
            </svg>
        </span>
    );
}

/* ─── BeadToggle ──────────────────────────────────────────────────── */
/* A wooden/bone bead strung on a horizontal cord, with small knots
 * pulled tight at either end. Off: bead at the left knot (parchment-
 * coloured bone). On: bead at the right knot (oxblood, lacquered).
 * The cord wavers slightly off true — drawn as two strokes (heavy +
 * lighter trace) under the ink-wobble filter. */

const beadSizeMap = {
    sm: {
        box: 'h-5 w-9',
        vw: 40,
        vh: 20,
        leftCx: 8,
        rightCx: 32,
        beadR: 5.6,
        knotR: 1.6,
    },
    default: {
        box: 'h-6 w-11',
        vw: 48,
        vh: 24,
        leftCx: 10,
        rightCx: 38,
        beadR: 6.6,
        knotR: 1.9,
    },
};

export function BeadToggle({
    id,
    checked,
    onChange,
    label,
    icon,
    disabled = false,
    size = 'default',
    description,
}: ToggleBaseProps) {
    const sz = beadSizeMap[size];
    const cy = sz.vh / 2;
    const travel = sz.rightCx - sz.leftCx;

    return (
        <ToggleRow id={id} label={label} description={description} icon={icon}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex items-center justify-center shrink-0',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt/60',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    sz.box,
                )}
            >
                <svg
                    viewBox={`0 0 ${sz.vw} ${sz.vh}`}
                    width="100%"
                    height="100%"
                    aria-hidden
                    className="overflow-visible"
                >
                    {/* cord — gentle S-curve, drawn twice for ink texture */}
                    <g
                        style={{ filter: 'url(#ink-wobble)' }}
                        fill="none"
                        strokeLinecap="round"
                    >
                        <path
                            d={`M ${sz.leftCx - 1} ${cy}
                                Q ${sz.vw * 0.35} ${cy + 0.7}
                                  ${sz.vw * 0.5} ${cy - 0.4}
                                T ${sz.rightCx + 1} ${cy}`}
                            stroke="rgba(58,42,24,0.7)"
                            strokeWidth="1.3"
                        />
                        <path
                            d={`M ${sz.leftCx - 1} ${cy + 0.4}
                                Q ${sz.vw * 0.35} ${cy + 1.1}
                                  ${sz.vw * 0.5} ${cy}
                                T ${sz.rightCx + 1} ${cy + 0.3}`}
                            stroke="rgba(58,42,24,0.45)"
                            strokeWidth="0.7"
                        />
                        {/* terminal knots — slightly heavier dots */}
                        <circle
                            cx={sz.leftCx - 2}
                            cy={cy}
                            r={sz.knotR}
                            fill="rgba(58,42,24,0.75)"
                        />
                        <circle
                            cx={sz.rightCx + 2}
                            cy={cy}
                            r={sz.knotR}
                            fill="rgba(58,42,24,0.75)"
                        />
                    </g>

                    {/* bead — translates between knots, fill colour eases */}
                    <g
                        style={{
                            transform: `translateX(${checked ? travel : 0}px)`,
                            transition: 'transform 280ms ease-out',
                        }}
                    >
                        {/* soft cast shadow under the bead */}
                        <ellipse
                            cx={sz.leftCx}
                            cy={cy + sz.beadR + 0.6}
                            rx={sz.beadR * 0.85}
                            ry={sz.beadR * 0.22}
                            fill="rgba(40,25,10,0.18)"
                        />
                        {/* bead body — slightly oval, hand-drawn outline */}
                        <ellipse
                            cx={sz.leftCx}
                            cy={cy}
                            rx={sz.beadR + 0.3}
                            ry={sz.beadR}
                            stroke={checked ? '#5a1410' : 'rgba(58,42,24,0.6)'}
                            strokeWidth="0.7"
                            fill={checked ? '#9a1f1a' : '#efdfb8'}
                            style={{
                                filter: 'url(#ink-wobble)',
                                transition: 'fill 280ms, stroke 280ms',
                            }}
                        />
                        {/* highlight catching the light */}
                        <ellipse
                            cx={sz.leftCx - sz.beadR * 0.35}
                            cy={cy - sz.beadR * 0.4}
                            rx={sz.beadR * 0.4}
                            ry={sz.beadR * 0.22}
                            fill={
                                checked
                                    ? 'rgba(255,220,195,0.45)'
                                    : 'rgba(255,255,255,0.6)'
                            }
                            style={{ transition: 'fill 280ms' }}
                        />
                        {/* bore-hole — the cord passes through here */}
                        <line
                            x1={sz.leftCx - sz.beadR * 0.55}
                            y1={cy + 0.2}
                            x2={sz.leftCx + sz.beadR * 0.55}
                            y2={cy + 0.2}
                            stroke="rgba(40,25,10,0.35)"
                            strokeWidth="0.5"
                        />
                    </g>
                </svg>
            </button>
        </ToggleRow>
    );
}

/* ─── InkToggle ───────────────────────────────────────────────────── */
/* The same slot+thumb form as Toggle, but neither edge is a CSS
 * border. The slot is a hand-inked capsule outline — two parallel
 * pen strokes drawn under the ink-wobble filter so the contour
 * trembles. The thumb is an irregular wax blob rather than a clean
 * rectangle, with a fleeting highlight. */

const inkSlotSizeMap = {
    sm: {
        box: 'h-5 w-9',
        vw: 36,
        vh: 20,
        thumbCx: 7,
        thumbR: 5.2,
        travel: 22,
    },
    default: {
        box: 'h-6 w-11',
        vw: 44,
        vh: 24,
        thumbCx: 8.5,
        thumbR: 6.4,
        travel: 27,
    },
};

export function InkToggle({
    id,
    checked,
    onChange,
    label,
    icon,
    disabled = false,
    size = 'default',
    description,
}: ToggleBaseProps) {
    const sz = inkSlotSizeMap[size];
    const cy = sz.vh / 2;

    // Hand-drawn capsule path: top-left → top edge → right cap → bottom →
    // left cap. Each stretch deviates a touch off true so the contour
    // doesn't read as a CSS rectangle.
    const r = sz.vh / 2 - 1;
    const left = 1;
    const right = sz.vw - 1;
    const top = 1;
    const bot = sz.vh - 1;
    const mid = sz.vw / 2;

    const slotPath = `
        M ${left + r} ${top}
        Q ${mid} ${top - 0.4} ${right - r} ${top + 0.2}
        Q ${right} ${top + 0.1} ${right} ${cy}
        Q ${right + 0.2} ${bot - 0.1} ${right - r} ${bot}
        Q ${mid} ${bot + 0.4} ${left + r} ${bot - 0.1}
        Q ${left} ${bot} ${left} ${cy}
        Q ${left - 0.2} ${top + 0.2} ${left + r} ${top}
        Z
    `;

    return (
        <ToggleRow id={id} label={label} description={description} icon={icon}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex items-center justify-center shrink-0',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt/60',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    sz.box,
                )}
            >
                <svg
                    viewBox={`0 0 ${sz.vw} ${sz.vh}`}
                    width="100%"
                    height="100%"
                    aria-hidden
                    className="overflow-visible"
                >
                    {/* slot — hand-inked capsule, double-stroked */}
                    <g style={{ filter: 'url(#ink-wobble)' }}>
                        <path
                            d={slotPath}
                            fill="#fbf3df"
                            stroke="rgba(58,42,24,0.65)"
                            strokeWidth="1.1"
                            strokeLinejoin="round"
                            style={{ transition: 'stroke 280ms' }}
                        />
                        {/* a faint trace of the same outline, slightly off — adds
                            the "drawn twice" quill quality */}
                        <path
                            d={slotPath}
                            fill="none"
                            stroke="rgba(58,42,24,0.35)"
                            strokeWidth="0.5"
                            strokeLinejoin="round"
                            transform="translate(0.4 0.3)"
                        />
                    </g>

                    {/* wax-blob thumb — irregular silhouette, slides between ends */}
                    <g
                        style={{
                            transform: `translateX(${checked ? sz.travel : 0}px)`,
                            transition: 'transform 280ms ease-out',
                        }}
                    >
                        <g style={{ filter: 'url(#ink-wobble)' }}>
                            {/* irregular blob, modelled on the WaxSeal silhouette
                                but shrunk to fit inside the slot */}
                            <path
                                d={`M ${sz.thumbCx} ${cy - sz.thumbR + 0.3}
                                    C ${sz.thumbCx + sz.thumbR * 0.85} ${cy - sz.thumbR + 0.1}
                                      ${sz.thumbCx + sz.thumbR + 0.3} ${cy - sz.thumbR * 0.4}
                                      ${sz.thumbCx + sz.thumbR + 0.1} ${cy + 0.2}
                                    C ${sz.thumbCx + sz.thumbR + 0.3} ${cy + sz.thumbR * 0.55}
                                      ${sz.thumbCx + sz.thumbR * 0.7} ${cy + sz.thumbR + 0.2}
                                      ${sz.thumbCx + 0.2} ${cy + sz.thumbR + 0.1}
                                    C ${sz.thumbCx - sz.thumbR * 0.7} ${cy + sz.thumbR + 0.3}
                                      ${sz.thumbCx - sz.thumbR - 0.3} ${cy + sz.thumbR * 0.55}
                                      ${sz.thumbCx - sz.thumbR - 0.1} ${cy - 0.1}
                                    C ${sz.thumbCx - sz.thumbR - 0.2} ${cy - sz.thumbR * 0.55}
                                      ${sz.thumbCx - sz.thumbR * 0.55} ${cy - sz.thumbR + 0.05}
                                      ${sz.thumbCx} ${cy - sz.thumbR + 0.3} Z`}
                                fill={checked ? '#9a1f1a' : '#f4ead0'}
                                stroke={checked ? '#5a1410' : 'rgba(58,42,24,0.6)'}
                                strokeWidth="0.7"
                                style={{ transition: 'fill 280ms, stroke 280ms' }}
                            />
                            {/* highlight crescent */}
                            <path
                                d={`M ${sz.thumbCx - sz.thumbR * 0.5} ${cy - sz.thumbR * 0.55}
                                    Q ${sz.thumbCx - 0.2} ${cy - sz.thumbR * 0.85}
                                      ${sz.thumbCx + sz.thumbR * 0.45} ${cy - sz.thumbR * 0.45}`}
                                fill="none"
                                stroke={
                                    checked
                                        ? 'rgba(255,220,195,0.55)'
                                        : 'rgba(255,255,255,0.7)'
                                }
                                strokeWidth="0.8"
                                strokeLinecap="round"
                                style={{ transition: 'stroke 280ms' }}
                            />
                        </g>
                    </g>
                </svg>
            </button>
        </ToggleRow>
    );
}
