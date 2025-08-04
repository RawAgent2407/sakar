import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function that combines `clsx` and `tailwind-merge` to conditionally join class names
 * and resolve Tailwind CSS class conflicts.
 * 
 * @function
 * @param {...ClassValue[]} inputs - Class values to be combined and merged
 * @returns {string} A string of combined and deduplicated class names
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const className = cn('p-4', 'bg-blue-500', 'hover:bg-blue-600')
 * 
 * // With conditional classes
 * const isActive = true
 * const className = cn(
 *   'p-4 rounded',
 *   isActive ? 'bg-blue-500' : 'bg-gray-200',
 *   'text-white font-medium'
 * )
 * ```
 * 
 * @description
 * This function is particularly useful when working with Tailwind CSS as it:
 * - Combines multiple class name strings/objects/arrays
 * - Handles conditional class application
 * - Resolves Tailwind class conflicts (e.g., `p-2` vs `p-4`)
 * - Deduplicates class names
 * - Maintains proper class ordering for Tailwind's JIT compiler
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
