/**
 * Google Fonts to load. Each entry is a family name optionally with axis
 * (e.g. wght, ital,wght). The app injects the stylesheet link automatically.
 * Use the same family names in families below.
 *
 * - Fancy: Noto Serif Display (all weights 100–900, normal + italic)
 * - Block: Inter Tight (weights 100–900)
 * - Basic: Work Sans (100–900 normal + italic)
 */
export const googleFonts = [
  'Noto Serif Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  'Inter Tight:wght@100;200;300;400;500;600;700;800;900',
  'Work Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
] as const;

export const fonts = {
  googleFonts,
  families: {
    /** Noto Serif Display – decorative serif, all weights and italic */
    fancy: '"Noto Serif Display", serif',
    /** Inter Tight – condensed display/block style (Google Fonts) */
    block: '"Inter Tight", sans-serif',
    /** Work Sans – readable sans for body and UI */
    basic: '"Work Sans", sans-serif',
    /** Alias for block – backward compatibility with heading usage */
    heading: '"Inter Tight", sans-serif',
  },
  sizes: {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
    maxl: '8rem',
  },
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

export type Fonts = typeof fonts;
