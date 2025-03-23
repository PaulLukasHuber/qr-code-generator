import React from "react";
import { cn } from "@/lib/utils";

/**
 * Switch component for toggling options
 * With dark mode support
 */
const Switch = React.forwardRef(({ 
  className, 
  checked = false,
  onCheckedChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-primary dark:bg-primary"
          : "bg-gray-200 dark:bg-gray-700",
        className
      )}
      onClick={() => !disabled && onCheckedChange(!checked)}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };