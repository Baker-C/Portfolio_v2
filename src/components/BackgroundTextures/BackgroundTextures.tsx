import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background-color: ${props => props.theme.colors.black};
`;

export function BackgroundTextures() {
  return <Wrapper />;
}
