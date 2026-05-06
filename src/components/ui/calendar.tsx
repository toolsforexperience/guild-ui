import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Manuscript-themed calendar. Built on react-day-picker v9, styled to sit
 * inside a parchment Popover or Card. Colors come from the manuscript
 * palette tokens; no corners — square cells in keeping with the
 * ledger feel.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 font-serif text-ink-brown", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center items-center h-9 relative",
        caption_label: "text-lg font-display tracking-wide text-rubric",
        nav: "flex items-center justify-between absolute inset-x-1 top-0 h-9",
        button_previous: cn(
          "inline-flex items-center justify-center h-7 w-7",
          "text-ink-brown/70 hover:text-rubric hover:bg-gilt/10",
          "transition-colors",
        ),
        button_next: cn(
          "inline-flex items-center justify-center h-7 w-7",
          "text-ink-brown/70 hover:text-rubric hover:bg-gilt/10",
          "transition-colors",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-ink-brown/55 w-9 text-sm font-display tracking-wider text-center",
        week: "flex w-full mt-1",
        day: cn(
          "relative w-9 h-9 p-0 text-center text-sm",
          "[&:has([aria-selected])]:bg-rubric/10",
        ),
        day_button: cn(
          "inline-flex items-center justify-center w-9 h-9",
          "font-serif text-ink-brown/85",
          "hover:bg-gilt/15 hover:text-rubric",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-gilt/60",
          "transition-colors",
          "aria-selected:bg-rubric aria-selected:text-parchment-100 aria-selected:hover:bg-rubric-deep",
        ),
        selected: "",
        today:
          "[&>button]:text-rubric [&>button]:font-semibold [&>button]:underline [&>button]:underline-offset-4 [&>button]:decoration-gilt/60",
        outside: "[&>button]:text-ink-brown/30",
        disabled: "[&>button]:text-ink-brown/25 [&>button]:line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...rest }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return (
            <Icon className={cn("h-4 w-4", chevronClassName)} {...rest} />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
