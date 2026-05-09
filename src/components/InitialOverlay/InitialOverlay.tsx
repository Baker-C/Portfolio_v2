import { motion } from 'framer-motion';
import styled from 'styled-components';

const Pill = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  width: 130vw;
  height: 300vh;
  border-radius: 10000px;
  pointer-events: none;
  will-change: transform;
`;

const DarkPill = styled(Pill)`
  background-color: ${props => props.theme.colors.black};
  z-index: 10000;
`;

const LightPill = styled(Pill)`
  background-color: ${props => props.theme.colors.white};
  z-index: 9999;
`;

const MotionDarkPill = motion(DarkPill);
const MotionLightPill = motion(LightPill);

const DARK_ANIMATION = {
  initial: { transform: 'translate(-50%, -50%)' },
  animate: { transform: 'translate(-50%, 110%)' },
  transition: { duration: 3, ease: 'easeIn', delay: 0 },
} as const;

const LIGHT_ANIMATION = {
  initial: { transform: 'translate(-50%, -50%)' },
  animate: { transform: 'translate(-50%, 110%)' },
  transition: { duration: 2.5, ease: 'easeIn', delay: 0.5 },
} as const;

export function InitialOverlay() {
  return (
    <>
      <MotionDarkPill
        initial={DARK_ANIMATION.initial}
        animate={DARK_ANIMATION.animate}
        transition={DARK_ANIMATION.transition}
      />
      <MotionLightPill
        initial={LIGHT_ANIMATION.initial}
        animate={LIGHT_ANIMATION.animate}
        transition={LIGHT_ANIMATION.transition}
      />
    </>
  );
}
