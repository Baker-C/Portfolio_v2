import styled from 'styled-components';
import tools from '@/constants/tools';
import { RollingText } from '@/components';

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.xxl} 0;
`;

const RollingTextContainer = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} 0;
  margin-bottom: ${props => props.theme.spacing.xl};
  transform: rotate(-5deg);
  transform-origin: left center;
`;

const TimelineRail = styled.ol`
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  list-style: none;
  margin: 0;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const TimelineItem = styled.li`
  display: grid;
  grid-template-columns: 180px 24px 1fr;
  align-items: start;
  column-gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    row-gap: ${props => props.theme.spacing.sm};
  }
`;

const Period = styled.p`
  margin: 0;
  padding-top: 2px;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.theme};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const RailCell = styled.div`
  position: relative;
  min-height: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.theme};
  background: ${props => props.theme.colors.theme};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
  z-index: 2;
`;

const Rail = styled.span`
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  width: 1px;
  bottom: calc(-${props => props.theme.spacing.xl} - 4px);
  background: ${props => props.theme.colors.theme};
`;

const Card = styled.article`
  position: relative;
  border: 1px solid ${props => props.theme.colors.theme};
  background: linear-gradient(150deg, rgba(20, 20, 24, 0.9), rgba(9, 9, 12, 0.9));
  padding: ${props => props.theme.spacing.lg};
`;

const Role = styled.h3`
  margin: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xl};
  color: ${props => props.theme.colors.white};
`;

const Company = styled.p`
  margin: ${props => props.theme.spacing.xs} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.theme};
`;

const ToolRow = styled.p`
  margin: ${props => props.theme.spacing.sm} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.theme};
`;

const OutcomeList = styled.ul`
  margin: ${props => props.theme.spacing.md} 0 0;
  padding-left: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Outcome = styled.li`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.theme};
  line-height: 1.5;
`;

const timeline = [
  {
    period: 'Aug 2025 - Present',
    role: 'Full Stack Developer',
    company: 'Everbetter Medicine, LLC',
    tools: [
      tools.typescript,
      tools.react,
      tools.reactNative,
      tools.mongodb,
      tools.nextjs,
      tools.githubActions,
      tools.jira,
    ],
    outcomes: [
      'Owned mobile CI/CD and code review approvals across 3 platform variants, supporting 20+ deployments.',
      'Re-architected legacy JavaScript features into TypeScript, cutting API call volume by more than 50% in key flows.',
      'Implemented 13+ React Native data services and connected 4 backend service clients to MobX cache stores.',
      'Expanded a NATS ecosystem with 50+ microservices to ship full-stack features in a multi-tenant system.',
      'Flagged OAuth architecture risks early and prevented severe mobile security exposure.',
    ],
  },
  {
    period: 'Mar 2025 - Present',
    role: 'Freelance Developer',
    company: 'Self-Employed',
    tools: [tools.webflow, tools.framer, tools.figma, tools.react, tools.typescript, tools.python, tools.github],
    outcomes: [
      'Built and deployed client websites using React, Framer, and Webflow.',
      'Created Python automation tools so non-technical stakeholders could manage content and AI scraping workflows.',
      'Designed UI/UX concepts and prototypes in Figma aligned to business goals and audience needs.',
      'Delivered written and video documentation for both technical and non-technical maintainers.',
    ],
  },
  {
    period: 'Jan 2025 - Mar 2025',
    role: 'Technical Consultant',
    company: 'New Clear Energy USA, Inc.',
    tools: [tools.python, tools.googleWorkspace, tools.framer, tools.figma],
    outcomes: [
      'Recovered roughly 3 hours of daily productivity by redesigning calendar and email filtering workflows.',
      'Restructured email and file systems, then introduced AI-powered task automation into daily operations.',
      'Advised on UI/UX direction, brand consistency, technical infrastructure, and application architecture.',
    ],
  },
  {
    period: 'Dec 2024',
    role: 'Graduated, B.S. Computer Science',
    company: 'California Polytechnic State University, SLO',
    tools: [tools.javascript, tools.typescript, tools.java, tools.python],
    outcomes: [
      'Completed coursework in distributed systems, modern web development, databases, and software workflows.',
      'Graduated with a foundation spanning full-stack engineering, algorithms, and production-oriented development.',
    ],
  },
  {
    period: 'May 2023 - Jan 2024',
    role: 'Junior Full Stack Developer (Non-Profit Project)',
    company: 'Oyate Learning',
    tools: [tools.react, tools.mongodb, tools.nodejs, tools.express, tools.mongoose, tools.redux, tools.python],
    outcomes: [
      'Built the Indigenous Database to search and compile Indigenous literature resources for community education.',
      'Designed and deployed a REST API using MongoDB, Mongoose, and Express, plus a React/Redux frontend.',
      'Improved API efficiency by reducing overhead data by ~80% and lowering average query time from ~550ms to ~250ms.',
      'Implemented role-based access control, user authentication, and an automated web-scraper-to-database pipeline.',
    ],
  },
];

const TIMELINE_SECTION_ID = 'timeline';

function RollingTitle() {
  return (
    <RollingTextContainer>
      <RollingText
        text={["WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY"]}
        reverse={true}
      />
      <RollingText
        text={["WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY", "WORK HISTORY"]}
        reverse={false}
      />
    </RollingTextContainer>
  );
}

function Timeline() {
  return (
    <Section id={TIMELINE_SECTION_ID}>
      <RollingTitle />
      <TimelineRail>
        {timeline.map((entry, index) => (
          <TimelineItem key={`${entry.period}-${entry.role}`}>
            <Period>{entry.period}</Period>
            <RailCell>
              <Dot />
              {index < timeline.length - 1 ? <Rail /> : null}
            </RailCell>
            <Card>
              <Role>{entry.role}</Role>
              <Company>{entry.company}</Company>
              {entry.tools?.length ? (
                <ToolRow>{entry.tools.map(tool => tool.name).join(' / ')}</ToolRow>
              ) : null}
              <OutcomeList>
                {entry.outcomes.map(outcome => (
                  <Outcome key={outcome}>{outcome}</Outcome>
                ))}
              </OutcomeList>
            </Card>
          </TimelineItem>
        ))}
      </TimelineRail>
    </Section>
  );
}

export default Timeline;
