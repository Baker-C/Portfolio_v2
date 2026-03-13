/**
 * 2D fluid dynamics solver (velocity + density).
 * Grid has width x height inner cells; +2 in each dimension for boundaries.
 */
export class FluidDynamicSolver {
  width: number;
  height: number;
  size: number;
  innerSize: number;

  u_prev: Float32Array;
  v_prev: Float32Array;
  d_prev: Float32Array;
  u_next: Float32Array;
  v_next: Float32Array;
  d_next: Float32Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = (this.width + 2) * (this.height + 2);
    this.innerSize = this.width * this.height;

    this.u_prev = this.reset(new Float32Array(this.size));
    this.v_prev = this.reset(new Float32Array(this.size));
    this.d_prev = this.reset(new Float32Array(this.size));
    this.u_next = this.reset(new Float32Array(this.size));
    this.v_next = this.reset(new Float32Array(this.size));
    this.d_next = this.reset(new Float32Array(this.size));
  }

  idx(x: number, y: number): number {
    return x + y * (this.width + 2);
  }

  addSource(source: Float32Array, target: Float32Array, dt: number): void {
    for (let i = 0; i < this.size; i++) {
      target[i] += source[i] * dt;
    }
  }

  /** Number of diffusion iterations; fewer = faster, more = smoother. */
  private static readonly DIFFUSE_ITERATIONS = 4;

  diffuse(
    prev: Float32Array,
    next: Float32Array,
    diff: number,
    dt: number,
    boundaryFlag: number
  ): void {
    const a = dt * diff;
    const iters = FluidDynamicSolver.DIFFUSE_ITERATIONS;
    for (let k = 0; k < iters; k++) {
      for (let i = 1; i <= this.width; i++) {
        for (let j = 1; j <= this.height; j++) {
          next[this.idx(i, j)] =
            (prev[this.idx(i, j)] +
              a *
                (next[this.idx(i - 1, j)] +
                  next[this.idx(i + 1, j)] +
                  next[this.idx(i, j - 1)] +
                  next[this.idx(i, j + 1)])) /
            (1 + 4 * a);
        }
      }
      this.setBoundary(next, boundaryFlag);
    }
  }

  advection(
    prev: Float32Array,
    next: Float32Array,
    u_next: Float32Array,
    v_next: Float32Array,
    dt: number,
    boundaryFlag: number
  ): void {
    const d = dt;
    for (let i = 1; i <= this.width; i++) {
      for (let j = 1; j <= this.height; j++) {
        const x = Math.min(
          Math.max(0.5, i - d * u_next[this.idx(i, j)]),
          this.width + 0.5
        );
        const y = Math.min(
          Math.max(0.5, j - d * v_next[this.idx(i, j)]),
          this.height + 0.5
        );
        const i0 = x | 0;
        const j0 = y | 0;
        const i1 = i0 + 1;
        const j1 = j0 + 1;
        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;
        next[this.idx(i, j)] =
          s0 * (t0 * prev[this.idx(i0, j0)] + t1 * prev[this.idx(i0, j1)]) +
          s1 * (t0 * prev[this.idx(i1, j0)] + t1 * prev[this.idx(i1, j1)]);
      }
    }
    this.setBoundary(next, boundaryFlag);
  }

  setBoundary(target: Float32Array, boundaryFlag: number): void {
    for (let i = 1; i <= this.width; i++) {
      target[this.idx(i, 0)] =
        (boundaryFlag === 2 ? -1 : 1) * target[this.idx(i, 1)];
      target[this.idx(i, this.height + 1)] =
        (boundaryFlag === 2 ? -1 : 1) * target[this.idx(i, this.height)];
    }
    for (let j = 1; j <= this.height; j++) {
      target[this.idx(0, j)] =
        (boundaryFlag === 1 ? -1 : 1) * target[this.idx(1, j)];
      target[this.idx(this.width + 1, j)] =
        (boundaryFlag === 1 ? -1 : 1) * target[this.idx(this.width, j)];
    }
    target[this.idx(0, 0)] =
      (target[this.idx(0, 1)] + target[this.idx(1, 0)]) / 2;
    target[this.idx(0, this.height + 1)] =
      (target[this.idx(0, this.height)] + target[this.idx(1, this.height + 1)]) /
      2;
    target[this.idx(this.width + 1, 0)] =
      (target[this.idx(this.width, 0)] + target[this.idx(this.width + 1, 1)]) /
      2;
    target[this.idx(this.width + 1, this.height + 1)] =
      (target[this.idx(this.width, this.height + 1)] +
        target[this.idx(this.width + 1, this.height)]) /
      2;
  }

  stepDensity(diff: number, dt: number): void {
    this.addSource(this.d_prev, this.d_next, dt);
    [this.d_prev, this.d_next] = [this.d_next, this.d_prev];
    this.diffuse(this.d_prev, this.d_next, diff, dt, 0);
    [this.d_prev, this.d_next] = [this.d_next, this.d_prev];
    this.advection(
      this.d_prev,
      this.d_next,
      this.u_next,
      this.v_next,
      dt,
      0
    );
  }

  stepVelocity(visc: number, dt: number): void {
    this.addSource(this.u_prev, this.u_next, dt);
    this.addSource(this.v_prev, this.v_next, dt);
    [this.u_prev, this.u_next] = [this.u_next, this.u_prev];
    this.diffuse(this.u_prev, this.u_next, visc, dt, 1);
    [this.v_prev, this.v_next] = [this.v_next, this.v_prev];
    this.diffuse(this.v_prev, this.v_next, visc, dt, 2);
    this.project(this.u_prev, this.v_prev, this.u_next, this.v_next);
    [this.u_prev, this.u_next] = [this.u_next, this.u_prev];
    [this.v_prev, this.v_next] = [this.v_next, this.v_prev];
    this.advection(
      this.u_prev,
      this.u_next,
      this.u_prev,
      this.v_prev,
      dt,
      1
    );
    this.advection(
      this.v_prev,
      this.v_next,
      this.u_prev,
      this.v_prev,
      dt,
      2
    );
    this.project(this.u_prev, this.v_prev, this.u_next, this.v_next);
  }

  project(
    p: Float32Array,
    div: Float32Array,
    u: Float32Array,
    v: Float32Array
  ): void {
    const h = 1 / this.width;
    for (let i = 1; i <= this.width; i++) {
      for (let j = 1; j <= this.height; j++) {
        div[this.idx(i, j)] =
          -0.5 *
          h *
          (u[this.idx(i + 1, j)] -
            u[this.idx(i - 1, j)] +
            v[this.idx(i, j + 1)] -
            v[this.idx(i, j - 1)]);
        p[this.idx(i, j)] = 0;
      }
    }
    this.setBoundary(div, 0);
    this.setBoundary(p, 0);
    for (let k = 0; k < FluidDynamicSolver.DIFFUSE_ITERATIONS; k++) {
      for (let i = 1; i <= this.width; i++) {
        for (let j = 1; j <= this.height; j++) {
          p[this.idx(i, j)] =
            (div[this.idx(i, j)] +
              (p[this.idx(i - 1, j)] +
                p[this.idx(i + 1, j)] +
                p[this.idx(i, j - 1)] +
                p[this.idx(i, j + 1)])) /
            4;
        }
      }
      this.setBoundary(p, 0);
    }
    for (let i = 1; i <= this.width; i++) {
      for (let j = 1; j <= this.height; j++) {
        u[this.idx(i, j)] -=
          (0.5 * (p[this.idx(i + 1, j)] - p[this.idx(i - 1, j)])) / h;
        v[this.idx(i, j)] -=
          (0.5 * (p[this.idx(i, j + 1)] - p[this.idx(i, j - 1)])) / h;
      }
    }
    this.setBoundary(u, 1);
    this.setBoundary(v, 2);
  }

  set(target: Float32Array, source: Float32Array): Float32Array {
    for (let i = 0; i < this.size; i++) {
      target[i] = source[i];
    }
    return target;
  }

  reset(target: Float32Array, value = 0): Float32Array {
    for (let i = 0; i < this.size; i++) {
      target[i] = value;
    }
    return target;
  }

  fadeOut(target: Float32Array, rate: number): Float32Array {
    for (let i = 0; i < this.size; i++) {
      target[i] *= rate;
    }
    return target;
  }
}
