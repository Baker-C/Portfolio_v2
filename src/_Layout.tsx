import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Hero, About, Projects, Contact } from './sections';
import { Name, Resume, SlidingMessage } from '@/components';

const SCROLL_IDLE_MS = 600;

const ScrollContainer = styled.div`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${props => props.theme.colors.black};
  /* Scrollbar: track transparent so BackgroundColors shows through (see index.css .scroll-container) */
`;

function Layout() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), SCROLL_IDLE_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <ScrollContainer
        ref={scrollRef}
        className={`scroll-container ${isScrolling ? 'scrolling' : ''}`}
      >
        <Name />
        <Resume />
        <Hero />

        <About />
        <Projects />
        <SlidingMessage />
        <Contact />
      </ScrollContainer>
      {/* <BackgroundColors scrollContainerRef={scrollRef} /> */}
    </>
  );
}

export default Layout;
