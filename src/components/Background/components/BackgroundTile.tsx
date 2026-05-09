import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.6; }
  100% { opacity: 0; }
`;

const TileStyled = styled.div<{
  $tileSize: number;
  $active?: boolean;
  $pulsing?: boolean;
}>`
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
  -ms-user-select: none;
  width: ${props => props.$tileSize}px;
  height: ${props => props.$tileSize}px;
  flex-shrink: 0;
  border: 1px solid ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.theme};
  transition: all .4s ease 0.15s;

  &:before {
    --line-width: 2px;
    content: '';
    position: absolute;
    top: 100%;
    right: calc(var(--line-width) / 1);
    width: var(--line-width);
    height: 50%;
    background-color: ${(props) => props.theme.colors.black};
    transform:
      rotate(15deg);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${(props) => props.theme.colors.theme}aa;
    pointer-events: none;
    opacity: 0;
    ${props => props.$pulsing && css`
      animation: ${pulse} 0.2s ease-out forwards;
    `}
  }

  --dip: 5px;
  --scale: .99; 
  --shadow: 0 2px 18px ${props => props.theme.colors.theme};

  ${props => props.$active && `
    transition: all 50ms ease 0s;
    box-shadow: inset var(--shadow);
    transform: 
      translateY(var(--dip))
      translateX(-1px);
      scale(var(--scale));
  `}

  &:hover,
  &:active {
    transition: all 50ms ease 0s;
    box-shadow: inset var(--shadow);
    transform:
      translateY(6px)
      translateX(-1px)
      scale(var(--scale));
  }
`;

interface BackgroundTileProps {
  tileSize: number;
}

export function BackgroundTile({ tileSize }: BackgroundTileProps) {
  const [active, setActive] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const handleToggle = () => {
    setActive(a => !a);
    setPulsing(true);
  };

  return (
    <TileStyled
      $tileSize={tileSize}
      $active={active}
      $pulsing={pulsing}
      draggable={false}
      onMouseDown={handleToggle}
      onMouseEnter={(e) => {
        if (e.buttons & 1) handleToggle();
      }}
      onAnimationEnd={() => setPulsing(false)}
    />
  );
}
