import styled from 'styled-components';
import { MouseLiquid, RollingText } from '@/components';
import tools from '@/constants/tools';
import { theme } from '@/theme';

const Section = styled.section`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.spacing.xxl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RollingTextContainer = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} 0;
  margin-bottom: ${props => props.theme.spacing.xl};
  transform: rotate(5deg);
  transform-origin: left center;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${props => props.theme.spacing.xxl};
  padding: 0 ${props => props.theme.spacing.xl};
`;

const ProjectCard = styled.li`
  position: relative;
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${props => props.theme.spacing.lg};
  background: linear-gradient(145deg, rgba(18, 18, 20, 0.88), rgba(7, 7, 10, 0.88));
  border: 1px solid ${props => props.theme.colors.theme};
  padding: ${props => props.theme.spacing.lg};
  transition: border-color 220ms ease, box-shadow 220ms ease;

  &:hover {
    border-color: ${props => props.theme.colors.theme};
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1024px) {
    grid-column: span 12;
  }
`;

const ProjectTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: 400;
  line-height: 1.2;
  color: ${props => props.theme.colors.white};
`;

const CardImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.theme};
  background: ${props => props.theme.colors.black};
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

const StackRow = styled.p`
  margin: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.theme};
`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ProjectLink = styled.a`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.theme};
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkPlaceholder = styled.span`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.theme};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ProjectText = styled.p`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: 400;
  line-height: 1.6;
  color: ${props => props.theme.colors.theme};
`;

const projects = [
  {
    id: 0,
    title: 'EverBetter Medicine',
    description: 'Product and platform work for EverBetter Medicine, where I currently work as a Full Stack Developer.',
    image: '/About_nbg.png',
    liveUrl: 'https://everbetter.com/demos',
    linkText: 'View Product Demos',
    tools: [
      tools.typescript,
      tools.react,
      tools.reactNative,
      tools.mongodb,
      tools.nextjs,
      tools.githubActions,
      tools.jira,
    ]
  },
  {
    id: 1,
    title: 'Native Nuclear',
    description: 'Native Nuclear project website and product experience work for a modern nuclear-focused platform.',
    image: '/About_nbg_sm.png',
    liveUrl: 'https://nativenuclear.org',
    linkText: 'View Live Site',
    tools: [
      tools.react,
      tools.framer,
    ]
  },
  {
    id: 2,
    title: 'Oppenheimer Energy',
    description: 'Project website and frontend implementation for Oppenheimer Energy.',
    image: '/About_nbg.png',
    liveUrl: 'https://oppenheimer.energy',
    linkText: 'View Live Site',
    tools: [tools.react, tools.typescript, tools.tailwindCss]
  },
  {
    id: 3,
    title: 'Indigenous Database',
    description: 'Non-profit project for Oyate Learning to search and compile Indigenous literature resources.',
    image: '/About.JPG',
    liveUrl: null,
    linkText: 'View Github',
    tools: [tools.react, tools.mongodb, tools.nodejs, tools.express, tools.mongoose]
  },
  {
    id: 4,
    title: 'Nuclear NY',
    description: 'Public-facing web experience supporting nuclear education and outreach in New York.',
    image: '/bg-1.mp4',
    liveUrl: 'https://nuclearny.org',
    linkText: 'View Live Site',
    tools: [tools.javascript, tools.html, tools.css, tools.webflow]
  },
  {
    id: 5,
    title: 'Nuclear Symposium',
    description: 'Conference/event website focused on program information, messaging, and stakeholder communication.',
    image: '/About_nbg_sm.png',
    liveUrl: 'https://nuclearsymposium.com',
    linkText: 'View Live Site',
    tools: [tools.javascript, tools.html, tools.css, tools.webflow]
  },
];

const PROJECTS_SECTION_ID = 'projects';

function RollingTitle() {
  return (
    <RollingTextContainer>
      <RollingText
        text={["PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS"]}
        reverse={true}
      />
      <RollingText
        text={["PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS"]}
        reverse={false}
      />
    </RollingTextContainer>
  );
}

function Projects() {
  return (
    <Section id={PROJECTS_SECTION_ID}>
      <RollingTitle />
      <List>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <CardImageFrame>
              <MouseLiquid
                image={project.image}
                dotColor={theme.colors.theme}
                backgroundColor={theme.colors.black}
                control={{
                  options: {
                    emitDensityScale: 9000,
                    emitVelocityScale: 1.4,
                    fadeOutDensityRate: 0.58,
                  },
                }}
              />
              <CardImageOverlay />
              <CornerBracket $position="tl" />
              <CornerBracket $position="tr" />
              <CornerBracket $position="bl" />
              <CornerBracket $position="br" />
            </CardImageFrame>
            <ProjectTitle>{project.title}</ProjectTitle>
            {project.tools?.length ? (
              <StackRow>{project.tools.map(tool => tool.name).join(' / ')}</StackRow>
            ) : null}
            <ProjectText>{project.description}</ProjectText>
            <LinkRow>
              {project.liveUrl ? (
                <ProjectLink href={project.liveUrl} target="_blank" rel="noreferrer">
                  {project.linkText}
                </ProjectLink>
              ) : (
                <LinkPlaceholder>{project.linkText}</LinkPlaceholder>
              )}
            </LinkRow>
          </ProjectCard>
        ))}
      </List>
    </Section>
  );
}

export default Projects;
