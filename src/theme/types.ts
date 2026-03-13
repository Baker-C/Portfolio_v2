import type { Breakpoints } from './breakpoints';
import type { Colors } from './colors';
import type { Fonts } from './fonts';
import type { Spacing } from './spacing';

/** Resolved theme spacing: all values are CSS strings (responsive tokens become var(--spacing-*)). */
export type ResolvedSpacing = { [K in keyof Spacing]: string };

export interface Theme {
  colors: Colors;
  fonts: Fonts;
  spacing: ResolvedSpacing;
  breakpoints: Breakpoints;
}
