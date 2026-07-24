import styled from 'styled-components';
import tools from '@/constants/tools';
import { RollingText } from '@/components';

type ToolEntry = (typeof tools)[keyof typeof tools];

type JobEntry = {
  periodStart: string;
  periodEnd: string;
  role: string;
  company: string;
  tools: ToolEntry[];
  responsibilities: string[];
};

type EducationEntry = {
  periodStart: string;
  periodEnd: string;
  role: string;
  company: string;
  tools: ToolEntry[];
  outcomes: string[];
};

type TimelineEntry = JobEntry | EducationEntry;

function hasResponsibilities(entry: TimelineEntry): entry is JobEntry {
  return 'responsibilities' in entry;
}

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

const Period = styled.div`
  display: flex;
  flex-direction: column;
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

const SectionLabel = styled.p`
  margin: ${props => props.theme.spacing.lg} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.theme};
`;

const ToolRow = styled.p`
  margin: ${props => props.theme.spacing.sm} 0 0;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.white};
`;

const ResponsibilityList = styled.ul`
  margin: ${props => props.theme.spacing.sm} 0 0;
  padding-left: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Responsibility = styled.li`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.white};
  line-height: 1.5;
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

const timeline: TimelineEntry[] = [
  {
    periodStart: 'Aug 2025',
    periodEnd: 'Present',
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
    responsibilities: [
      'Develop and ship features across a multi-tenant NATS microservices backend using TypeScript, Next.js, and MongoDB, serving thousands of users.',
      'Build and maintain React Native app features connected to that microservices backend, supporting thousands of mobile users.',
      'Own the mobile GitHub CI/CD and DevOps release process, covering 48 engineers across 3 concurrent platform tenants and 20+ app deployments.',
      'Re-architect legacy JavaScript into TypeScript, cutting API call volume by over 50% on key features.',
      'Build internal AI-driven tooling that replaced the manual Figma-to-code handoff, cutting UI development cycles from days to hours.',
      'Audit the mobile OAuth implementation for security gaps, closing issues that could have exposed protected health information for thousands of users.',
    ],
  },
  {
    periodStart: 'Mar 2025',
    periodEnd: 'Present',
    role: 'Freelance Developer',
    company: 'Self-Employed',
    tools: [tools.webflow, tools.framer, tools.figma, tools.react, tools.typescript, tools.python, tools.github],
    responsibilities: [
      'Build and deploy production client websites using React, Framer, and WebFlow.',
      "Build custom Python tools so non-technical stakeholders can run AI web scraping and manage site content independently.",
      "Design UI/UX concepts and interactive prototypes in Figma aligned to each client's goals and audience.",
      'Produce written and video documentation for technical and non-technical maintainers.',
    ],
  },
  {
    periodStart: 'Jan 2025',
    periodEnd: 'Mar 2025',
    role: 'Technical Consultant',
    company: 'New Clear Energy USA, Inc.',
    tools: [tools.python, tools.googleWorkspace, tools.framer, tools.figma],
    responsibilities: [
      'Redesign calendar and email-filtering workflows and introduce AI-driven task automation into daily operations, recovering roughly 3 hours of daily productivity for leadership.',
      'Restructure email and file systems to support the new automated workflows.',
      'Advise on UI/UX direction, brand consistency, technical infrastructure, and application architecture for the company website.',
    ],
  },
  {
    periodStart: 'September 2020',
    periodEnd: 'December 2024',
    role: 'Graduated, B.S. Computer Science',
    company: 'California Polytechnic State University, SLO',
    tools: [tools.python, tools.c, tools.java, tools.javascript, tools.sql],
    outcomes: [
      'Graduated with a foundation in Computer Architecture and Full Stack Engineering.',
      'Software Development Workflows, Modern Web Development, Databases, Data Structures, Algorithms, Distributed Systems, Operating Systems, Machine Learning, Programming Languages, Computer Architecture.',
    ],
  },
  {
    periodStart: 'May 2023',
    periodEnd: 'Jan 2024',
    role: 'Junior Full Stack Developer (Non-Profit Project)',
    company: 'Oyate Learning',
    tools: [tools.react, tools.mongodb, tools.nodejs, tools.express, tools.mongoose, tools.redux, tools.python],
    responsibilities: [
      'Build the Indigenous Database, a full-stack app for searching and compiling Indigenous literature resources for community education.',
      'Design and deploy a REST API with MongoDB, Mongoose, and Express, plus a React/Redux frontend.',
      'Implement role-based access control, user authentication, and an automated web-scraper-to-database pipeline.',
      'Optimize API performance, cutting overhead data by ~80% and average query time from ~550ms to ~250ms.',
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
          <TimelineItem key={entry.role}>
            <Period>
              <span>{entry.periodStart}</span>
              <span>-</span>
              <span>{entry.periodEnd}</span>
            </Period>
            <RailCell>
              <Dot />
              {index < timeline.length - 1 ? <Rail /> : null}
            </RailCell>
            <Card>
              <Role>{entry.role}</Role>
              <Company>{entry.company}</Company>
              {hasResponsibilities(entry) ? (
                <>
                  {entry.tools?.length ? (
                    <>
                      <SectionLabel>Technologies</SectionLabel>
                      <ToolRow>{entry.tools.map(tool => tool.name).join(' / ')}</ToolRow>
                    </>
                  ) : null}
                  <SectionLabel>Responsibilities</SectionLabel>
                  <ResponsibilityList>
                    {entry.responsibilities.map(item => (
                      <Responsibility key={item}>{item}</Responsibility>
                    ))}
                  </ResponsibilityList>
                </>
              ) : (
                <>
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
                </>
              )}
            </Card>
          </TimelineItem>
        ))}
      </TimelineRail>
    </Section>
  );
}

export default Timeline;
