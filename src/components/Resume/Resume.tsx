import styled from 'styled-components';

const RESUME_FILENAME = 'BakerC_Resume.pdf';

const ResumeLink = styled.a`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.xxl};
  font-family: ${props => props.theme.fonts.families.block};
  font-weight: 800;
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.white};
  background: none;
  text-decoration: none;
  cursor: pointer;
  z-index: 1000;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.spacing.xs};
`;

export function Resume() {
  const href = `${import.meta.env.BASE_URL}${RESUME_FILENAME}`;
  return (
    <ResumeLink href={href} target="_blank" rel="noopener noreferrer">
      Download Resume
    </ResumeLink>
  );
}
