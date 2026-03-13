import type { Breakpoints } from './breakpoints';

/**
 * Responsive value: one value per breakpoint (mobile-first).
 * Use "default" for the base (smallest) size; optional "phone", "tablet", "wide" override at larger breakpoints.
 */
export type ResponsiveValue<T> = {
  default?: T;
  phone?: T;
  tablet?: T;
  wide?: T;
};

/** Breakpoint names in mobile-first order (default → phone → tablet → wide) */
export const RESPONSIVE_BREAKPOINT_ORDER = ['default', 'phone', 'tablet', 'wide'] as const;
export type ResponsiveBreakpointName = (typeof RESPONSIVE_BREAKPOINT_ORDER)[number];

/** Min-width in px for each breakpoint (default has no media query) */
export const RESPONSIVE_BREAKPOINT_MIN_WIDTH: Record<Exclude<ResponsiveBreakpointName, 'default'>, string> = {
  phone: '480px',
  tablet: '768px',
  wide: '1024px',
};

export function isResponsiveValue<T>(val: T | ResponsiveValue<T>): val is ResponsiveValue<T> {
  return typeof val === 'object' && val !== null && !Array.isArray(val) && ('default' in val || 'phone' in val || 'tablet' in val || 'wide' in val);
}

/** Resolve a numeric responsive value for a given viewport width (px). Breakpoint min-widths are parsed from e.g. "480px". */
export function resolveResponsiveNumber(
  val: ResponsiveValue<number>,
  widthPx: number,
  breakpoints: { phone: string; tablet: string; wide: string }
): number {
  const phone = parseInt(breakpoints.phone, 10) || 0;
  const tablet = parseInt(breakpoints.tablet, 10) || 0;
  const wide = parseInt(breakpoints.wide, 10) || 0;
  if (widthPx >= wide && val.wide != null) return val.wide;
  if (widthPx >= tablet && val.tablet != null) return val.tablet;
  if (widthPx >= phone && val.phone != null) return val.phone;
  return val.default ?? val.phone ?? val.tablet ?? val.wide ?? 32;
}

/**
 * Generates CSS custom properties with media queries for responsive theme tokens.
 * Use the returned CSS in a <style> tag; then use var(--category-key) in your theme.
 */
export function getResponsiveThemeCss(
  category: string,
  values: Record<string, string | ResponsiveValue<string>>,
  breakpoints: Breakpoints
): string {
  const lines: string[] = [];
  const bpMinWidth: Record<string, string> = {
    phone: breakpoints.phone,
    tablet: breakpoints.tablet,
    wide: breakpoints.wide,
  };

  for (const [key, val] of Object.entries(values)) {
    if (typeof val === 'string') continue;
    if (!isResponsiveValue(val)) continue;

    const varName = `--${category}-${key}`;
    const fallback =
      val.default ?? val.phone ?? val.tablet ?? val.wide;
    if (fallback != null) {
      lines.push(`  ${varName}: ${fallback};`);
    }

    for (const bp of ['phone', 'tablet', 'wide'] as const) {
      if (val[bp] == null) continue;
      const minWidth = bpMinWidth[bp];
      lines.push(`@media (min-width: ${minWidth}) { :root { ${varName}: ${val[bp]}; } }`);
    }
  }

  if (lines.length === 0) return '';
  const rootBlock = lines.filter((l) => !l.startsWith('@media')).join('\n');
  const mediaBlocks = lines.filter((l) => l.startsWith('@media'));
  return `:root {\n${rootBlock}\n}\n${mediaBlocks.join('\n')}`;
}

/**
 * Resolves a theme category object: replaces responsive values with var(--category-key).
 */
export function resolveResponsiveCategory<T extends Record<string, string | ResponsiveValue<string>>>(
  category: string,
  raw: T
): Record<keyof T, string> {
  const out = {} as Record<keyof T, string>;
  for (const [key, val] of Object.entries(raw) as [keyof T, string | ResponsiveValue<string>][]) {
    if (typeof val === 'string') {
      (out as Record<string, string>)[key as string] = val;
    } else if (isResponsiveValue(val)) {
      (out as Record<string, string>)[key as string] = `var(--${category}-${String(key)})`;
    }
  }
  return out;
}
