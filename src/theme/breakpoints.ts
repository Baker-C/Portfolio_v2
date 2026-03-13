export const breakpoints = {
  phone: '480px',
  tablet: '768px',
  wide: '1024px',
} as const;

export type Breakpoints = typeof breakpoints;
