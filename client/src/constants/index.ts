export const API_BASE = '/api';

export const DEBOUNCE_DELAY_MS = 300;

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-+()]+$/,
} as const;

export const PHONE_DIGIT_LIMITS = {
  MIN: 7,
  MAX: 15,
} as const;

export const DEFAULT_PAGE_SIZE = 10;
