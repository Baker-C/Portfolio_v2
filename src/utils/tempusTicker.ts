import Tempus from 'tempus';

type TempusFrameCallback = (time: number, deltaTimeMs: number) => void;

const callbacks = new Set<TempusFrameCallback>();
let stopGlobalTick: (() => void) | null = null;

function ensureGlobalTickRunning() {
  if (stopGlobalTick) return;

  stopGlobalTick = Tempus.add((time: number, deltaTimeMs: number) => {
    const snapshot = Array.from(callbacks);
    for (const cb of snapshot) {
      cb(time, deltaTimeMs);
    }
  }, {
    label: 'MouseLiquidGlobal',
    priority: 1,
  }) ?? null;
}

function stopGlobalTickIfIdle() {
  if (callbacks.size !== 0 || !stopGlobalTick) return;
  stopGlobalTick();
  stopGlobalTick = null;
}

export function subscribeGlobalTempus(callback: TempusFrameCallback): () => void {
  callbacks.add(callback);
  ensureGlobalTickRunning();

  return () => {
    callbacks.delete(callback);
    stopGlobalTickIfIdle();
  };
}
