/**
 * Shared style constants and helpers.
 * Use theme values via styled-components; this file is for non-theme shared values
 * (e.g. z-index scales, durations) if needed.
 */

export const zIndex = {
  base: 0,
  dropdown: 100,
  modal: 200,
  toast: 300,
} as const;

export const duration = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
} as const;
