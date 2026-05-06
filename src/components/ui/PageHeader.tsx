import { useEffect, type ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    /** Small category label above the title */
    category?: string;
    /** Subtitle below the title (alias: description) */
    subtitle?: string;
    /** Alias for subtitle */
    description?: string;
    /** Icon next to the title */
    icon?: ReactNode;
    /** Action elements on the right (alias: action for single element) */
    actions?: ReactNode;
    /** Alias for actions */
    action?: ReactNode;
    /** If set, document.title becomes `${title} — ${documentTitleSuffix}`; otherwise just `${title}`. */
    documentTitleSuffix?: string;
    className?: string;
}

export function PageHeader({ title, category, subtitle, description, icon, actions, action, documentTitleSuffix, className = '' }: PageHeaderProps) {
    useEffect(() => {
        document.title = documentTitleSuffix ? `${title} — ${documentTitleSuffix}` : title;
    }, [title, documentTitleSuffix]);

    const resolvedSubtitle = subtitle ?? description;
    const resolvedActions = actions ?? action;

    return (
        <header className={`mb-12 ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    {category && (
                        <p className="text-sm font-display tracking-[0.3em] text-rubric/75 mb-3">
                            {category}
                        </p>
                    )}
                    <h1 className="font-display font-semibold text-rubric tracking-[0.04em] text-4xl flex items-center gap-3">
                        {icon}
                        {title}
                    </h1>
                </div>
                {resolvedActions && <div>{resolvedActions}</div>}
            </div>
            {resolvedSubtitle && (
                <p className="mt-4 text-lg font-serif italic text-ink-brown/75 leading-relaxed max-w-2xl">
                    {resolvedSubtitle}
                </p>
            )}
        </header>
    );
}
