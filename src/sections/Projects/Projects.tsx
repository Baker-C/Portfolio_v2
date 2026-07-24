import styled from 'styled-components';
import { MouseLiquid, RollingText } from '@/components';
import tools from '@/constants/tools';
import { externalLinkArrowTrailing, externalLinkUnderlineSlide } from '@/styles/externalLinkArrow';
import { theme } from '@/theme';

type ToolEntry = (typeof tools)[keyof typeof tools];

type SideProject = {
  kind: 'side';
  id: number;
  title: string;
  description: string;
  image: string;
  liveUrl: string | null;
  linkText: string;
  tools: ToolEntry[];
  /** Plain status text: no link, no hover affordance */
  isComingSoon?: boolean;
};

type MainProjectLink = { label: string; href: string };

type MainProject = {
  kind: 'main';
  id: number;
  title: string;
  description: string;
  image: string;
  tools: ToolEntry[];
  links: MainProjectLink[];
};

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
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 0 ${props => props.theme.spacing.md};
    gap: ${props => props.theme.spacing.xl};
  }
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
  transition: border-color 220ms ease;

  @media (max-width: 1024px) {
    grid-column: span 12;
  }
`;

const MainProjectCard = styled.li`
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, rgba(18, 18, 20, 0.88), rgba(7, 7, 10, 0.88));
  border: 1px solid ${props => props.theme.colors.theme};
  padding: ${props => props.theme.spacing.lg};
  transition: border-color 220ms ease;
`;

const MainProjectInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${props => props.theme.spacing.xl};

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: stretch;
  }
`;

const MainImageColumn = styled.div`
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 280px;

  @media (min-width: 900px) {
    min-height: 320px;
  }
`;

const MainInfoColumn = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
`;

const ProjectTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: 400;
  line-height: 1.2;
  color: ${props => props.theme.colors.white};
  overflow-wrap: anywhere;

  @media (max-width: 640px) {
    font-size: ${props => props.theme.fonts.sizes.xl};
  }
`;

const IMAGE_SIDE_MARGIN = (props: { theme: { spacing: { xs: string } } }) =>
  props.theme.spacing.xs;

const CardImageFrame = styled.div`
  position: relative;
  width: auto;
  max-width: 100%;
  margin-left: ${IMAGE_SIDE_MARGIN};
  margin-right: ${IMAGE_SIDE_MARGIN};
  height: 260px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.theme};
  background: ${props => props.theme.colors.black};
`;

const MainCardImageFrame = styled(CardImageFrame)`
  flex: 1;
  height: auto;
  min-height: 280px;

  @media (min-width: 900px) {
    min-height: 320px;
  }
`;

const CardImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5));
`;

const StackRow = styled.p`
  margin: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.white};
`;

const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
`;

const ProjectLink = styled.a`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  ${externalLinkArrowTrailing}
  ${externalLinkUnderlineSlide}
`;

const LinkPlaceholder = styled.span`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.white};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ComingSoonNote = styled.span`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.white};
  letter-spacing: 0.02em;
  cursor: default;
`;

const ProjectText = styled.p`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: 400;
  line-height: 1.6;
  color: ${props => props.theme.colors.white};
