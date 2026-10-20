/** Contract shared by the text-mode (ASCII) games. Engines are pure TypeScript. */

export type GameKey = 'up' | 'down' | 'left' | 'right' | 'action';

export type Tone = 'primary' | 'info' | 'warn' | 'error' | 'muted' | 'dim' | 'text';

export type Rng = () => number;

export interface TextGame {
  /** Frame size in character cells. */
  readonly cols: number;
  readonly rows: number;
  readonly score: number;
  readonly over: boolean;
  /** Delay before the next step; games speed up by returning less. */
  tickMs(): number;
  reset(): void;
  press(key: GameKey): void;
  step(): void;
  /** One string per row, each exactly `cols` characters long. */
  render(): string[];
}

/** Small deterministic hash used for scrolling scenery (grass, clouds). */
export function hash2(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Random integer in [min, max]. */
export const randInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
