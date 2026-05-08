import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

function calculateTopOffset(index: number, progress: number): number {
  const baseOffsetPx = 100 + (index * 5);
  const multiplier = Math.max(0, 1 - progress / 0.5);
  const offset = (index + 1) * baseOffsetPx * multiplier;
  return offset;
  
}

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const SlidingContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  align-items: center;
  overflow: hidden;
`;

const SlidingTrack = styled.div<{ $progress: number }>`
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  transform: translateX(${props => (1 - 2 * props.$progress) * 100}%);
  will-change: transform;
`;

const Character = styled.div<{ $marginTop: number }>`
  position: sticky;
  left: 0;
  transform: translateY(${props => props.$marginTop}px);
  flex-shrink: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.maxl};
  font-weight: ${props => props.theme.fonts.weights.normal};
  line-height: 1;
  color: ${props => props.theme.colors.white};
`;

export type SlidingMessageProps = {
  text: string;
};

export function SlidingMessage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const scrollRange = sectionHeight - windowHeight;
      if (scrollRange <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const value = Math.min(1, Math.max(0, scrolled / scrollRange));
      setProgress(value);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const characters = Array.from(TEXT);

  return (
    <Section ref={sectionRef}>
      <SlidingContainer>
        <SlidingTrack $progress={progress}>
          {characters.map((char, index) => (
              <Character
                key={`${index}-${char}`}
                $marginTop={calculateTopOffset(index, progress)}
              >
                {char}
              </Character>
            ))}
          </SlidingTrack>
      </SlidingContainer>
    </Section>
  );
}
