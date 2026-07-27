import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/theme';
import { FluidDynamicSolver } from './fluidSolver';
import { subscribeGlobalTempus } from '@/utils/tempusTicker';

const OVERFLOW_CELLS = 12;

/**
 * Pointer farther than this (CSS px) from the canvas bounds is ignored for this instance
 * (avoids driving every MouseLiquid on the page from one cursor).
 */
const DEFAULT_POINTER_PROXIMITY_PX = 140;

// ——— Halftone / dot size (tweak these) ———
/** Pixel size of each grid cell (and max dot diameter). Larger = bigger, chunkier dots. */
const CELL_SIZE_PX = 20;
/** Luminance at or below this (0–1): no dot, solid black. Lower = more dark area becomes solid black. */
const MIN_DOT_THRESHOLD = 0.2;
/** Density above this triggers "movement" threshold behavior. */
const MOVEMENT_THRESHOLD = 0.01;
/** Active cells shrink dot size by this multiplier. */
const ACTIVE_DOT_SIZE_MULTIPLIER = 0.6;
/** Dot size scaling: luminance >= 0.9 => full sub-cell size. */
const DOT_SIZE_MAX_LUMINANCE = 0.9;
/** Dot size scaling: luminance <= 0.3 => minimum sub-cell size. */
const DOT_SIZE_MIN_LUMINANCE = 0.3;
/** Minimum dot size ratio relative to sub-cell size. */
const MIN_DOT_SIZE_RATIO = 0.25;
/** Maximum dot size ratio relative to sub-cell size. */
const MAX_DOT_SIZE_RATIO = 1.2;
/** Idle cells use this sub-grid size. */
const IDLE_SUB_GRID_SIZE = 6;
/** Active cells (mouse liquid affected) use this sub-grid size. */
const ACTIVE_SUB_GRID_SIZE = 2;
/** Sampling grid for luminance lookups (highest required sub-grid resolution). */
const LUM_SAMPLE_GRID_SIZE = Math.max(IDLE_SUB_GRID_SIZE, ACTIVE_SUB_GRID_SIZE);

function centerSubIndexForSize(size: number): number {
  return Math.floor((size - 1) / 2);
}

/** Precomputed sub-cell center ratios from cell center (-0.5..0.5). */
function buildSubOffsetRatios(size: number): [number, number][] {
  const r: [number, number][] = [];
  for (let sy = 0; sy < size; sy++) {
    for (let sx = 0; sx < size; sx++) {
      r.push([
        (2 * sx + 1) / (2 * size) - 0.5,
        (2 * sy + 1) / (2 * size) - 0.5,
      ]);
    }
  }
  return r;
}
const IDLE_SUB_OFFSET_RATIOS = buildSubOffsetRatios(IDLE_SUB_GRID_SIZE);
const ACTIVE_SUB_OFFSET_RATIOS = buildSubOffsetRatios(ACTIVE_SUB_GRID_SIZE);
// ———

const VIDEO_EXTENSIONS = /\.(webm|mp4|mov|ogg|ogv|m4v)(\?|$)/i;

/** True on mouse/trackpad-driven devices (desktop/laptop); false on touch-primary devices. */
function supportsHoverPointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url);
}

type DefaultMedia = HTMLImageElement | HTMLVideoElement;
type FluidStateSnapshot = {
  col: number;
  row: number;
  dNext: Float32Array;
  uNext: Float32Array;
  vNext: Float32Array;
};

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
      img.crossOrigin = 'anonymous';
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
  emitVelocityScale: 1.8,
  emitVelocityExpand: 0,
};

