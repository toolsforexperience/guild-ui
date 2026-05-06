import { useCallback, useState } from 'react';

/**
 * Copy text to clipboard with a transient "copied" boolean that
 * auto-resets after `resetMs` milliseconds (default 2000).
 *
 * @returns `[copy, copied]`
 *   - `copy(text)` — writes text to clipboard and sets `copied = true`
 *   - `copied` — true for `resetMs` ms after a successful copy
 */
export function useCopyFeedback(resetMs = 2000): [(text: string) => void, boolean] {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(
        (text: string) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), resetMs);
            });
        },
        [resetMs]
    );

    return [copy, copied];
}
