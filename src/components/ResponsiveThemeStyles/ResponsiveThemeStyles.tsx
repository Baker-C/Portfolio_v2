import { getResponsiveSpacingCss } from '@/theme';

/**
 * Injects CSS custom properties for responsive theme tokens (e.g. spacing.xxl per breakpoint).
 * Mount once inside ThemeProvider so theme values used in styled-components update on resize.
 */
export function ResponsiveThemeStyles() {
  const css = getResponsiveSpacingCss();
  if (!css) return null;
  return <style data-responsive-theme>{css}</style>;
}
