import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const BASE_NAME = 'charlesBaker';
const ALT_NAME = 'wicasaWiyukca';

const NameButton = styled.button<{ $showTooltip: boolean }>`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  left: ${props => props.theme.spacing.xxl};
  font-family: ${props => props.theme.fonts.families.block};
  font-weight: 800;
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.white};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 1000;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.spacing.xs};
  display: inline-flex;
  gap: 0.15em;

  &::after {
    content: 'My traditional name,\\A"Thoughtful warrior"\\AGiven to me by my father and grandmother';
    position: absolute;
    left: 0;
    top: calc(100% + 8px);
    width: 100%;
    box-sizing: border-box;
    opacity: 0;
    pointer-events: none;
    padding: 6px 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fonts.families.basic};
    font-size: ${props => props.theme.fonts.sizes.xs};
    font-weight: 500;
    white-space: pre-line;
    text-align: center;
    transition: opacity 160ms ease;
  }

  &:hover::after {
    opacity: ${props => (props.$showTooltip ? 1 : 0)};
  }
`;

const WordStack = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const WordLayer = styled.span`
  position: absolute;
  inset: 0;
  display: inline-flex;
  justify-content: center;
  white-space: pre;
`;

const WordSizer = styled.span`
  display: inline-block;
  opacity: 0;
  white-space: pre;
  user-select: none;
`;

const Letter = styled.span`
  display: inline-block;
  white-space: pre;
`;

export function Name() {
  const [isAlt, setIsAlt] = useState(false);
  const isAltRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const baseLetterRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);
  const altLetterRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);

  const letters = useMemo(() => {
    const maxLength = Math.max(BASE_NAME.length, ALT_NAME.length);
    return Array.from({ length: maxLength }, (_, index) => ({
      base: BASE_NAME[index] ?? ' ',
      alt: ALT_NAME[index] ?? ' ',
    }));
  }, []);

  useEffect(() => {
    gsap.set(baseLetterRefs.current[0] ?? [], { opacity: 1 });
    gsap.set(altLetterRefs.current[0] ?? [], { opacity: 0 });
  }, []);

  const handleClick = () => {
    if (isAnimatingRef.current) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const nextIsAlt = !isAltRef.current;
    isAltRef.current = nextIsAlt;
    isAnimatingRef.current = true;

    const outgoingLetters = (nextIsAlt ? baseLetterRefs.current : altLetterRefs.current)[0] ?? [];
    const incomingLetters = (nextIsAlt ? altLetterRefs.current : baseLetterRefs.current)[0] ?? [];

    gsap.killTweensOf(outgoingLetters);
    gsap.killTweensOf(incomingLetters);
    gsap.set(outgoingLetters, { opacity: 1 });
    gsap.set(incomingLetters, { opacity: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsAlt(nextIsAlt);
        isAnimatingRef.current = false;
      },
    });
    timeline.to(outgoingLetters, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.inOut',
      stagger: { each: 1 / Math.max(outgoingLetters.length - 1, 1), from: 'start' },
    }, 0);
    timeline.to(incomingLetters, {
      opacity: 1,
      duration: 0.2,
      ease: 'power1.inOut',
      stagger: { each: 1 / Math.max(incomingLetters.length - 1, 1), from: 'start' },
    }, 0);
  };

  return (
    <NameButton type="button" onClick={handleClick} aria-label="Toggle name text" aria-pressed={isAlt} $showTooltip={isAlt}>
      <WordStack>
        <WordSizer>{ALT_NAME}</WordSizer>
        <WordLayer>
          {letters.map((character, charIndex) => (
            <Letter
              key={`base-${charIndex}`}
              ref={(el) => {
                if (!baseLetterRefs.current[0]) baseLetterRefs.current[0] = [];
                baseLetterRefs.current[0][charIndex] = el;
              }}
            >
              {character.base}
            </Letter>
          ))}
        </WordLayer>
        <WordLayer>
          {letters.map((character, charIndex) => (
            <Letter
              key={`alt-${charIndex}`}
              ref={(el) => {
                if (!altLetterRefs.current[0]) altLetterRefs.current[0] = [];
                altLetterRefs.current[0][charIndex] = el;
              }}
            >
              {character.alt}
            </Letter>
          ))}
        </WordLayer>
      </WordStack>
    </NameButton>
  );
}
