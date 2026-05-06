import { forwardRef, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    clearable?: boolean;
    size?: 'sm' | 'md' | 'lg';
    containerClassName?: string;
}

const sizeConfig = {
    sm: {
        iconSize: 14,
        iconLeft: 'left-3',
        inputPadding: 'pl-9 pr-3 py-1.5 text-sm',
        clearRight: 'right-2.5',
    },
    md: {
        iconSize: 16,
        iconLeft: 'left-3.5',
        inputPadding: 'pl-11 pr-3 py-2 text-sm',
        clearRight: 'right-3',
    },
    lg: {
        iconSize: 18,
        iconLeft: 'left-4',
        inputPadding: 'pl-12 pr-4 py-2.5',
        clearRight: 'right-3',
    },
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value,
            onValueChange,
            placeholder = 'Search...',
            clearable = false,
            size = 'md',
            containerClassName = '',
            className = '',
            ...props
        },
        ref
    ) => {
        const config = sizeConfig[size];
        const showClear = clearable && value.length > 0;

        return (
            <div className={`relative ${containerClassName}`}>
                <Search
                    size={config.iconSize}
                    className={`absolute ${config.iconLeft} top-1/2 -translate-y-1/2 text-subtle pointer-events-none`}
                />
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={e => onValueChange(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search"
                    className={`w-full ${config.inputPadding} ${showClear ? 'pr-8' : ''} border border-default  bg-elevated text-primary placeholder:text-subtle transition-colors ${className}`}
                    {...props}
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={() => onValueChange('')}
                        className={`absolute ${config.clearRight} top-1/2 -translate-y-1/2 p-0.5 text-subtle hover-text-secondary transition-colors`}
                    >
                        <X size={config.iconSize - 2} />
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
