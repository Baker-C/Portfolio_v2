import styled from 'styled-components';
import { RollingText, MouseLiquid } from '@/components';

const Section = styled.section`
  position: relative;
  width: 100%;
  max-width: min(${props => props.theme.spacing.maxWidth}, 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.xxl};
  margin: 0 auto 120px;
  padding: 0 ${props => props.theme.spacing.md};
  box-sizing: border-box;

  @media (min-width: 769px) {
    padding: 0;
  }
`;

const SectionContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(35vw, 1fr) minmax(0, 2fr);
  align-items: stretch;
  gap: ${props => props.theme.spacing.xxl};

  @media (min-width: 1025px) {
    column-gap: 5vw;
    row-gap: ${props => props.theme.spacing.xxl};
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageColumn = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: min(70vh, 800px);
  margin-top: calc(2 * ${props => props.theme.spacing.xxl});
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.theme};
  background: ${props => props.theme.colors.black};
  aspect-ratio: 1 / 2.39;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: ${props => props.theme.spacing.xl} 0;
`;

const CardImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5));
`;

const RollingTextContainer = styled.div`
  height: fit-content;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: ${props => props.theme.spacing.xl} 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transform: rotate(0deg);
  transform-origin: left center;
`;
const TaglineContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  z-index: 2;
`;

const FancyTagline = styled.h1`
  margin: 0;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  top: 0;
  left: 0;
  transform: translateX(-50%) translateY(-100%);
  font-family: ${props => props.theme.fonts.families.fancy};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 600;
  line-height: 1.1;
  color: ${props => props.theme.colors.white};
  font-style: italic;

  @media (max-width: 768px) {
    white-space: normal;
    position: relative;
    transform: none;
    left: auto;
    top: auto;
    font-size: ${props => props.theme.fonts.sizes.xxl};
    max-width: 100%;
  }
`;

const BasicTagline = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 800;
  line-height: 1.1;
  color: ${props => props.theme.colors.white};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.fonts.sizes.xxl};
    max-width: 100%;
    word-wrap: break-word;
  }
`;

const TextContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  max-width: 730px;
  gap: ${props => props.theme.spacing.lg};
`;

const Paragraph = styled.p`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: 400;
  line-height: 1.4;
  color: ${props => props.theme.colors.white};
  white-space: wrap;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.fonts.sizes.md};
  }
`;

function RollingTitle() {
  return (
    <RollingTextContainer>
      <RollingText
        text={["ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT"]}
        reverse={true}
      />
      <RollingText
        text={["ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT"]}
        reverse={false}
      />        
    </RollingTextContainer>
  );
}

function About() {
  return (
    <Section>
      <RollingTitle />
      <SectionContent>
        <ImageColumn>
          <ImageFrame>
            <MouseLiquid image="/About_nbg_2.png" />
            <CardImageOverlay />
          </ImageFrame>
        </ImageColumn>
        <ContentContainer>
          <TaglineContainer>
            <FancyTagline>hello there,</FancyTagline>
            <BasicTagline> I'm Charles.</BasicTagline>
          </TaglineContainer>
          <TextContainer>
            <Paragraph>
              I work with React, React-Native, and Express, Redis, and MongoDB.
            </Paragraph>
            <Paragraph>
              I code in order to make change happen. It's the reason I started this career and it's why I've spent countless hours building my skills. The amount of good and innovation one person can do with software skills, a good idea, and a computer is absolutely insurmountable.
            </Paragraph>
            <Paragraph>
              Thus, whether it is supporting globally recognized non-profits, or creating apps that will revolutionize industries, I will continue to develop.
            </Paragraph>
          </TextContainer>
        </ContentContainer>
      </SectionContent>
    </Section>
  );
}

export default About;
