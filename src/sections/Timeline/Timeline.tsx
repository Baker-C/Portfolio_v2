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
`;

const TimelineRail = styled.ol`
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  list-style: none;
  margin: 0;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xxl};
`;

const TimelineItem = styled.li`
  display: grid;
  grid-template-columns: 180px 24px 1fr;
  align-items: start;
  column-gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    row-gap: ${props => props.theme.spacing.md};
  }
`;

const Period = styled.p`
  margin: 0;
  padding-top: 2px;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.white};
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
  border: 1px solid ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.white};
  box-shadow: 0 0 20px 1px color-mix(in srgb, ${props => props.theme.colors.theme} 30%, transparent);
  z-index: 2;
`;

const Rail = styled.span`
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  width: 1px;
  /* Note: calc(-var(--x)) is invalid; use 0px - var(--x) so the line length resolves. */
  bottom: calc(0px - ${props => props.theme.spacing.xxl} - 4px);
  background: color-mix(in srgb, ${props => props.theme.colors.white} 35%, transparent);
`;

const Card = styled.article`
  position: relative;
  border: 1px solid ${props => props.theme.colors.theme};
  background: linear-gradient(150deg, rgba(20, 20, 24, 0.9), rgba(9, 9, 12, 0.9));
  padding: ${props => props.theme.spacing.xl};
`;

const Role = styled.h3`
  margin: 0;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xl};
  color: ${props => props.theme.colors.white};
`;

const Company = styled.p`
  margin: ${props => props.theme.spacing.sm} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.white};
`;

const ToolRow = styled.p`
  margin: ${props => props.theme.spacing.md} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.white};
`;

const OutcomeList = styled.ul`
  margin: ${props => props.theme.spacing.lg} 0 0;
  padding-left: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Outcome = styled.li`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.white};
  line-height: 1.5;
`;

const OutcomeTitle = styled.span`
  font-weight: 600;
`;

const OutcomeBody = styled.p`
  margin: ${props => props.theme.spacing.xs} 0 0;
  font-weight: 400;
  list-style: none;
`;

function splitOutcome(outcome: string): { title: string; body: string | null } {
  const colonIndex = outcome.indexOf(':');
  if (colonIndex === -1) return { title: outcome, body: null };
  return {
    title: outcome.slice(0, colonIndex).trim(),
    body: outcome.slice(colonIndex + 1).trim() || null,
  };
}

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
      'Microservices Implementation: Used TypeScript, Next.js, and MongoDB to expand a NATS system, shipping features for thousands of users in a multi-tenant platform.',
      'AI Work Environment: Built an internal tool that transitioned UI development from Figma to an AI-driven React system, cutting cycles from days to hours.',
      'CI/CD & Release Ownership: Owned mobile app GitHub CI/CD DevOps for 48 engineers, 3 concurrent platform tenants, and 20+ app deployments.',
      'TypeScript Optimization: Re-architected legacy JavaScript features in TypeScript, reducing API call volume by over 50% for key features.',
      'Distributed Service Implementation: Used React Native and TypeScript to implement app features connected to a microservices backend.',
      'Mobile Development: Built out a React-Native application that supports thousands of users.',
      'OAuth Security: Identified architectural gaps in mobile OAuth implementation, preventing medical data exposure for thousands of users.',
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
                {entry.outcomes.map(outcome => {
                  const { title, body } = splitOutcome(outcome);
                  return (
                    <Outcome key={outcome}>
                      <OutcomeTitle>{title}</OutcomeTitle>
                      {body ? <OutcomeBody>{body}</OutcomeBody> : null}
                    </Outcome>
                  );
                })}
              </OutcomeList>
            </Card>
          </TimelineItem>
        ))}
      </TimelineRail>
    </Section>
  );
}

export default Timeline;
