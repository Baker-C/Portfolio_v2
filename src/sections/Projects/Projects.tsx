import styled from 'styled-components';
import tools from '@/constants/tools';

const Section = styled.section`
  width: 100%;
  padding: ${props => props.theme.spacing.xxl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xxl};
  padding: 0 ${props => props.theme.spacing.xl};
`;

const ProjectCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${props => props.theme.spacing.md};
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

const ProjectText = styled.p`
  margin: 0;
  padding: 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: 400;
  line-height: 1.6;
  color: ${props => props.theme.colors.white};
`;

const mockProjects = [
  {
    id: 1,
    title: 'TaskFlow',
    description: 'A collaborative task management app with real-time updates, drag-and-drop boards, and team analytics. Built with React and Node.js.',
    image: 'https://picsum.photos/800/450?random=1',
    tools: [
      tools.react,
      tools.nodejs,
      tools.nextjs,
      tools.tailwindCss,
      tools.typescript,
      tools.framer,
      tools.webflow,
      tools.mongodb,
      tools.mysql,
    ]
  },
  {
    id: 2,
    title: 'Weather Lens',
    description: 'Minimal weather dashboard that combines forecasts with local air quality and UV index. Uses open APIs and a clean, accessible UI.',
    image: 'https://picsum.photos/800/450?random=2',
  },
  {
    id: 3,
    title: 'Recipe Vault',
    description: 'Personal recipe keeper with search, tags, and meal planning. Export shopping lists and scale ingredients with one tap.',
    image: 'https://picsum.photos/800/450?random=3',
  },
  {
    id: 4,
    title: 'Portfolio CMS',
    description: 'Lightweight headless CMS for portfolios and blogs. Markdown-first, image optimization, and simple deployment.',
    image: 'https://picsum.photos/800/450?random=4',
  },
];

const PROJECTS_SECTION_ID = 'projects';

function Projects() {
  return (
    <Section id={PROJECTS_SECTION_ID}>
      <List>
        {mockProjects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectText>{project.description}</ProjectText>
          </ProjectCard>
        ))}
      </List>
    </Section>
  );
}

export default Projects;
