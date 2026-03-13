import styled from 'styled-components';

const NameButton = styled.button`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  left: ${props => props.theme.spacing.xxl};
  font-family: ${props => props.theme.fonts.families.block};
  font-weight: 800;
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.white};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 1000;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.spacing.xs};
`;

export function Name() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return <NameButton type="button" onClick={scrollToTop}>charlesDbaker</NameButton>;
}
