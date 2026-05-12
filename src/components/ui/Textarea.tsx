import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(
            'w-full px-3 py-2 border border-strong bg-input text-primary text-sm resize-y placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-gilt/40 focus:border-gilt/70 transition-colors',
            className
        )}
        {...props}
    />
));

Textarea.displayName = 'Textarea';
