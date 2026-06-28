import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 300vh;
  z-index: -1;
  background-color: ${props => props.theme.colors.black};
`;

const MotionWrapper = motion(Wrapper);

type BackgroundColorsProps = {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
};

export function BackgroundColors({ scrollContainerRef }: BackgroundColorsProps) {
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '-50%']);

  return <MotionWrapper style={{ y }} />;
}
