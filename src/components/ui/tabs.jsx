import * as React from "react";
import { cn } from "@/lib/utils";

// Tabs Container component
const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

// Tab List component
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full flex-wrap text-sm font-medium text-center border-b dark:border-gray-700",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

// Tab Trigger component (the tabs themselves)
const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-block p-4 border-b-2 rounded-t-lg",
      active
        ? "text-primary border-primary"
        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

// Tab Content component
const TabsContent = React.forwardRef(({ className, active, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-b-lg p-4",
      active ? "block" : "hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };