import styled from 'styled-components';
import { RollingText, MouseLiquid } from '@/components';
import { theme } from '@/theme';

const Section = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.xxl};
  max-width: ${props => props.theme.spacing.maxWidth};
  margin: 120px auto;
`;

const SectionContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  align-items: stretch;
  gap: ${props => props.theme.spacing.xxl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageColumn = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
`;

const ImageFrame = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 100%;
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

const CornerBracket = styled.span<{ $position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 22px;
  height: 22px;
  border-color: ${props => props.theme.colors.theme};
  border-style: solid;
  border-width: 0;

  ${props => (props.$position === 'tl' || props.$position === 'tr') && 'top: 10px;'}
  ${props => (props.$position === 'bl' || props.$position === 'br') && 'bottom: 10px;'}
  ${props => (props.$position === 'tl' || props.$position === 'bl') && 'left: 10px;'}
  ${props => (props.$position === 'tr' || props.$position === 'br') && 'right: 10px;'}

  ${props => (props.$position === 'tl' || props.$position === 'bl') && 'border-left-width: 1px;'}
  ${props => (props.$position === 'tr' || props.$position === 'br') && 'border-right-width: 1px;'}
  ${props => (props.$position === 'tl' || props.$position === 'tr') && 'border-top-width: 1px;'}
  ${props => (props.$position === 'bl' || props.$position === 'br') && 'border-bottom-width: 1px;'}
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
`;

const BasicTagline = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 800;
  line-height: 1.1;
  color: ${props => props.theme.colors.white};
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
            <MouseLiquid
              image="/About_nbg_sm.png"
              dotColor={theme.colors.white}
              backgroundColor={theme.colors.black}
            />
            <CardImageOverlay />
            <CornerBracket $position="tl" />
            <CornerBracket $position="tr" />
            <CornerBracket $position="bl" />
            <CornerBracket $position="br" />
          </ImageFrame>
        </ImageColumn>
        <ContentContainer>
          <TaglineContainer>
            <FancyTagline>hello there,</FancyTagline>
            <BasicTagline> I'm Charles.</BasicTagline>
          </TaglineContainer>
          <TextContainer>
            <Paragraph>
              I work with React, React-Native, and MongoDB to build full-stack web and mobile applications.
            </Paragraph>
            <Paragraph>
              When I'm not coding, you'll find me creating games in Unreal, trying new recipes, or looking into new AI tools. I truly believe that continuous learning is the key to successful and meaningful work.
            </Paragraph>
          </TextContainer>
        </ContentContainer>
      </SectionContent>
    </Section>
  );
}

export default About;
