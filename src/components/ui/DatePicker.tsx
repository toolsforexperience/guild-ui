import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../../lib/utils";

interface DatePickerProps {
  /** Form field name. Submitted as ISO yyyy-MM-dd. */
  name: string;
  /** Initial selected date. */
  defaultValue?: Date;
  /** Controlled value. Pass null to clear. */
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Earliest selectable date. */
  fromDate?: Date;
  /** Latest selectable date. */
  toDate?: Date;
}

/**
 * Manuscript-themed date picker. Triggers a popover containing the shadcn
 * Calendar; submits the selection as an ISO date string via a hidden input
 * so it works inside a normal HTML <form>.
 */
export function DatePicker({
  name,
  defaultValue,
  value,
  onChange,
  placeholder = "Select a date",
  disabled,
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Date | undefined>(
    defaultValue,
  );
  const selected = isControlled ? (value ?? undefined) : internal;

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
  };

  const submitValue = selected ? format(selected, "yyyy-MM-dd") : "";

  return (
    <>
      <input type="hidden" name={name} value={submitValue} />
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-3 px-4 py-2",
              "bg-parchment-100/60 border border-gilt/35",
              "font-serif text-sm text-ink-brown",
              "hover:border-gilt/70 focus:outline-none focus:border-gilt/70",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              !selected && "text-ink-brown/55",
              className,
            )}
          >
            <CalendarIcon className="h-4 w-4 text-gilt/80" />
            {selected ? format(selected, "PPP") : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            startMonth={fromDate}
            endMonth={toDate}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
