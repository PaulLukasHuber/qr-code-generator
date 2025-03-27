import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

// Enhanced slider component with proper keyboard accessibility
const Slider = React.forwardRef(({ className, ...props }, ref) => {
  // Handle keyboard interactions for accessibility
  const handleKeyDown = (e) => {
    // Only take action if we should handle this key
    if (props.disabled) return;
    
    // Get the current value and step
    const currentValue = Array.isArray(props.value) ? props.value[0] : props.value || 0;
    const step = props.step || 1;
    const min = props.min || 0;
    const max = props.max || 100;
    
    let newValue = currentValue;
    
    // Handle arrow keys
    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step);
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step);
        e.preventDefault();
        break;
      case 'Home':
        newValue = min;
        e.preventDefault();
        break;
      case 'End':
        newValue = max;
        e.preventDefault();
        break;
      case 'PageUp':
        newValue = Math.min(max, currentValue + step * 10);
        e.preventDefault();
        break;
      case 'PageDown':
        newValue = Math.max(min, currentValue - step * 10);
        e.preventDefault();
        break;
      default:
        return; // Don't handle other keys
    }
    
    // Only update if value changed
    if (newValue !== currentValue && props.onValueChange) {
      props.onValueChange([newValue]);
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      onKeyDown={handleKeyDown}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track 
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        // Add explicit keyboard instructions for screen readers
        aria-label={props['aria-label'] || 'Slider'}
        aria-valuetext={`${Array.isArray(props.value) ? props.value[0] : props.value || 0}${props.unit || ''}`}
        // Make it easier to find by adding data attributes
        data-focus-visible-added="true"
        data-testid="slider-thumb"
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }