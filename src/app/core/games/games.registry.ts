import type { GameKey, TextGame, Tone } from './text-game';
import { SnakeGame } from './snake';
import { MarioRunGame } from './mario-run';
import { RoadRushGame } from './road-rush';

export interface GameEntry {
  id: string;
  bin: string;
  title: string;
  tags: string;
  description: string;
  hint: string;
  controls: GameKey[];
  tones: Record<string, Tone>;
  storageKey: string;
  create: () => TextGame;
}

/** The games on /games, also used by the terminal's `play` command. */
export const GAMES: GameEntry[] = [
  {
    id: 'snake',
    bin: 'snake',
    title: 'Snake',
    tags: 'TypeScript · ASCII',
    description: 'Eat the * to grow. Hit a wall or yourself and the process exits.',
    hint: 'arrows / WASD to steer · P to pause',
    controls: ['left', 'up', 'down', 'right'],
    tones: { '@': 'primary', o: 'primary', '*': 'warn', '+': 'dim', '-': 'dim', '|': 'dim' },
    storageKey: 'snake-hi',
    create: () => new SnakeGame(),
  },
  {
    id: 'mario',
    bin: 'mario-run',
    title: 'Mario Run',
    tags: 'TypeScript · ASCII · physics',
    description: 'Side-scrolling runner: jump pits and # blocks, stomp g enemies from above, grab o coins.',
    hint: 'SPACE / ↑ to jump · P to pause',
    controls: ['action'],
    tones: { '@': 'primary', X: 'error', g: 'error', o: 'warn', '#': 'info', '=': 'muted', ':': 'dim', '~': 'dim' },
    storageKey: 'mario-hi',
    create: () => new MarioRunGame(),
  },
  {
    id: 'road',
    bin: 'road-rush',
    title: 'Road Rush',
    tags: 'TypeScript · ASCII',
    description: 'Three-lane dodger — traffic speeds up the longer you survive.',
    hint: '← / → (A / D) to change lanes · P to pause',
    controls: ['left', 'right'],
    tones: {
      '/': 'primary', '=': 'primary', '^': 'primary', '\\': 'primary', '[': 'primary', ']': 'primary', o: 'primary', '-': 'primary',
      '{': 'error', '}': 'error', '#': 'error', v: 'error', '*': 'error', X: 'error', x: 'error',
      '|': 'muted', ':': 'muted', '.': 'dim',
    },
    storageKey: 'road-hi',
    create: () => new RoadRushGame(),
  },
];
