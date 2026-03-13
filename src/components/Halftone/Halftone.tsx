import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const VIDEO_EXTENSIONS = /\.(webm|mp4|mov|ogg|ogv|m4v)(\?|$)/i;

function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url);
}

type MediaSource = HTMLImageElement | HTMLVideoElement;

function loadMedia(url: string): Promise<MediaSource> {
  return new Promise((resolve, reject) => {
    if (isVideoUrl(url)) {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = 'auto';
      video.onloadeddata = () => resolve(video);
      video.onerror = () => reject(new Error(`Video load failed: ${url}`));
      video.src = url;
      video.load();
      video.play().catch(() => {});
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image load failed: ${url}`));
      img.src = url;
    }
  });
}

function drawMediaCover(
  ctx: CanvasRenderingContext2D,
  media: MediaSource,
  w: number,
  h: number
) {
  const iw = media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
  const ih = media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = (w - sw) / 2;
  const sy = (h - sh) / 2;
  ctx.drawImage(media, 0, 0, iw, ih, sx, sy, sw, sh);
}

/** Luminance from 0–255 RGB (same as MouseLiquid-style sampling). */
function getLuminance(data: Uint8ClampedArray, i: number): number {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) return 1;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const Wrapper = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

export type HalftoneProps = {
  className?: string;
  /** Width of the output (px). */
  width: number;
  /** Height of the output (px). */
  height: number;
  /** Image or video URL. */
  src: string;
  /** Grid cell size in pixels (larger = chunkier halftone). Default 8. */
  dotSize?: number;
  /** Dot color (e.g. black). Default '#000'. */
  dotColor?: string;
  /** Background color (e.g. white). Default '#fff'. */
  backgroundColor?: string;
};

export function Halftone({
  className,
  width,
  height,
  src,
  dotSize = 8,
  dotColor = '#000',
  backgroundColor = '#fff',
}: HalftoneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<MediaSource | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let media: MediaSource | null = null;
    loadMedia(src)
      .then((m) => {
        if (cancelled) return;
        media = m;
        mediaRef.current = m;
        if (m instanceof HTMLVideoElement) m.play().catch(() => {});
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      mediaRef.current = null;
      setReady(false);
      if (media instanceof HTMLVideoElement) {
        media.pause();
        media.removeAttribute('src');
      }
    };
  }, [src]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const media = mediaRef.current;
    if (!canvas || !media) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = Math.max(1, Math.floor(width / dotSize));
    const rows = Math.max(1, Math.floor(height / dotSize));
    const canvasW = cols * dotSize;
    const canvasH = rows * dotSize;
    canvas.width = canvasW;
    canvas.height = canvasH;

    const buffer = document.createElement('canvas');
    buffer.width = canvasW;
    buffer.height = canvasH;
    const bufferCtx = buffer.getContext('2d')!;

    let rafId: number;

    function draw() {
      const m = mediaRef.current;
      if (!m || !ctx || !bufferCtx) return;

      bufferCtx.fillStyle = backgroundColor;
      bufferCtx.fillRect(0, 0, canvasW, canvasH);
      drawMediaCover(bufferCtx, m, canvasW, canvasH);

      const imageData = bufferCtx.getImageData(0, 0, canvasW, canvasH);
      const data = imageData.data;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = dotColor;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * dotSize + dotSize / 2;
          const cy = row * dotSize + dotSize / 2;
          const px = Math.min(Math.floor(cx), canvasW - 1);
          const py = Math.min(Math.floor(cy), canvasH - 1);
          const i = (py * canvasW + px) * 4;
          const lum = getLuminance(data, i);
          const radius = (1 - lum) * (dotSize / 2) * 0.95;
          if (radius > 0.2) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (mediaRef.current instanceof HTMLVideoElement) {
        rafId = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [ready, width, height, src, dotSize, dotColor, backgroundColor]);

  return (
    <Wrapper className={className} $width={width} $height={height} aria-hidden>
      <Canvas ref={canvasRef} width={width} height={height} />
    </Wrapper>
  );
}
