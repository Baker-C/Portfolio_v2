import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Hero, About, Projects, Timeline, Contact } from './sections';
import { InitialOverlay, Name, Resume } from '@/components';

const SCROLL_IDLE_MS = 600;

const ScrollContainer = styled.div`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: clip;
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3, ease: 'easeInOut' }}
        >
          <Name />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3, ease: 'easeInOut' }}
        >
          <Resume />
        </motion.div>
        <Hero />

        <About />
        <Projects />
        <Timeline />
        <Contact />
      </ScrollContainer>
      <InitialOverlay />
      {/* <BackgroundColors scrollContainerRef={scrollRef} /> */}
    </>
  );
}

export default Layout;
