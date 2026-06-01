import { MouseLiquid } from '@/components';
import { theme } from '@/theme';
import styled, { keyframes } from 'styled-components';

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

const liquidBlackFadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

/** Solid black veil on the liquid layer; fades out after page load. */
const OverlayLiquidBlack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background-color: ${props => props.theme.colors.black};
  pointer-events: none;
  opacity: 1;
  animation: ${liquidBlackFadeOut} 0.9s ease-out forwards;
  animation-delay: 2s;
`;

export type MovingBgProps = {
  image?: string;
  dotColor?: string;
  backgroundColor?: string;
  /** Fade a solid black layer over the liquid 2s after mount. */
  fadeLiquidOverlay?: boolean;
};

function MovingBg({
  image = '/bg-1.mp4',
  dotColor = theme.colors.theme,
  backgroundColor = theme.colors.black,
  fadeLiquidOverlay = false,
}: MovingBgProps = {}) {
  return (
    <Wrapper aria-hidden>
      <MouseLiquid
        image={image}
        dotColor={dotColor}
        backgroundColor={backgroundColor}
      />
      {fadeLiquidOverlay ? <OverlayLiquidBlack /> : null}
      <OverlayLr />
      <OverlayTb />
    </Wrapper>
  );
}

export { MovingBg };
