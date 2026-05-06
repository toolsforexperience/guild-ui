interface DetailRowProps {
    label: string;
    value: string;
    capitalize?: boolean;
}

export function DetailRow({ label, value, capitalize = true }: DetailRowProps) {
    return (
        <div className="flex justify-between">
            <dt className="text-muted">{label}</dt>
            <dd className={`font-medium text-primary ${capitalize ? 'capitalize' : ''}`}>{value}</dd>
        </div>
    );
}
