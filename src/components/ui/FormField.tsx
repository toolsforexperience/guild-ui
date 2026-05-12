import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { SimpleSelect } from './select';
import { FieldLabel } from './FieldLabel';

interface BaseFieldProps {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
    type?: 'text' | 'number' | 'email' | 'password';
    mono?: boolean;
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
    mono?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
    options: { value: string | number; label: string }[];
    value: string | number;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

const descriptionClasses = 'text-sm text-subtle mt-1';
const inputClasses =
    'w-full px-3 py-2 border border-strong bg-input text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-gilt/40 focus:border-gilt/70 transition-colors';

export function InputField({ id, label, description, icon, mono, className, ...props }: InputFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} className="mb-1.5">
                {icon}
                {label}
            </FieldLabel>
            <input id={id} className={`${inputClasses} ${mono ? 'font-serif' : ''} ${className ?? ''}`} {...props} />
            {description && <p className={descriptionClasses}>{description}</p>}
        </div>
    );
}

export function TextareaField({ id, label, description, icon, mono, className, ...props }: TextareaFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} className="mb-1.5">
                {icon}
                {label}
            </FieldLabel>
            <textarea
                id={id}
                className={`${inputClasses} resize-y text-sm ${mono ? 'font-serif' : ''} ${className ?? ''}`}
                {...props}
            />
            {description && <p className={descriptionClasses}>{description}</p>}
        </div>
    );
}

export function SelectField({
    id,
    label,
    description,
    icon,
    options,
    value,
    onValueChange,
    disabled,
    className,
}: SelectFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} className="mb-1.5">
                {icon}
                {label}
            </FieldLabel>
            <SimpleSelect
                value={String(value)}
                onValueChange={onValueChange}
                options={options.map(o => ({ value: String(o.value), label: o.label }))}
                {...(disabled !== undefined && { disabled })}
                {...(className !== undefined && { className })}
            />
            {description && <p className={descriptionClasses}>{description}</p>}
        </div>
    );
}
