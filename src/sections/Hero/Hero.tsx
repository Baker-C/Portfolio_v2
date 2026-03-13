import { MovingBg, SwirlyArrow } from '@/components';
import { theme } from '@/theme';
import { motion } from 'framer-motion';
import styled from 'styled-components';


const BgContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 900px;
  overflow: hidden;
  max-width: ${props => props.theme.spacing.maxWidth};
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 600px;
  left: 0;
  display: flex;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
 `;

const BlockTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.maxl};
  font-weight: 800;
  line-height: 1;
  color: ${props => props.theme.colors.white};
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
`;

const Underline = styled.span`
  text-decoration: underline;
`;

const MotionTagline = motion(Tagline);

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
`;

function Hero() {

  return (
    <>
    <Container>
      <ContentContainer>
        <PageHeader>
          <FancyTitle>Full Stack</FancyTitle>
          <BlockTitle>Developer</BlockTitle>
          <MotionTagline
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 2.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Based in <Underline>San Francisco, CA</Underline>
          </MotionTagline>
        </PageHeader>
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
        <MovingBg
          image="/bg-1.mp4"
          dotColor={theme.colors.white}
          backgroundColor={theme.colors.black}
        />
      </BgContainer>
    </>
  );
}

export default Hero;
