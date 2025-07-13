import { vi } from 'vitest';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Don't mock fetch for integration tests - we want to test actual API calls
// global.fetch = vi.fn();

// Setup any global test utilities here
export {}; 