/**
 * Date utility functions for astrology calculations
 */

/**
 * Formats a date to ISO string format
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parses a date string and returns a Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Validates if a date string is in a valid format
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Gets the current date in ISO format
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
} 