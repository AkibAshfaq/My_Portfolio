import type { GameKey, Rng, TextGame } from './text-game';

type Dir = 'up' | 'down' | 'left' | 'right';
interface Point { x: number; y: number }

const W = 36;
const H = 16;
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const DELTA: Record<Dir, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

/** Classic snake: '@' head, 'o' body, '*' food, inside a +--+ box. */
export class SnakeGame implements TextGame {
  readonly cols = W + 2;
  readonly rows = H + 2;
  score = 0;
  over = false;

  body: Point[] = [];
  food: Point = { x: 0, y: 0 };
  private dir: Dir = 'right';
  /** Up to two buffered turns so quick key presses aren't lost. */
  private queue: Dir[] = [];

  constructor(private readonly rng: Rng = Math.random) {
    this.reset();
  }

  tickMs(): number {
    return Math.max(65, 120 - this.score * 2);
  }

  reset(): void {
    this.body = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    this.dir = 'right';
    this.queue = [];
    this.score = 0;
    this.over = false;
    this.spawnFood();
  }

  press(key: GameKey): void {
    if (key === 'action' || this.over) return;
    const last = this.queue[this.queue.length - 1] ?? this.dir;
    if (key !== last && key !== OPPOSITE[last] && this.queue.length < 2) {
      this.queue.push(key);
    }
  }

  step(): void {
    if (this.over) return;
    this.dir = this.queue.shift() ?? this.dir;
    const head = this.body[0];
    const next = { x: head.x + DELTA[this.dir].x, y: head.y + DELTA[this.dir].y };
    const eats = next.x === this.food.x && next.y === this.food.y;
    // The tail moves out of the way this tick unless the snake is growing.
    const blocking = eats ? this.body : this.body.slice(0, -1);

    if (next.x < 0 || next.x >= W || next.y < 0 || next.y >= H || blocking.some(p => p.x === next.x && p.y === next.y)) {
      this.over = true;
      return;
    }

    this.body.unshift(next);
    if (eats) {
      this.score++;
      this.spawnFood();
    } else {
      this.body.pop();
    }
  }

  render(): string[] {
    const grid = Array.from({ length: H }, () => Array<string>(W).fill(' '));
    grid[this.food.y][this.food.x] = '*';
    this.body.forEach((p, i) => (grid[p.y][p.x] = i === 0 ? '@' : 'o'));
    const edge = '+' + '-'.repeat(W) + '+';
    return [edge, ...grid.map(r => '|' + r.join('') + '|'), edge];
  }

  private spawnFood(): void {
    const free: Point[] = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!this.body.some(p => p.x === x && p.y === y)) free.push({ x, y });
      }
    }
    this.food = free[Math.floor(this.rng() * free.length)] ?? { x: 0, y: 0 };
  }
}
