import { MovingBg, SwirlyArrow } from '@/components';
import {
  externalLinkArrowLongTrailing,
  externalLinkUnderlineSlide,
} from '@/styles/externalLinkArrow';
import { theme } from '@/theme';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const CONTACT_SECTION_ID = 'contact';
const CONTACT_ME_LABEL = 'Contact Me';

const contactArrowFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;


const BgContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 0;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 900px;
  height: auto;
  /* Allow rotated Contact control to extend past box; video lives in sibling BgContainer */
  overflow: visible;
  max-width: ${props => props.theme.spacing.maxWidth};
  margin: 0 auto;
  padding-bottom: ${props => props.theme.spacing.xxl};

  @media (max-width: 768px) {
    min-height: 100svh;
    min-height: 100dvh;
    padding-bottom: ${props => props.theme.spacing.xxl};
  }
`;

const ContentContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 60vh;
  left: 0;
  display: flex;
  width: fit-content;
  max-width: calc(100% - ${props => props.theme.spacing.md} * 2);
  height: fit-content;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    top: 50vh;
    left: 0;
    right: 0;
    padding-left: ${props => props.theme.spacing.xl};
    padding-right: ${props => props.theme.spacing.md};
    max-width: 100%;
    align-items: flex-start;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: fit-content;
  height: fit-content;
`;

const FancyTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.fancy};
  font-size: ${props => props.theme.fonts.sizes.maxl};
  font-weight: 500;
  line-height: 1;
  color: ${props => props.theme.colors.white};
  font-style: italic;

  @media (max-width: 768px) {
    font-size: clamp(2rem, 12vw, 3.75rem);
  }
`;

const BlockTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.maxl};
  font-weight: 800;
  line-height: 1;
  color: ${props => props.theme.colors.white};

  @media (max-width: 768px) {
    font-size: clamp(2rem, 12vw, 3.75rem);
  }
`;

const Tagline = styled.p`
  margin: 0;
  padding: 0;
  padding-left: 10px;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  font-style: italic;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.fonts.sizes.sm};
    padding-left: 0;
    margin-top: ${props => props.theme.spacing.md};
  }
`;

const Underline = styled.span`
  text-decoration: underline;
`;

const MotionTagline = motion(Tagline);
const MotionPageHeader = motion(PageHeader);

/** Not rotated — padding maps to real viewport side/bottom. Inner link handles rotateZ. */
const ContactMeOuter = styled.div`
  position: absolute;
  z-index: 2;
  top: 20vh;
  left: ${props => props.theme.spacing.xl};
  box-sizing: border-box;
  padding-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    left: ${props => props.theme.spacing.md};
    padding-bottom: max(${props => props.theme.spacing.lg}, env(safe-area-inset-bottom, 0px));
    /* Extra clearance from the left edge (padding is screen-axes, not rotated with the link). */
    padding-left: max(${props => props.theme.spacing.sm}, env(safe-area-inset-left, 0px));
  }
`;

const ContactMeLink = styled.a`
  position: relative;
  box-sizing: border-box;
  text-decoration: none;
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transform: rotateZ(90deg);
  transform-origin: top left;

  ${externalLinkArrowLongTrailing}
  ${externalLinkUnderlineSlide}

  &::after {
    opacity: 0;
    animation: ${contactArrowFadeIn} 0.22s ease forwards;
    animation-delay: ${`${4 + CONTACT_ME_LABEL.length * 0.05}s`};
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 20vh;
  right: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 230px;

  @media (max-width: 768px) {
    top: auto;
    bottom: max(12svh, ${props => props.theme.spacing.xxl});
    right: 50%;
    transform: translateX(50%);
    width: min(260px, calc(100vw - ${props => props.theme.spacing.md} * 2));
    align-items: center;
    text-align: center;
    flex-direction: column;
  }

  @media (max-width: 400px) {
    gap: ${props => props.theme.spacing.xs};
    bottom: max(4svh, ${props => props.theme.spacing.lg});
  }
`;

const ButtonText = styled.p`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  font-style: italic;
  margin: 0;
  width: fit-content;
`;

const StyledSwirlyArrow = styled(SwirlyArrow)`
  position: absolute;
  top: 0;
  right: 0;
  transform:
    rotate(0deg)
    translate(80%, -30%);
  transition: transform 0.8s ease-out;
  cursor: pointer;

  &:hover {
    transform:
      rotate(4deg)
      translate(75%, -29%)
      scale(1.05);
  }

  @media (max-width: 768px) {
    transform: rotate(0deg)
      translate(calc(45% + 25px), calc(-20% - 40px))
      scale(0.42);

    &:hover {
      transform: rotate(4deg)
        translate(calc(42% + 27px), calc(-18% - 50px))
        scale(0.44);
    }
  }

  /* Flex column: size the layout box — transform scale() still reserves the full 300px SVG box. */
  @media (max-width: 400px) {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    align-self: center;
    margin-top: 0;
    line-height: 0;
    width: 118px;
    height: 118px;
    flex-shrink: 0;
    transform: none;
    transform-origin: center center;

    & svg {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }

    &:hover {
      transform: rotate(4deg) scale(1.04);
    }
  }
`;

function Hero() {

  return (
    <>
    <Container>
      <ContactMeOuter>
        <ContactMeLink
          href={`#${CONTACT_SECTION_ID}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(CONTACT_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {Array.from(CONTACT_ME_LABEL).map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22, delay: 4 + index * 0.05, ease: 'easeOut' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </ContactMeLink>
      </ContactMeOuter>
      <ContentContainer>
        <MotionPageHeader
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, ease: 'easeInOut' }}
        >
          <FancyTitle>Full Stack</FancyTitle>
          <BlockTitle>Developer</BlockTitle>
          <MotionTagline
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 2.5, delay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Based in <Underline>San Francisco, CA</Underline>
          </MotionTagline>
        </MotionPageHeader>
      </ContentContainer>
      <ButtonsContainer>
        <ButtonText>
          In a rush?
        </ButtonText>
        <ButtonText>
          Skip to my projects
        </ButtonText>
        <StyledSwirlyArrow
          color={theme.colors.white}
          size={300}
          onClick={() =>
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </ButtonsContainer>
    </Container>
      <BgContainer>
        <MovingBg image="/bg-1.mp4" />
      </BgContainer>
    </>
  );
}

export default Hero;
