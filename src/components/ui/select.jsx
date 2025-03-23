import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Create a context for the Select component
const SelectContext = createContext(null);

/**
 * Main component for the Select element
 * Manages state and provides context for child components
 */
const Select = ({ children, value, onValueChange, disabled }) => {
  // State for open/closed status
  const [isOpen, setIsOpen] = useState(false);
  
  // Callback to toggle dropdown state
  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  };
  
  // Callback to close the dropdown
  const close = () => setIsOpen(false);
  
  // Callback for value selection
  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
    close();
  };
  
  // Provide context
  const contextValue = {
    value,
    isOpen,
    toggleOpen,
    close,
    onValueChange: handleValueChange,
    disabled
  };
  
  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

/**
 * Trigger component (button to open the dropdown)
 */
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { toggleOpen, value, isOpen, disabled } = useContext(SelectContext);
  
  return (
    <button
      type="button"
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={toggleOpen}
      disabled={disabled}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

/**
 * Value component (displays the selected value)
 */
const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
  const { value } = useContext(SelectContext);
  
  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {value || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

/**
 * Content component (container for dropdown options)
 */
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, close } = useContext(SelectContext);
  const contentRef = useRef(null);
  
  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md mt-1 w-full",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

/**
 * Item component (individual option in dropdown)
 */
const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      <span className={cn("absolute left-2 flex h-3.5 w-3.5 items-center justify-center")}>
        {isSelected && (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };