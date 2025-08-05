// Utility functions for the astrology application
// This file provides a central export point for all utility functions
import { formatDate, parseDate, isValidDate, getCurrentDate } from './date-utils';
import { isNotEmpty, isValidNumber, isInRange, isValidEmail, isAlphaWithSpaces } from './validation-utils';
import { formatDegrees } from './chart-utils';

// Debounce utility function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export { formatDate, parseDate, isValidDate, getCurrentDate, isNotEmpty, isValidNumber, isInRange, isValidEmail, isAlphaWithSpaces, formatDegrees };