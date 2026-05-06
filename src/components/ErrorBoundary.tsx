/**
 * React Error Boundary - Catches rendering errors and displays fallback UI
 *
 * Error Boundary Hierarchy (use innermost that fits):
 * 1. InlineErrorBoundary - For small UI elements (lists, cards, individual data displays)
 * 2. SectionErrorBoundary - For page sections that can fail independently
 * 3. ErrorBoundary - For page-level errors or critical failures
 *
 * Pattern: Wrap the smallest unit that can meaningfully recover from an error.
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle, AlertCircle, RefreshCw, Home, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useCopyFeedback } from '../hooks/useCopyFeedback';

// =============================================================================
// Shared functional helpers
// =============================================================================

function CopyDetailsButton({ error, errorInfo }: { error: Error; errorInfo: React.ErrorInfo | null }) {
    const [copy, copied] = useCopyFeedback();

    const handleCopy = () => {
        const text = [
            `Error: ${error.name}: ${error.message}`,
            '',
            'Stack Trace:',
            error.stack ?? 'No stack trace available',
            '',
            'Component Stack:',
            errorInfo?.componentStack ?? 'No component stack available',
        ].join('\n');
        copy(text);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-sm text-error transition-colors"
        >
            {copied ? (
                <>
                    <Check size={12} />
                    Copied!
                </>
            ) : (
                <>
                    <Copy size={12} />
                    Copy error details
                </>
            )}
        </button>
    );
}

// =============================================================================

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    override render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="max-w-lg w-full">
                        <div className="bg-elevated border border-default  p-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-subtle mb-4">
                                <AlertTriangle className="w-8 h-8 text-error" />
                            </div>

                            <h2 className="text-2xl font-semibold text-primary mb-2">Something went wrong</h2>

                            <p className="text-secondary mb-6">
                                An unexpected error occurred while rendering this page.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                                <button
                                    onClick={this.handleReset}
                                    className="inline-flex items-center justify-center gap-2  bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
                                >
                                    <RefreshCw size={16} />
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="inline-flex items-center justify-center gap-2  border border-default bg-elevated px-4 py-2 text-sm font-medium text-primary"
                                >
                                    <RefreshCw size={16} />
                                    Reload Page
                                </button>
                                <button
                                    onClick={this.handleGoHome}
                                    className="inline-flex items-center justify-center gap-2  border border-default bg-elevated px-4 py-2 text-sm font-medium text-primary"
                                >
                                    <Home size={16} />
                                    Go Home
                                </button>
                            </div>

                            {this.state.error && (
                                <div className="text-left">
                                    <button
                                        onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                                        className="flex items-center gap-2 text-sm text-muted hover-text-label w-full justify-center mb-2"
                                    >
                                        {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {this.state.showDetails ? 'Hide' : 'Show'} error details
                                    </button>

                                    {this.state.showDetails && (
                                        <div className="bg-sunken  p-4 text-left overflow-auto max-h-64">
                                            <p className="text-sm font-medium text-error mb-2">
                                                {this.state.error.name}: {this.state.error.message}
                                            </p>
                                            {this.state.errorInfo?.componentStack && (
                                                <pre className="text-sm text-secondary whitespace-pre-wrap font-serif">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// =============================================================================
// Section Error Boundary
// =============================================================================

interface SectionErrorProps extends Props {
    sectionName?: string;
}

type SectionErrorState = State;

/**
 * Section-level error boundary for independent page sections.
 * Use this for cards, panels, or groups of related UI elements.
 */
export class SectionErrorBoundary extends Component<SectionErrorProps, SectionErrorState> {
    constructor(props: SectionErrorProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
    }

