import styled from 'styled-components';
import { RollingText, MouseLiquid } from '@/components';
import { theme } from '@/theme';

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.xxl};
  max-width: ${props => props.theme.spacing.maxWidth};
  margin: 120px auto;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: ${props => props.theme.spacing.xxl};
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 800px;
  width: 600px;
  overflow: visible;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  max-width: 40%;
`;

const RollingTextContainer = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const BlockTagline = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 400;
  line-height: 1.1;
  color: ${props => props.theme.colors.white};
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
        text={["ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT"]}
        reverse={true}
      />
      <RollingText
        text={["ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT", "ABOUT"]}
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
        <ImageWrapper>
            <MouseLiquid
              image="/About_nbg_sm.png"
              dotColor={theme.colors.white}
              backgroundColor={theme.colors.black}

            />
        </ImageWrapper>
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