`;

const EVERBETTER_PRO_RECORDED_DEMO_URL =
  'https://app.guidde.com/share/playbooks/rVH7Vk1Y8hTZ5MgByuTmYz';

/** Public asset: `public/Social Media Agents.png` */
const SOCIAL_MEDIA_AGENTS_IMAGE = '/Social%20Media%20Agents.png';

/** Public asset: `public/Everbetter Pro Screenshot.png` */
const EVERBETTER_PRO_IMAGE = '/Everbetter%20Pro%20Screenshot.png';

/** Public asset: `public/Everbetter Me Screenshot.png` */
const EVERBETTER_ME_IMAGE = '/Everbetter%20Me%20Screenshot.png';

const EVERBETTER_ME_APPLICATION_OVERVIEW_URL =
  'https://app.guidde.com/share/playbooks/fwyavreJMSUgo4qT57XacC';

const EVERBETTER_ME_APPLE_STORE_URL =
  'https://apps.apple.com/us/app/everbetter-me/id6746877620';

/** Public asset: `public/Native Nuclear Screenshot.png` */
const NATIVE_NUCLEAR_IMAGE = '/Native%20Nuclear%20Screenshot.png';

/** Public asset: `public/Oppenheimer Energy Screenshot.png` */
const OPPENHEIMER_ENERGY_IMAGE = '/Oppenheimer%20Energy%20Screenshot.png';

/** Public asset: `public/Indigenous Database Screenshot.png` */
const INDIGENOUS_DATABASE_IMAGE = '/Indigenous%20Database%20Screenshot.png';

/** Public asset: `public/Nuclear Screenshot.png` */
const NUCLEAR_IMAGE = '/Nuclear%20Screenshot.png';

/** Public asset: `public/Nuclear NY Screenshot.png` */
const NUCLEAR_NY_IMAGE = '/Nuclear%20NY%20Screenshot.png';

const mainProjects: MainProject[] = [
  {
    kind: 'main',
    id: 7,
    title: "Solomon's Swarm",
    description:
      "Developed Solomon's Swarm, a platform of autonomous AI agents that run social media accounts end-to-end — generating, scheduling, and posting content on their own. Built a FastAPI and RavenDB backend with an in-process scheduler, OAuth2 account binding, and a champion/challenger learning loop where agents score their own posts and self-rewrite their pipelines and personas to improve over time, all driven from a React operator dashboard.",
    image: SOCIAL_MEDIA_AGENTS_IMAGE,
    tools: [
      tools.python,
      tools.react,
      tools.typescript,
      tools.docker,
    ],
    links: [],
  },
  {
    kind: 'main',
    id: 0,
    title: 'Everbetter Pro',
    description:
      'Full-stack developer of EverBetter Pro, a multi-tenant clinician-facing web app for managing health clinics in perfect balance with AI. Architected and improved a microservice monorepo backend powered by MongoDB, NATS, and Redis.',
    image: EVERBETTER_PRO_IMAGE,
    tools: [
      tools.typescript,
      tools.react,
      tools.reactNative,
      tools.mongodb,
      tools.nextjs,
      tools.githubActions,
      tools.jira,
    ],
    links: [
      { label: 'Product Overview', href: EVERBETTER_PRO_RECORDED_DEMO_URL },
      { label: 'Company Page', href: 'https://everbetter.com/' },
    ],
  },
  {
    kind: 'main',
    id: 1,
    title: 'Everbetter Me',
    description:
      'Full-stack developer of EverBetter Me, a React Native mobile app for securing patient data in Web3 Inrupt Data Vaults, combining the AI experience with medical care. Solid-backed data ownership, and mobile experiences powered by the same AI engine/backend as EverBetter Pro.',
    image: EVERBETTER_ME_IMAGE,
    tools: [
      tools.typescript,
      tools.react,
      tools.reactNative,
      tools.mongodb,
      tools.nextjs,
    ],
    links: [
      { label: 'Application Overview', href: EVERBETTER_ME_APPLICATION_OVERVIEW_URL },
      { label: 'Apple Store', href: EVERBETTER_ME_APPLE_STORE_URL },
    ],
  },
];

const sideProjects: SideProject[] = [
  {
    kind: 'side',
    id: 2,
    title: 'Native Nuclear',
    description: 'A Framer and React web application for Native Nuclear. Developed site in it\'s entirety, including maintainer documentation for site updates, UI/UX consistency, and third-party integrations.',
    image: NATIVE_NUCLEAR_IMAGE,
    liveUrl: 'https://nativenuclear.org',
    linkText: 'View Live Site',
    tools: [tools.react, tools.framer],
  },
  {
    kind: 'side',
    id: 3,
    title: 'Oppenheimer Energy',
    description: 'React frontend website for Oppenheimer Energy Ventures. A minimally designed website, showcasing just enough information for investor and supporter intrigue.',
    image: OPPENHEIMER_ENERGY_IMAGE,
    liveUrl: 'https://oppenheimer.energy',
    linkText: 'View Live Site',
    tools: [tools.react, tools.typescript, tools.tailwindCss],
  },
  {
    kind: 'side',
    id: 4,
    title: 'Indigenous Database',
    description: 'Non-profit project for Oyate Learning to search and compile Indigenous literature resources. Utilizes Mongoose with MongoDB for the backend, React and JS for the frontend. No longer operational due to maintenance costs.',
    image: INDIGENOUS_DATABASE_IMAGE,
    liveUrl: 'https://github.com/Baker-C/Indigenous-Database',
    linkText: 'View Github',
    tools: [tools.react, tools.mongodb, tools.nodejs, tools.express, tools.mongoose],
  },
  {
    kind: 'side',
    id: 6,
    title: 'Nuclear Symposium',
    description: 'Conference/event website focused on program information, simple maintenance, and symposium history. Soon to be released.',
    image: NUCLEAR_IMAGE,
    liveUrl: null,
    linkText: 'To Be Released Soon',
    isComingSoon: true,
    tools: [tools.javascript, tools.html, tools.css, tools.webflow],
  },
  {
    kind: 'side',
    id: 5,
    title: 'Nuclear NY',
    description: 'Public-facing web experience supporting the Nuclear New York non-profit, promoting nuclear education and outreach in New York. Soon to be released.',
    image: NUCLEAR_NY_IMAGE,
    liveUrl: null,
    linkText: 'To Be Released Soon',
    isComingSoon: true,
    tools: [tools.javascript, tools.html, tools.css, tools.webflow],
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

function liquidProps() {
  return {
    dotColor: theme.colors.theme,
    backgroundColor: theme.colors.black,
    control: {
      options: {
        emitDensityScale: 9000,
        emitVelocityScale: 1.4,
        fadeOutDensityRate: 0.58,
      },
    },
  };
}

function MainProjectRow({ project }: { project: MainProject }) {
  const liquid = liquidProps();

  return (
    <MainProjectCard>
      <MainProjectInner>
        <MainImageColumn>
          <MainCardImageFrame>
            <MouseLiquid image={project.image} {...liquid} />
            <CardImageOverlay />
          </MainCardImageFrame>
        </MainImageColumn>
        <MainInfoColumn>
          <ProjectTitle>{project.title}</ProjectTitle>
          {project.tools?.length ? (
            <StackRow>{project.tools.map(tool => tool.name).join(' / ')}</StackRow>
          ) : null}
          <ProjectText>{project.description}</ProjectText>
          <LinkRow>
            {project.links.map(link => (
              <ProjectLink key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </ProjectLink>
            ))}
          </LinkRow>
        </MainInfoColumn>
      </MainProjectInner>
    </MainProjectCard>
  );
}

function SideProjectRow({ project }: { project: SideProject }) {
  const liquid = liquidProps();

  return (
    <ProjectCard>
      <CardImageFrame>
        <MouseLiquid image={project.image} {...liquid} />
        <CardImageOverlay />
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
        ) : project.isComingSoon ? (
          <ComingSoonNote>{project.linkText}</ComingSoonNote>
        ) : (
          <LinkPlaceholder>{project.linkText}</LinkPlaceholder>
        )}
      </LinkRow>
    </ProjectCard>
  );
}

function Projects() {
  return (
    <Section id={PROJECTS_SECTION_ID}>
      <RollingTitle />
      <List>
        {mainProjects.map(project => (
          <MainProjectRow key={project.id} project={project} />
        ))}
        {sideProjects.map(project => (
          <SideProjectRow key={project.id} project={project} />
        ))}
      </List>
    </Section>
  );
}

export default Projects;
