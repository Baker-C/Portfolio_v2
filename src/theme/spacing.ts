import type { ResponsiveValue } from './responsive';

/** Spacing scale. Use a string for a fixed value or a ResponsiveValue to change per breakpoint. */
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  /** Responsive: e.g. 1rem on tablet, 3rem on laptop (wide) */
  xxl: {
    default: '1rem',
    tablet: '2rem',
    wide: '3rem',
  } as ResponsiveValue<string>,
  maxWidth: '1500px',
};

export type Spacing = typeof spacing;
