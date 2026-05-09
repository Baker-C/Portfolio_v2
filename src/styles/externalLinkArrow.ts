import { css } from 'styled-components';

export const EXTERNAL_LINK_ARROW_SRC = `${import.meta.env.BASE_URL}arrow.png`;

export const EXTERNAL_LINK_ARROW_LONG_SRC = `${import.meta.env.BASE_URL}arrow-long.png`;

/** Trailing `arrow.png` to the right of link text (inline-flex). */
export const externalLinkArrowTrailing = css`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;

  &::after {
    content: '';
    width: 0.85em;
    height: 0.85em;
    background-image: url(${EXTERNAL_LINK_ARROW_SRC});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
  }
`;

/** Trailing `arrow-long.png` to the right (points right with default asset orientation). */
export const externalLinkArrowLongTrailing = css`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;

  &::after {
    content: '';
    width: 1.35em;
    height: 0.55em;
    background-image: url(${EXTERNAL_LINK_ARROW_LONG_SRC});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
  }
`;

/** `::after` only — wide `arrow-long.png` stacked below text (rotated “down”). */
export const externalLinkArrowLongTrailingBlock = css`
  &::after {
    content: '';
    width: 1.2em;
    height: 0.5em;
    margin-top: 0.15em;
    background-image: url(${EXTERNAL_LINK_ARROW_LONG_SRC});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
    transform: rotate(90deg);
    transform-origin: center;
  }
`;

/** Underline draws left→right on hover, retracts on leave (::before — arrow keeps ::after). */
export const externalLinkUnderlineSlide = css`
  position: relative;
  padding-bottom: 2px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.85;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.32s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition-duration: 0.05s;
    }
  }
`;
