import { breakpoints } from './breakpoints';
import { colors } from './colors';
import { fonts } from './fonts';
import { spacing as rawSpacing } from './spacing';
import { getResponsiveThemeCss, resolveResponsiveCategory } from './responsive';
import type { Theme } from './types';

const spacing = resolveResponsiveCategory('spacing', rawSpacing);

export const theme: Theme = {
  colors,
  fonts,
  spacing,
  breakpoints,
};

/** Inject this in a <style> tag so responsive theme tokens (e.g. spacing.xxl) update per breakpoint. */
export function getResponsiveSpacingCss(): string {
  return getResponsiveThemeCss('spacing', rawSpacing, breakpoints);
}

export { breakpoints, colors, fonts, rawSpacing as spacing };
export { resolveResponsiveNumber } from './responsive';
export type { Theme } from './types';
export type { Breakpoints } from './breakpoints';
export type { Colors } from './colors';
export type { Fonts } from './fonts';
export type { Spacing } from './spacing';
export type { ResponsiveValue } from './responsive';
