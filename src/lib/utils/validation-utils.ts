/**
 * Validation utility functions for form inputs and data
 */

/**
 * Validates if a string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates if a value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Validates if a value is within a specified range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string contains only letters and spaces
 */
export function isAlphaWithSpaces(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
} 