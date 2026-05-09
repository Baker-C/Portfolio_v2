import styled from 'styled-components';

const RESUME_FILENAME = 'BakerC_Resume.pdf';

function resumePageHref() {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}resume`.replace(/\/{2,}/g, '/');
}

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
  display: inline-block;
  white-space: nowrap;

  /* No external-link ::before underline or ::after arrow — keep this control visually separate from project links. */
  &::before,
  &::after {
    content: none;
    display: none;
  }

  @media (max-width: 640px) {
    right: ${props => props.theme.spacing.sm};
    top: ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fonts.sizes.md};
    padding: ${props => props.theme.spacing.xs};
    line-height: 1.2;
  }

  @media (max-width: 400px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    top: calc(1 * ${props => props.theme.spacing.md});
  }
`;

export type ResumeProps = {
  /** When true (on `/resume`), link opens the PDF in a new tab. Default: navigate to the resume page. */
  downloadPdf?: boolean;
};

export function Resume({ downloadPdf = false }: ResumeProps) {
  const pdfHref = `${import.meta.env.BASE_URL}${RESUME_FILENAME}`.replace(/\/{2,}/g, '/');
  const href = downloadPdf ? pdfHref : resumePageHref();
  return (
    <ResumeLink
      href={href}
      {...(downloadPdf ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {downloadPdf ? 'Download Resume' : 'Resume'}
    </ResumeLink>
  );
}
