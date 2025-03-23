import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to combine class names
 * Uses clsx for conditional classes and twMerge to handle Tailwind conflicts
 * 
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Combined and deduped class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}