import { MouseLiquid } from '@/components';
import { theme } from '@/theme';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  overflow: hidden;
`;

const OverlayLr = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-image: linear-gradient(to right, rgb(0, 0, 0), rgba(0, 0, 0, 0));
  pointer-events: none;
`;

const OverlayTb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-image: linear-gradient(to bottom, rgb(0, 0, 0), rgba(0, 0, 0, 0));
  pointer-events: none;
`;

export type MovingBgProps = {
  image?: string;
  dotColor?: string;
  backgroundColor?: string;
};

function MovingBg({
  image = '/bg-1.mp4',
  dotColor = theme.colors.theme,
  backgroundColor = theme.colors.black,
}: MovingBgProps = {}) {
  return (
    <Wrapper aria-hidden>
      <OverlayLr />
      <OverlayTb />
      <MouseLiquid
        image={image}
        dotColor={dotColor}
        backgroundColor={backgroundColor}
      />
    </Wrapper>
  );
}

export { MovingBg };
