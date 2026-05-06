export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'inline' | 'centered' | 'fullPage';
    message?: string;
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-10 h-10 border-4',
};

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    return (
        <div
            className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin ${className}`}
        />
    );
}

export function LoadingSpinner({ size = 'md', variant = 'inline', message, className = '' }: LoadingSpinnerProps) {
    const spinner = <Spinner size={size} />;

    switch (variant) {
        case 'centered':
            return (
                <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
                    {spinner}
                    {message && <p className="text-muted mt-4">{message}</p>}
                </div>
            );

        case 'fullPage':
            return <div className={`flex items-center justify-center py-20 ${className}`}>{spinner}</div>;

        case 'inline':
        default:
            return (
                <span className={`inline-flex items-center gap-2 ${className}`}>
                    {spinner}
                    {message && <span className="text-muted">{message}</span>}
                </span>
            );
    }
}

export function Skeleton({
    width,
    height,
    className = '',
}: {
    width?: string | number;
    height?: string | number;
    className?: string;
}) {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return <div className={`animate-pulse bg-track ${className}`} style={style} />;
}

export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-elevated border border-default  p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
                <Skeleton height={24} width={128} />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="66%" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 4, className = '' }: { columns?: number; className?: string }) {
    return (
        <tr className={className}>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton height={16} width={i === 0 ? 120 : 80} />
                </td>
            ))}
        </tr>
    );
}
