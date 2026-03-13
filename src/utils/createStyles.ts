/**
 * Utility for composing named CSS class modules.
 * Use with CSS Modules (e.g. Component.module.css) for scoped, named classes.
 */

export type ClassNames = string | undefined | null | false;

/**
 * Combines class names from CSS modules and conditional classes.
 * Usage: createStyles(styles.container, isActive && styles.active)
 */
export function createStyles(...classes: ClassNames[]): string {
  return classes.filter(Boolean).join(' ');
}