    static getDerivedStateFromError(error: Error): Partial<SectionErrorState> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        console.error(
            `[SectionErrorBoundary${this.props.sectionName ? `: ${this.props.sectionName}` : ''}]`,
            error,
            errorInfo
        );
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    };

    toggleDetails = () => {
        this.setState(s => ({ showDetails: !s.showDetails }));
    };

    override render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { sectionName = 'section' } = this.props;
            const { error, errorInfo, showDetails } = this.state;

            return (
                <div className=" border border-error bg-error-subtle overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-error">Failed to load {sectionName}</p>
                                {error && <p className="text-sm text-error mt-1">{error.message}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={this.toggleDetails}
                                    className="p-1.5 text-error transition-colors"
                                    title={showDetails ? 'Hide details' : 'Show details'}
                                >
                                    {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <button
                                    onClick={this.handleReset}
                                    className="p-1.5 text-error transition-colors"
                                    title="Try again"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {showDetails && error && (
                        <div className="border-t border-error p-4 space-y-3">
                            <div>
                                <div className="text-sm font-medium text-error mb-1">Error</div>
                                <div className="text-sm text-error font-serif break-all">
                                    {error.name}: {error.message}
                                </div>
                            </div>

                            {error.stack && (
                                <div>
                                    <div className="text-sm font-medium text-error mb-1">Stack Trace</div>
                                    <pre className="text-sm text-error font-serif whitespace-pre-wrap break-all max-h-40 overflow-auto bg-error-subtle p-2">
                                        {error.stack}
                                    </pre>
                                </div>
                            )}

                            {errorInfo?.componentStack && (
                                <div>
                                    <div className="text-sm font-medium text-error mb-1">Component Stack</div>
                                    <pre className="text-sm text-error font-serif whitespace-pre-wrap break-all max-h-40 overflow-auto bg-error-subtle p-2">
                                        {errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}

                            <CopyDetailsButton error={error} errorInfo={errorInfo} />
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

// =============================================================================
// Inline Error Boundary
// =============================================================================

interface InlineErrorProps {
    children: ReactNode;
    name?: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

type InlineErrorState = State;

/**
 * Inline error boundary for the smallest UI elements.
 * Use this for individual cards, list items, data displays, etc.
 *
 * @example
 * ```tsx
 * <InlineErrorBoundary name="member card">
 *   <MemberCard member={member} />
 * </InlineErrorBoundary>
 * ```
 */
export class InlineErrorBoundary extends Component<InlineErrorProps, InlineErrorState> {
    constructor(props: InlineErrorProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
    }

    static getDerivedStateFromError(error: Error): Partial<InlineErrorState> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        console.error(`[InlineErrorBoundary${this.props.name ? `: ${this.props.name}` : ''}]`, error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    };

    toggleDetails = () => {
        this.setState(s => ({ showDetails: !s.showDetails }));
    };

    override render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { name = 'element' } = this.props;
            const { error, errorInfo, showDetails } = this.state;

            return (
                <div className=" border border-error bg-error-subtle text-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2">
                        <AlertCircle size={14} className="text-error flex-shrink-0" />
                        <span className="text-error flex-1 min-w-0 truncate">Failed to render {name}</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={this.toggleDetails}
                                className="p-1 text-error transition-colors"
                                title={showDetails ? 'Hide details' : 'Show details'}
                            >
                                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <button
                                onClick={this.handleReset}
                                className="p-1 text-error transition-colors"
                                title="Retry"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>
                    </div>

                    {showDetails && error && (
                        <div className="border-t border-error">
                            <div className="px-3 py-2 space-y-2">
                                <div>
                                    <div className="text-sm font-medium text-error mb-1">Error</div>
                                    <div className="text-sm text-error font-serif break-all">
                                        {error.name}: {error.message}
                                    </div>
                                </div>

                                {error.stack && (
                                    <div>
                                        <div className="text-sm font-medium text-error mb-1">Stack Trace</div>
                                        <pre className="text-sm text-error font-serif whitespace-pre-wrap break-all max-h-32 overflow-auto bg-error-subtle p-2">
                                            {error.stack}
                                        </pre>
                                    </div>
                                )}

                                {errorInfo?.componentStack && (
                                    <div>
                                        <div className="text-sm font-medium text-error mb-1">Component Stack</div>
                                        <pre className="text-sm text-error font-serif whitespace-pre-wrap break-all max-h-32 overflow-auto bg-error-subtle p-2">
                                            {errorInfo.componentStack}
                                        </pre>
                                    </div>
                                )}

                                <CopyDetailsButton error={error} errorInfo={errorInfo} />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
