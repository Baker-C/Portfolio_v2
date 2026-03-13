import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FluidDynamicSolver } from './fluidSolver';

const OVERFLOW_CELLS = 12;

// ——— Halftone / dot size (tweak these) ———
/** Pixel size of each grid cell (and max dot diameter). Larger = bigger, chunkier dots. */
const CELL_SIZE_PX = 20;
/** Max dot radius as fraction of half-cell (0–1). 0.95 = nearly touch cell edges. */
const DOT_RADIUS_SCALE = 0.6;
/** When density >= MOVEMENT_THRESHOLD, dot radius is multiplied by this (e.g. 0.5 = half). */
const MOVEMENT_RADIUS_SCALE = 1.1;
/** Don't draw dots smaller than this radius (px). */
const MIN_DOT_RADIUS = 0;
/** Luminance at or below this (0–1): no dot, solid black. Lower = more dark area becomes solid black. */
const MIN_DOT_THRESHOLD = 0.05;
/** Density above this triggers "movement" (dot radius uses MOVEMENT_RADIUS_SCALE). */
const MOVEMENT_THRESHOLD = 0.01;
/** Idle sub-grid: 3x3 = 9 squares per cell. */
const SUB_GRID_SIZE = 3;
/** Precomputed sub-cell center ratios from cell center (-0.5..0.5). For 3x3: -1/3, 0, 1/3. */
const SUB_OFFSET_RATIOS: [number, number][] = (() => {
  const r: [number, number][] = [];
  for (let sy = 0; sy < SUB_GRID_SIZE; sy++) {
    for (let sx = 0; sx < SUB_GRID_SIZE; sx++) {
      r.push([
        (2 * sx + 1) / (2 * SUB_GRID_SIZE) - 0.5,
        (2 * sy + 1) / (2 * SUB_GRID_SIZE) - 0.5,
      ]);
    }
  }
  return r;
})();
// ———

const VIDEO_EXTENSIONS = /\.(webm|mp4|mov|ogg|ogv|m4v)(\?|$)/i;

function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url);
}

type DefaultMedia = HTMLImageElement | HTMLVideoElement;

