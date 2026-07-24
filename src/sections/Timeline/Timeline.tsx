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

const PERIOD_COLUMN_WIDTH = 130;

const TimelineItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: ${PERIOD_COLUMN_WIDTH}px 24px 1fr;
  align-items: start;
  column-gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    row-gap: ${props => props.theme.spacing.md};
  }
`;

const PERIOD_LINE_HEIGHT = 1.3;

const Period = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.sm};
  line-height: ${PERIOD_LINE_HEIGHT};
  color: ${props => props.theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const RailCell = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

/**
 * Anchored to TimelineItem (not RailCell) so it's aligned under the date column instead of
 * sitting in the RailCell gutter. Starts right below the (3-line) date text and runs through
 * the gap to the next date.
 */
const RAIL_END_PADDING_PX = 14;

const Rail = styled.span`
  position: absolute;
  left: 0;
  top: calc(2px + (${props => props.theme.fonts.sizes.sm} * ${PERIOD_LINE_HEIGHT} * 3) + ${RAIL_END_PADDING_PX}px);
  bottom: calc(${RAIL_END_PADDING_PX}px - ${props => props.theme.spacing.xxl});
  width: 1px;
  background: color-mix(in srgb, ${props => props.theme.colors.white} 35%, transparent);

  @media (max-width: 768px) {
    display: none;
  }
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
  gap: ${props => props.theme.spacing.sm};
`;

const Outcome = styled.li`
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.white};
  line-height: 1.5;
`;

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
      'Develop and ship features across a multi-tenant NATS microservices backend, React frontend, and React Native mobile applications.',
      'Support mobile CI/CD and DevOps releases.',
      'Communicate with clients about specific requirements and translate that into existing and new tasks.',
      'Build internal tooling to support and speed up team development.',
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
      'Build Python scripts and write documentation to support website maintenance for non-technical users.',
      "Design UI/UX concepts according to each client's requirements and preferences.",
    ],
  },
  {
    periodStart: 'Jan 2025',
    periodEnd: 'Mar 2025',
    role: 'Technical Consultant',
    company: 'New Clear Energy USA, Inc.',
    tools: [tools.python, tools.googleWorkspace, tools.framer, tools.figma],
    responsibilities: [
      'Redesign online workflows to improve technical hygiene and productivity.',
      'Advise on UI/UX direction, brand consistency, and application architecture.',
    ],
  },
  {
    periodStart: 'Sept 2020',
    periodEnd: 'Dec 2024',
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
    role: 'Junior Full Stack Developer',
    company: 'Oyate Learning',
    tools: [tools.react, tools.mongodb, tools.nodejs, tools.express, tools.mongoose, tools.redux, tools.python],
    responsibilities: [
      'Build the Indigenous Database, an application for compiling and sharing links to Indigenous literature and art for community education.',
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
            {index < timeline.length - 1 ? <Rail /> : null}
            <Period>
              <span>{entry.periodStart}</span>
              <span>-</span>
              <span>{entry.periodEnd}</span>
            </Period>
            <RailCell />
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
                    {entry.outcomes.map(outcome => (
                      <Outcome key={outcome}>{outcome}</Outcome>
                    ))}
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
