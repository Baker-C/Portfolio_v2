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

const BlurLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(200px);
  -webkit-backdrop-filter: blur(200px);
`;

const Orb = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
`;

const BackgroundColor1 = styled(Orb)`
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const BackgroundColor2 = styled(Orb)`
  top: 35%;
  left: 35%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const BackgroundColor3 = styled(Orb)`
  top: 65%;
  left: 65%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const BackgroundColor4 = styled(Orb)`
  top: 20%;
  left: 70%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const BackgroundColor5 = styled(Orb)`
  top: 80%;
  left: 20%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const BackgroundColor6 = styled(Orb)`
  top: 50%;
  left: 15%;
  margin-left: -150px;
  margin-top: -150px;
  background-color: ${props => props.theme.colors.theme};
`;

const MotionBackgroundColor1 = motion(BackgroundColor1);
const MotionBackgroundColor2 = motion(BackgroundColor2);
const MotionBackgroundColor3 = motion(BackgroundColor3);
const MotionBackgroundColor4 = motion(BackgroundColor4);
const MotionBackgroundColor5 = motion(BackgroundColor5);
const MotionBackgroundColor6 = motion(BackgroundColor6);

// Ellipse keyframes: x = a*cos(t), y = b*sin(t) at 8 steps for smooth loop
const ellipseKeyframes = (a: number, b: number) => {
  const steps = 9;
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * 2 * Math.PI;
    x.push(Math.round(a * Math.cos(t)));
    y.push(Math.round(b * Math.sin(t)));
  }
  return { x, y };
};

const orbit1 = ellipseKeyframes(140, 80);
const orbit2 = ellipseKeyframes(100, 120);
const orbit3 = ellipseKeyframes(90, 90);
const orbit4 = ellipseKeyframes(110, 70);
const orbit5 = ellipseKeyframes(80, 100);
const orbit6 = ellipseKeyframes(130, 60);

const orbitTransition = {
  duration: 24,
  repeat: Infinity,
  ease: 'linear' as const,
};

const MotionWrapper = motion(Wrapper);

type BackgroundColorsProps = {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
};

export function BackgroundColors({ scrollContainerRef }: BackgroundColorsProps) {
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '-50%']);

  return (
    <MotionWrapper style={{ y }}>
      {/* <MotionBackgroundColor1
        animate={{ x: orbit1.x, y: orbit1.y }}
        transition={orbitTransition}
      />
      <MotionBackgroundColor2
        animate={{ x: orbit2.x, y: orbit2.y }}
        transition={{ ...orbitTransition, duration: 20 }}
      />
      <MotionBackgroundColor3
        animate={{ x: orbit3.x, y: orbit3.y }}
        transition={{ ...orbitTransition, duration: 28 }}
      />
      <MotionBackgroundColor4
        animate={{ x: orbit4.x, y: orbit4.y }}
        transition={{ ...orbitTransition, duration: 22 }}
      />
      <MotionBackgroundColor5
        animate={{ x: orbit5.x, y: orbit5.y }}
        transition={{ ...orbitTransition, duration: 26 }}
      />
      <MotionBackgroundColor6
        animate={{ x: orbit6.x, y: orbit6.y }}
        transition={{ ...orbitTransition, duration: 30 }}
      />
      <BlurLayer /> */}
    </MotionWrapper>
  );
}