function loadMedia(url: string): Promise<DefaultMedia> {
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
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image load failed: ${url}`));
      img.src = url;
    }
  });
}

export type MouseLiquidControlOptions = {
  diff?: number;
  visc?: number;
  fadeOutDensityRate?: number;
  fadeOutVelocityRate?: number;
  drawDensity?: boolean;
  emitDensity?: boolean;
  emitDensityScale?: number;
  emitDensityExpand?: number;
  drawVelocity?: boolean;
  drawVelocityScale?: number;
  emitVelocity?: boolean;
  emitVelocityScale?: number;
  emitVelocityExpand?: number;
};

const DEFAULT_CONTROL: Required<MouseLiquidControlOptions> = {
  diff: 1,
  visc: 1,
  fadeOutDensityRate: 0.65,
  fadeOutVelocityRate: .01,
  drawDensity: true,
  emitDensity: true,
  emitDensityScale: 10000,
  emitDensityExpand: 1,
  drawVelocity: false,
  drawVelocityScale: 1,
  emitVelocity: true,
  emitVelocityScale: 1,
  emitVelocityExpand: 1,
};

function mergeControl(control?: { options?: MouseLiquidControlOptions }): Required<MouseLiquidControlOptions> {
  const opts = control?.options ?? {};
  return { ...DEFAULT_CONTROL, ...opts };
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  overflow: visible;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

export type MouseLiquidProps = {
  className?: string;
  /** Single image or video URL (object-fit: cover). Drawn as halftone dots; movement above threshold halves dot radius. */
  image: string;
  /** Dot color. Default '#000'. */
  dotColor?: string;
  /** Background color. Default '#fff'. */
  backgroundColor?: string;
  /** Optional fluid simulation control; omitted fields use defaults. */
  control?: { options?: MouseLiquidControlOptions };
};

function drawMediaCover(
  ctx: CanvasRenderingContext2D,
  media: DefaultMedia,
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

/** Luminance 0–1 from RGBA at index i. */
function getLuminance(data: Uint8ClampedArray, i: number): number {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) return 1;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Parse #rgb or #rrggbb to [r, g, b] 0–255. Falls back to black for invalid/other formats. */
function parseRgb(hex: string): [number, number, number] {
  if (!hex.startsWith('#')) return [0, 0, 0];
  const n = parseInt(hex.slice(1), 16);
  if (isNaN(n)) return [0, 0, 0];
  if (hex.length === 4) {
    const r = (n >> 8) & 0xf;
    const g = (n >> 4) & 0xf;
    const b = n & 0xf;
    return [r * 17, g * 17, b * 17];
  }
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Fill a square in the RGBA buffer (used for batched putImageData). */
function fillRectInBuffer(
  data: Uint8ClampedArray,
  cw: number,
  ch: number,
  cx: number,
  cy: number,
  halfSize: number,
  r: number,
  g: number,
  b: number
) {
  const x0 = Math.max(0, (cx - halfSize) | 0);
  const y0 = Math.max(0, (cy - halfSize) | 0);
  const x1 = Math.min(cw, (cx + halfSize) | 0);
  const y1 = Math.min(ch, (cy + halfSize) | 0);
  for (let y = y0; y < y1; y++) {
    const row = y * cw;
    for (let x = x0; x < x1; x++) {
      const i = (row + x) << 2;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
}

export function MouseLiquid({
  className,
  image,
  dotColor = '#000',
  backgroundColor = '#fff',
  control: controlProp,
}: MouseLiquidProps) {
  const ctrl = useMemo(() => mergeControl(controlProp), [controlProp]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState({ w: 0, h: 0 });

  const width = measuredSize.w;
  const height = measuredSize.h;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: w, height: h } = entry.contentRect;
      setMeasuredSize({ w: Math.round(w), h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerCol = Math.max(1, Math.floor(width / CELL_SIZE_PX));
  const innerRow = Math.max(1, Math.floor(height / CELL_SIZE_PX));
  const col = innerCol + 2 * OVERFLOW_CELLS;
  const row = innerRow + 2 * OVERFLOW_CELLS;
  const gridSize = { col, row };

  const [mediaReady, setMediaReady] = useState(false);
  const mediaRef = useRef<DefaultMedia | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<FluidDynamicSolver | null>(null);
  const dUiRef = useRef<Float32Array | null>(null);
  const uUiRef = useRef<Float32Array | null>(null);
  const vUiRef = useRef<Float32Array | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    let cancelled = false;
    let media: DefaultMedia | null = null;
    loadMedia(image)
      .then((m) => {
        if (cancelled) return;
        media = m;
        mediaRef.current = m;
        if (m instanceof HTMLVideoElement) m.play().catch(() => {});
        setMediaReady(true);
      })
      .catch(() => {
        if (!cancelled) setMediaReady(false);
      });
    return () => {
      cancelled = true;
      mediaRef.current = null;
      setMediaReady(false);
      if (media instanceof HTMLVideoElement) {
        media.pause();
        media.removeAttribute('src');
      }
    };
  }, [image]);

  useEffect(() => {
    if (!gridSize || !mediaReady) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const media = mediaRef.current;
    if (!wrapper || !canvas || !media) return;
    const canvasEl = canvas;

    const fluid = new FluidDynamicSolver(col, row);
    fluidRef.current = fluid;

    const size = (col + 2) * (row + 2);
    dUiRef.current = fluid.reset(new Float32Array(size));
    uUiRef.current = fluid.reset(new Float32Array(size));
    vUiRef.current = fluid.reset(new Float32Array(size));

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    const ctxEl = ctx;

    const canvasW = col * CELL_SIZE_PX;
    const canvasH = row * CELL_SIZE_PX;
    canvasEl.width = canvasW;
    canvasEl.height = canvasH;

    // Small luminance buffer: one pixel per sub-cell to minimize getImageData cost
    const lumWidth = col * SUB_GRID_SIZE;
    const lumHeight = row * SUB_GRID_SIZE;
    const lumCanvas = document.createElement('canvas');
    lumCanvas.width = lumWidth;
    lumCanvas.height = lumHeight;
    const lumCtx = lumCanvas.getContext('2d')!;

    function pointerMoveHandle(clientX: number, clientY: number) {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scaleX = canvasEl.width / rect.width;
      const scaleY = canvasEl.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      const tileW = CELL_SIZE_PX;
      const tileH = CELL_SIZE_PX;
      const tileX = Math.max(1, Math.min(col, ((x / tileW) | 0) + 1));
      const tileY = Math.max(1, Math.min(row, ((y / tileH) | 0) + 1));
      const last = lastRef.current;
      const d_ui = dUiRef.current;
      const u_ui = uUiRef.current;
      const v_ui = vUiRef.current;
      if (!d_ui || !u_ui || !v_ui) return;

      if (last !== null) {
        const deltaX = x - last.x;
        const deltaY = y - last.y;

        if (ctrl.emitDensity) {
          for (
            let i = Math.max(1, tileX - ctrl.emitDensityExpand);
            i <= Math.min(tileX + ctrl.emitDensityExpand, col);
            i++
          ) {
            for (
              let j = Math.max(1, tileY - ctrl.emitDensityExpand);
              j <= Math.min(tileY + ctrl.emitDensityExpand, row);
              j++
            ) {
              d_ui[fluid.idx(i, j)] +=
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) *
                ctrl.emitDensityScale;
            }
          }
        }

        if (ctrl.emitVelocity) {
          for (
            let i = Math.max(1, tileX - ctrl.emitVelocityExpand);
            i <= Math.min(tileX + ctrl.emitVelocityExpand, col);
            i++
          ) {
            for (
              let j = Math.max(1, tileY - ctrl.emitVelocityExpand);
              j <= Math.min(tileY + ctrl.emitVelocityExpand, row);
              j++
            ) {
              u_ui[fluid.idx(i, j)] += deltaX * ctrl.emitVelocityScale;
              v_ui[fluid.idx(i, j)] += deltaY * ctrl.emitVelocityScale;
            }
          }
        }
      }

      lastRef.current = { x, y };
    }

    const onPointer = (clientX: number, clientY: number) => {
      const rect = canvasEl.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        lastRef.current = null;
        return;
      }
      pointerMoveHandle(clientX, clientY);
    };

    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) onPointer(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let rafId: number;
    function loop() {
      const fluid = fluidRef.current;
      const d_ui = dUiRef.current;
      const u_ui = uUiRef.current;
      const v_ui = vUiRef.current;
      if (!fluid || !d_ui || !u_ui || !v_ui) return;

      const now = performance.now();
      const dt = lastTimeRef.current
        ? Math.min((now - lastTimeRef.current) / 1000, 1 / 30)
        : 1 / 60;
      lastTimeRef.current = now;

      fluid.set(fluid.d_prev, d_ui);
      fluid.set(fluid.u_prev, u_ui);
      fluid.set(fluid.v_prev, v_ui);
      fluid.stepVelocity(ctrl.visc, dt);
      fluid.stepDensity(ctrl.diff, dt);

      const cw = canvasEl.width;
      const ch = canvasEl.height;
      if (cw === 0 || ch === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const currentMedia = mediaRef.current;
      if (!currentMedia) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const tileW = cw / col;
      const tileH = ch / row;
      const d = fluid.d_next;

      // 1) Draw media to small luminance buffer (one pixel per sub-cell) for fast getImageData
      lumCtx.fillStyle = backgroundColor;
      lumCtx.fillRect(0, 0, lumWidth, lumHeight);
      drawMediaCover(lumCtx, currentMedia, lumWidth, lumHeight);
      const lumData = lumCtx.getImageData(0, 0, lumWidth, lumHeight).data;

      const halfTileW = tileW / 2;
      const halfTileH = tileH / 2;
      const subCellSize = tileW / SUB_GRID_SIZE;

      // 2) Halftone: draw into a single ImageData then putImageData once (faster than many fillRects)
      let imgData = imageDataRef.current;
      if (!imgData || imgData.width !== cw || imgData.height !== ch) {
        imageDataRef.current = ctxEl.createImageData(cw, ch);
        imgData = imageDataRef.current;
      }
      const out = imgData.data;
      const [br, bg, bb] = parseRgb(backgroundColor);
      const [dr, dg, db] = parseRgb(dotColor);
      const len = out.length;
      for (let i = 0; i < len; i += 4) {
        out[i] = br;
        out[i + 1] = bg;
        out[i + 2] = bb;
        out[i + 3] = 255;
      }

      for (let i = 1; i <= fluid.width; i++) {
        for (let j = 1; j <= fluid.height; j++) {
          const cx = (i - 1) * tileW + halfTileW;
          const cy = (j - 1) * tileH + halfTileH;
          const cellDensity = d[fluid.idx(i, j)];
          const isActive = cellDensity >= MOVEMENT_THRESHOLD;

          if (isActive) {
            const lx = (i - 1) * SUB_GRID_SIZE + 1;
            const ly = (j - 1) * SUB_GRID_SIZE + 1;
            const lum = getLuminance(lumData, ((ly * lumWidth + lx) | 0) * 4);
            if (lum <= MIN_DOT_THRESHOLD) continue;
            const normD = Math.min(1, MOVEMENT_THRESHOLD > 0 ? cellDensity / MOVEMENT_THRESHOLD : 1);
            const sizeFactor = 1 + normD * (MOVEMENT_RADIUS_SCALE - 1);
            const halfSize = lum * (tileW / 2) * DOT_RADIUS_SCALE * sizeFactor;
            if (halfSize > MIN_DOT_RADIUS) {
              fillRectInBuffer(out, cw, ch, cx, cy, halfSize, dr, dg, db);
            }
          } else {
            for (let si = 0; si < SUB_OFFSET_RATIOS.length; si++) {
              const [rx, ry] = SUB_OFFSET_RATIOS[si];
              const sx = si % SUB_GRID_SIZE;
              const sy = (si / SUB_GRID_SIZE) | 0;
              const lx = (i - 1) * SUB_GRID_SIZE + sx;
              const ly = (j - 1) * SUB_GRID_SIZE + sy;
              const lum = getLuminance(lumData, (ly * lumWidth + lx) * 4);
              if (lum <= MIN_DOT_THRESHOLD) continue;
              const halfSize = lum * (subCellSize / 2) * DOT_RADIUS_SCALE;
              if (halfSize > MIN_DOT_RADIUS) {
                const qx = cx + rx * tileW;
                const qy = cy + ry * tileH;
                fillRectInBuffer(out, cw, ch, qx, qy, halfSize, dr, dg, db);
              }
            }
          }
        }
      }
      ctxEl.putImageData(imgData, 0, 0);

      fluid.fadeOut(fluid.d_next, 1 - ctrl.fadeOutDensityRate);
      fluid.fadeOut(fluid.u_next, 1 - ctrl.fadeOutVelocityRate);
      fluid.fadeOut(fluid.v_next, 1 - ctrl.fadeOutVelocityRate);

      fluid.reset(d_ui);
      fluid.reset(u_ui);
      fluid.reset(v_ui);

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      fluidRef.current = null;
      dUiRef.current = null;
      uUiRef.current = null;
      vUiRef.current = null;
    };
  }, [width, height, col, row, mediaReady, ctrl]);

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <Canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: col * CELL_SIZE_PX,
          height: row * CELL_SIZE_PX,
        }}
      />
    </Wrapper>
  );
}
