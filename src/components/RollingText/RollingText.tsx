import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/* -----------------------------------------------------------------------------
 * Styled components (theme-based)
 * ----------------------------------------------------------------------------- */
const RollingTextContainer = styled.div`
  overflow: hidden;
  width: 120%;
  height: 120px;
  transform: translateX(-10%);
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.black};
`;

const Strip = styled.div`
  display: flex;
  flex-direction: row;
  will-change: transform;
`;

const TextWrapper = styled.div`
  height: 100px;
  width: fit-content;
  white-space: nowrap;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  font-size: 100px;
  font-weight: ${(props) => props.theme.fonts.weights.black};
  letter-spacing: 0.02em;
  line-height: 1em;
  color: ${(props) => props.theme.colors.white};
`;

const TextItem = styled.span<{ $outlined?: boolean }>`
  margin-right: 30px;
  color: ${(props) =>
    props.$outlined ? props.theme.colors.black : props.theme.colors.white};
  -webkit-text-stroke: ${(props) =>
    props.$outlined ? `5px ${props.theme.colors.white}` : 'transparent'};
  paint-order: stroke fill;
`;

/* -----------------------------------------------------------------------------
 * Props
 * ----------------------------------------------------------------------------- */
export type RollingTextProps = {
  /** Text to display in a single row (repeated twice for the roll). Single string or list of strings. */
  text?: string | string[];
  /** Optional: speed multiplier for the roll (roughly 100px/s per 1). Default: 1. */
  speed?: number;
  /** Optional: whether to reverse direction of the roll. Default: false. */
  reverse?: boolean;
};

const defaultText = 'Rolling text…';

function renderContent(text: string | string[]) {
  if (Array.isArray(text)) {
    return text.map((item, i) => (
      <TextItem key={i} $outlined={i % 2 === 1}>
        {item}
      </TextItem>
    ));
  }
  return text;
}

export function RollingText({
  text = defaultText,
  speed = .5,
  reverse = false,
}: RollingTextProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const textKey = Array.isArray(text) ? text.join('\0') : text;

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const firstCopy = strip.firstElementChild as HTMLElement | null;
    if (!firstCopy) return;

    const copyWidth = firstCopy.offsetWidth;
    if (copyWidth <= 0) return;

    const pixelsPerSecond = speed * 100;
    const duration = copyWidth / pixelsPerSecond;

    function runCycle() {
      gsap.set(strip, { x: reverse ? -copyWidth : 0 });
      tweenRef.current = gsap.to(strip, {
        x: reverse ? 0 : -copyWidth,
        duration,
        ease: 'none',
        onComplete: () => {
          if (!strip) return;
          gsap.set(strip, { x: reverse ? copyWidth : 0 });
          if (reverse) {
            if (strip.lastElementChild && strip.firstElementChild) {
              strip.insertBefore(strip.lastElementChild, strip.firstElementChild);
            }
          } else {
            if (strip.firstElementChild) {
              strip.appendChild(strip.firstElementChild);
            }
          }
          runCycle();
        },
      });
    }

    runCycle();

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [textKey, speed, reverse]);

  return (
    <RollingTextContainer className="rolling-text">
      <Strip ref={stripRef} className="rolling-text-strip">
        <TextWrapper className="rolling-text-copy">{renderContent(text)}</TextWrapper>
        <TextWrapper className="rolling-text-copy">{renderContent(text)}</TextWrapper>
      </Strip>
    </RollingTextContainer>
  );
}
