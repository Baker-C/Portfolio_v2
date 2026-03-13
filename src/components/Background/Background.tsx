import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BackgroundTile } from './components/BackgroundTile';

const TILE_SIZE = 80;
const ROW_HEIGHT = TILE_SIZE * 0.57;

export type BackgroundRotation = {
  y: number;
  x: number;
}

const Container = styled.div`
  position: relative;
  min-width: 100%;
  min-height: 100%;
  max-height: 300vh;
  overflow: hidden;
  background-color: ${props => props.theme.colors.tint};
`;

const GetXTranslation = (index: number) => {
  const base = -TILE_SIZE * 3;
  const rotationRenewal = Math.floor(index / 3)  * 11;
  const successive = index % 3 * TILE_SIZE * 0.343;
  return base + rotationRenewal + successive;
};

const GetYTranslation = (index: number) => {
  const base = -TILE_SIZE * .4;
  const rotationRenewal = Math.floor(index / 3)  * -.1;
  return base + rotationRenewal;
};

const TileContainer = styled.div<{ $index: number, rotation: BackgroundRotation }>`
  display: flex;
  width: 100%;
  height: ${ROW_HEIGHT}px;
  flex-wrap: no-wrap;
  transform:
    translateX(${props => GetXTranslation(props.$index)}px)
    translateY(${props => GetYTranslation(props.$index)}px)
    rotateY(${props => props.rotation.y}deg)
    rotateX(${props => props.rotation.x}deg);
`;

function Background({ rotation = { y: 25, x: 45 } }: { rotation?: BackgroundRotation }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);

  useEffect(() => {
    const updateCounts = () => {
      const { width, height } = containerRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 };
      setRowCount(Math.ceil(height / ROW_HEIGHT) + 3);
      setColCount(Math.ceil(width / TILE_SIZE) + 50);
    };

    updateCounts();

    const resizeObserver = containerRef.current
      ? new ResizeObserver(updateCounts)
      : null;
    if (containerRef.current) resizeObserver?.observe(containerRef.current);

    window.addEventListener('resize', updateCounts);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCounts);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      {Array.from(Array(rowCount)).map((_, i) => (
        <TileContainer $index={i} key={i} rotation={rotation}>
          {Array.from(Array(colCount)).map((_, j) => (
            <BackgroundTile key={`${i}-${j}`} tileSize={TILE_SIZE} />
          ))}
        </TileContainer>
      ))}
    </Container>
  );
}

export default Background;