function mergeControl(control?: { options?: MouseLiquidControlOptions }): Required<MouseLiquidControlOptions> {
  const opts = control?.options ?? {};
  return { ...DEFAULT_CONTROL, ...opts };
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 0;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export type MouseLiquidProps = {
  className?: string;
  /**
   * Single image or video URL. Drawn with **cover**-style scaling (fills the frame; may crop),
   * then halftoned; movement above threshold halves dot radius.
   */
  image: string;
  /** Dot color. Defaults to theme accent. */
  dotColor?: string;
  /** Background color. Defaults to black. */
  backgroundColor?: string;
  /** Optional fluid simulation control; omitted fields use defaults. */
  control?: { options?: MouseLiquidControlOptions };
  /**
   * How far outside the canvas (CSS px) the pointer still influences this instance.
   * Mapping uses full canvas‑space coordinates (including past the bitmap edge); bilinear splats
   * onto edge cells when the cursor is nearby but not over the element.
   */
  interactionMarginPx?: number;
};

/**
 * Draws `media` centered on a `w`x`h` canvas, covering `coverW`x`coverH` (defaults to `w`x`h`).
 * Pass a smaller cover size when `w`/`h` include an offscreen margin (e.g. the fluid's
 * overflow-cell border), so the image's field of view matches the visible area instead of
 * being zoomed to cover the margin too.
 */
function drawMediaCover(
  ctx: CanvasRenderingContext2D,
  media: DefaultMedia,
  w: number,
  h: number,
  coverW: number = w,
  coverH: number = h
) {
  const iw = media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
  const ih = media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;
  if (!iw || !ih) return;
  const scale = Math.max(coverW / iw, coverH / ih);
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

/** Fill a diamond in the RGBA buffer (used for batched putImageData). */
function fillDiamondInBuffer(
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
  const h = Math.max(0, halfSize);
  const x0 = Math.max(0, (cx - h) | 0);
  const y0 = Math.max(0, (cy - h) | 0);
  const x1 = Math.min(cw, (cx + h + 1) | 0);
  const y1 = Math.min(ch, (cy + h + 1) | 0);
  for (let y = y0; y < y1; y++) {
    const dy = Math.abs(y + 0.5 - cy);
    const maxDx = h - dy;
    if (maxDx <= 0) continue;
    const startX = Math.max(x0, Math.floor(cx - maxDx));
    const endX = Math.min(x1, Math.ceil(cx + maxDx));
    const row = y * cw;
    for (let x = startX; x < endX; x++) {
      const i = (row + x) << 2;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
}

function getDotSizeRatioFromLuminance(lum: number): number {
  if (lum <= DOT_SIZE_MIN_LUMINANCE) return MIN_DOT_SIZE_RATIO;
  if (lum >= DOT_SIZE_MAX_LUMINANCE) return MAX_DOT_SIZE_RATIO;
  const t =
    (lum - DOT_SIZE_MIN_LUMINANCE) /
    (DOT_SIZE_MAX_LUMINANCE - DOT_SIZE_MIN_LUMINANCE);
  return MIN_DOT_SIZE_RATIO + t * (MAX_DOT_SIZE_RATIO - MIN_DOT_SIZE_RATIO);
}

export function MouseLiquid({
  className,
  image,
  dotColor = theme.colors.white,
  backgroundColor = theme.colors.black,
  control: controlProp,
  interactionMarginPx = DEFAULT_POINTER_PROXIMITY_PX,
}: MouseLiquidProps) {
  const ctrl = useMemo(() => mergeControl(controlProp), [controlProp]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState({ w: 0, h: 0 });
  const [isInViewport, setIsInViewport] = useState(true);

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

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInViewport(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '10% 0px 10% 0px',
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ceil (not floor): the inner grid must be at least as large as the measured wrapper size,
  // or drawMediaCover's cover-scale target undershoots the real visible area by up to one cell.
  const innerCol = Math.max(1, Math.ceil(width / CELL_SIZE_PX));
  const innerRow = Math.max(1, Math.ceil(height / CELL_SIZE_PX));
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
  const imageDataRef = useRef<ImageData | null>(null);
  const fluidStateSnapshotRef = useRef<FluidStateSnapshot | null>(null);

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
      fluidStateSnapshotRef.current = null;
      if (media instanceof HTMLVideoElement) {
        media.pause();
        media.removeAttribute('src');
      }
    };
  }, [image]);

  useEffect(() => {
    if (!gridSize || !mediaReady || !isInViewport) return;
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
    const snapshot = fluidStateSnapshotRef.current;
    if (snapshot && snapshot.col === col && snapshot.row === row) {
      fluid.set(fluid.d_next, snapshot.dNext);
      fluid.set(fluid.u_next, snapshot.uNext);
      fluid.set(fluid.v_next, snapshot.vNext);
    }

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    const ctxEl = ctx;

    const canvasW = col * CELL_SIZE_PX;
    const canvasH = row * CELL_SIZE_PX;
    canvasEl.width = canvasW;
    canvasEl.height = canvasH;
    // 1:1 bitmap-to-CSS-px mapping so dot size (CELL_SIZE_PX) is identical on every instance;
    // the overflow-cell margin bleeds past the Wrapper's edges and gets clipped by its `overflow: hidden`.
    canvasEl.style.width = `${canvasW}px`;
    canvasEl.style.height = `${canvasH}px`;

    // Small luminance buffer: one pixel per sub-cell to minimize getImageData cost
    const lumWidth = col * LUM_SAMPLE_GRID_SIZE;
    const lumHeight = row * LUM_SAMPLE_GRID_SIZE;
    const lumCanvas = document.createElement('canvas');
    lumCanvas.width = lumWidth;
    lumCanvas.height = lumHeight;
    // Hint for repeated getImageData after drawImage (video frames); improves readback path in Chromium.
    const lum2dOrNull = lumCanvas.getContext('2d', { willReadFrequently: true });
    if (!lum2dOrNull) return;
    // Separate binding so the inner `onFrame` closure is typed (narrowing is not applied inside nested functions)
    const ctxLum: CanvasRenderingContext2D = lum2dOrNull;

    function pointerMoveHandle(clientX: number, clientY: number) {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scaleX = canvasEl.width / rect.width;
      const scaleY = canvasEl.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      const tileW = canvasEl.width / col;
      const tileH = canvasEl.height / row;
      const last = lastRef.current;
      const d_ui = dUiRef.current;
      const u_ui = uUiRef.current;
      const v_ui = vUiRef.current;
      if (!d_ui || !u_ui || !v_ui) return;

      /** Maps canvas-pixel coords (may lie outside the bitmap) into bilinear weights on fluid cells. */
      const stampAt = (
        stampX: number,
        stampY: number,
        velX: number,
        velY: number,
        densityAmount: number
      ) => {
        const ax = stampX / tileW;
        const ay = stampY / tileH;
        const ix0 = Math.floor(ax);
        const iy0 = Math.floor(ay);
        const tx = ax - ix0;
        const ty = ay - iy0;
        const w00 = (1 - tx) * (1 - ty);
        const w10 = tx * (1 - ty);
        const w01 = (1 - tx) * ty;
        const w11 = tx * ty;

        type Corner = readonly [number, number, number];
        const corners: Corner[] = [
          [ix0, iy0, w00],
          [ix0 + 1, iy0, w10],
          [ix0, iy0 + 1, w01],
          [ix0 + 1, iy0 + 1, w11],
        ];

        let wSum = 0;
        const valid: [number, number, number][] = [];
        for (const [cx, cy, w] of corners) {
          if (w <= 0) continue;
          const fi = cx + 1;
          const fj = cy + 1;
          if (fi < 1 || fi > col || fj < 1 || fj > row) continue;
          valid.push([fi, fj, w]);
          wSum += w;
        }
        if (wSum <= 0 || valid.length === 0) return;

        for (const [centerFi, centerFj, w] of valid) {
          const wn = w / wSum;

          if (ctrl.emitDensity) {
            for (
              let i = Math.max(1, centerFi - ctrl.emitDensityExpand);
              i <= Math.min(centerFi + ctrl.emitDensityExpand, col);
              i++
            ) {
              for (
                let j = Math.max(1, centerFj - ctrl.emitDensityExpand);
                j <= Math.min(centerFj + ctrl.emitDensityExpand, row);
                j++
              ) {
                d_ui[fluid.idx(i, j)] +=
                  densityAmount * wn * ctrl.emitDensityScale;
              }
            }
          }

          if (ctrl.emitVelocity) {
            for (
              let i = Math.max(1, centerFi - ctrl.emitVelocityExpand);
              i <= Math.min(centerFi + ctrl.emitVelocityExpand, col);
              i++
            ) {
              for (
                let j = Math.max(1, centerFj - ctrl.emitVelocityExpand);
                j <= Math.min(centerFj + ctrl.emitVelocityExpand, row);
                j++
              ) {
                u_ui[fluid.idx(i, j)] += velX * wn * ctrl.emitVelocityScale;
                v_ui[fluid.idx(i, j)] += velY * wn * ctrl.emitVelocityScale;
              }
            }
          }
        }
      };

      if (last !== null) {
        const deltaX = x - last.x;
        const deltaY = y - last.y;
        const moveLen = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const stampSpacing = Math.max(1, Math.min(tileW, tileH) * 0.5);
        const steps = Math.max(1, Math.min(16, Math.ceil(moveLen / stampSpacing)));
        const perStepDensity = steps > 0 ? moveLen / steps : 0;
        const perStepVelX = steps > 0 ? deltaX / steps : 0;
        const perStepVelY = steps > 0 ? deltaY / steps : 0;

        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const stampX = last.x + deltaX * t;
          const stampY = last.y + deltaY * t;
          stampAt(stampX, stampY, perStepVelX, perStepVelY, perStepDensity);
        }
      }

      lastRef.current = { x, y };
    }

    const marginPx = interactionMarginPx;

    const onPointer = (clientX: number, clientY: number) => {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (
        clientX < rect.left - marginPx ||
        clientX > rect.right + marginPx ||
        clientY < rect.top - marginPx ||
        clientY > rect.bottom + marginPx
      ) {
        lastRef.current = null;
        return;
      }

      pointerMoveHandle(clientX, clientY);
    };

    // Listen on window so the effect still reacts when overlaying elements sit above the canvas.
    const onPointerMove = (e: PointerEvent) => onPointer(e.clientX, e.clientY);
    const onPointerLeave = () => {
      lastRef.current = null;
    };
    // Touch devices report pointermove during scroll/drag; only wire up the interaction on
    // hover-capable, fine-pointer (mouse/trackpad) devices so the halftone image still renders
    // everywhere but the liquid-distortion effect stays a desktop/laptop-only affordance.
    const canInteract = supportsHoverPointer();
    if (canInteract) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    function onFrame(_time: number, deltaTimeMs: number) {
      const fluid = fluidRef.current;
      const d_ui = dUiRef.current;
      const u_ui = uUiRef.current;
      const v_ui = vUiRef.current;
      if (!fluid || !d_ui || !u_ui || !v_ui) return;

      // Tempus `deltaTime` is ms; first frame can be 0
      const dt =
        deltaTimeMs > 0
          ? Math.min(deltaTimeMs / 1000, 1 / 30)
          : 1 / 60;

      fluid.set(fluid.d_prev, d_ui);
      fluid.set(fluid.u_prev, u_ui);
      fluid.set(fluid.v_prev, v_ui);
      fluid.stepVelocity(ctrl.visc, dt);
      fluid.stepDensity(ctrl.diff, dt);

      const cw = canvasEl.width;
      const ch = canvasEl.height;
      if (cw === 0 || ch === 0) {
        return;
      }

      const currentMedia = mediaRef.current;
      if (!currentMedia) {
        return;
      }

      const tileW = cw / col;
      const tileH = ch / row;
      const d = fluid.d_next;

      // 1) Draw media to small luminance buffer (one pixel per sub-cell) for fast getImageData
      ctxLum.fillStyle = backgroundColor;
      ctxLum.fillRect(0, 0, lumWidth, lumHeight);
      // Cover the visible (inner) area only; the overflow-cell border is just along for the
      // ride at the same scale, so the media isn't zoomed in to cover the offscreen margin too.
      drawMediaCover(
        ctxLum,
        currentMedia,
        lumWidth,
        lumHeight,
        innerCol * LUM_SAMPLE_GRID_SIZE,
        innerRow * LUM_SAMPLE_GRID_SIZE
      );
      let lumData: Uint8ClampedArray;
      try {
        lumData = ctxLum.getImageData(0, 0, lumWidth, lumHeight).data;
      } catch {
        // If media is cross-origin without CORS headers, canvas readback is blocked.
        // Keep rendering stable with a white luminance fallback instead of throwing.
        lumData = new Uint8ClampedArray(lumWidth * lumHeight * 4).fill(255);
      }

      const halfTileW = tileW / 2;
      const halfTileH = tileH / 2;
      // 2) Halftone: draw into a single ImageData then putImageData once (faster than many fillRects)
      let imgData = imageDataRef.current;
      if (!imgData || imgData.width !== cw || imgData.height !== ch) {
        imageDataRef.current = ctxEl.createImageData(cw, ch);
        imgData = imageDataRef.current;
      }
      const out = imgData.data;
      const [br, bg, bb] = parseRgb(backgroundColor);
      const [dr, dg, db] = parseRgb(dotColor);
      // One 32-bit write per pixel instead of four byte writes (major win vs full-CPU clear loop)
      new Uint32Array(out.buffer, out.byteOffset, out.length >> 2).fill(
        br | (bg << 8) | (bb << 16) | (255 << 24)
      );

      for (let i = 1; i <= fluid.width; i++) {
        for (let j = 1; j <= fluid.height; j++) {
          const cx = (i - 1) * tileW + halfTileW;
          const cy = (j - 1) * tileH + halfTileH;
          const cellDensity = d[fluid.idx(i, j)];
          const isActive = cellDensity >= MOVEMENT_THRESHOLD;
          const lumThreshold = MIN_DOT_THRESHOLD;
          const activeSizeMultiplier = isActive ? ACTIVE_DOT_SIZE_MULTIPLIER : 1;
          let drewDot = false;

          const currentSubGridSize = isActive ? ACTIVE_SUB_GRID_SIZE : IDLE_SUB_GRID_SIZE;
          const currentOffsets = isActive
            ? ACTIVE_SUB_OFFSET_RATIOS
            : IDLE_SUB_OFFSET_RATIOS;
          const currentCenterSubIndex = centerSubIndexForSize(currentSubGridSize);
          const subCellSize = tileW / currentSubGridSize;
          const subHalfSize = subCellSize / 2;

          for (let si = 0; si < currentOffsets.length; si++) {
            const [rx, ry] = currentOffsets[si];
            const sx = si % currentSubGridSize;
            const sy = (si / currentSubGridSize) | 0;
            const lumSx = Math.min(
              LUM_SAMPLE_GRID_SIZE - 1,
              Math.floor(((sx + 0.5) * LUM_SAMPLE_GRID_SIZE) / currentSubGridSize)
            );
            const lumSy = Math.min(
              LUM_SAMPLE_GRID_SIZE - 1,
              Math.floor(((sy + 0.5) * LUM_SAMPLE_GRID_SIZE) / currentSubGridSize)
            );
            const lx = (i - 1) * LUM_SAMPLE_GRID_SIZE + lumSx;
            const ly = (j - 1) * LUM_SAMPLE_GRID_SIZE + lumSy;
            const lum = getLuminance(lumData, (ly * lumWidth + lx) * 4);
            if (lum <= lumThreshold) continue;
            const qx = cx + rx * tileW;
            const qy = cy + ry * tileH;
            const dotHalfSize =
              subHalfSize *
              getDotSizeRatioFromLuminance(lum) *
              activeSizeMultiplier;
            fillDiamondInBuffer(out, cw, ch, qx, qy, dotHalfSize, dr, dg, db);
            drewDot = true;
          }

          // Ensure at least one illuminated dot per cell (center fallback).
          if (!drewDot) {
            const sx = currentCenterSubIndex;
            const sy = currentCenterSubIndex;
            const [rx, ry] = currentOffsets[sy * currentSubGridSize + sx];
            const lumSx = Math.min(
              LUM_SAMPLE_GRID_SIZE - 1,
              Math.floor(((sx + 0.5) * LUM_SAMPLE_GRID_SIZE) / currentSubGridSize)
            );
            const lumSy = Math.min(
              LUM_SAMPLE_GRID_SIZE - 1,
              Math.floor(((sy + 0.5) * LUM_SAMPLE_GRID_SIZE) / currentSubGridSize)
            );
            const lx = (i - 1) * LUM_SAMPLE_GRID_SIZE + lumSx;
            const ly = (j - 1) * LUM_SAMPLE_GRID_SIZE + lumSy;
            const lum = getLuminance(lumData, (ly * lumWidth + lx) * 4);
            const qx = cx + rx * tileW;
            const qy = cy + ry * tileH;
            const dotHalfSize =
              subHalfSize * getDotSizeRatioFromLuminance(lum) * activeSizeMultiplier;
            fillDiamondInBuffer(out, cw, ch, qx, qy, dotHalfSize, dr, dg, db);
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
    }

    const unsubscribe = subscribeGlobalTempus(onFrame);

    return () => {
      unsubscribe?.();
      if (canInteract) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
      }
      fluidStateSnapshotRef.current = {
        col,
        row,
        dNext: new Float32Array(fluid.d_next),
        uNext: new Float32Array(fluid.u_next),
        vNext: new Float32Array(fluid.v_next),
      };
      fluidRef.current = null;
      dUiRef.current = null;
      uUiRef.current = null;
      vUiRef.current = null;
    };
  }, [width, height, col, row, mediaReady, ctrl, isInViewport, interactionMarginPx]);

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <Canvas ref={canvasRef} />
    </Wrapper>
  );
}
