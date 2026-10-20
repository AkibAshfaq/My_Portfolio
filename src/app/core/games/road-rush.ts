import { hash2, randInt, type GameKey, type Rng, type TextGame } from './text-game';

const LANES = 3;
const LANE_W = 7;
const GRASS = 4;
const ROWS = 20;
const COLS = GRASS * 2 + 2 + LANES * LANE_W + (LANES - 1);
const PLAYER_Y = ROWS - 3;

const PLAYER = ['/=^=\\', '[o-o]'];
// Different glyphs from the player so the two can be coloured differently.
const ENEMY = ['{#v#}', '{###}'];

interface Car { lane: number; y: number }

/** Top-down three-lane dodger. Cars scroll down; switch lanes with ←/→. */
export class RoadRushGame implements TextGame {
  readonly cols = COLS;
  readonly rows = ROWS;
  score = 0;
  over = false;

  lane = 1;
  cars: Car[] = [];
  private ticks = 0;
  private passed = 0;
  private untilSpawn = 0;

  constructor(private readonly rng: Rng = Math.random) {
    this.reset();
  }

  tickMs(): number {
    return Math.max(45, 110 - Math.floor(this.ticks / 40) * 5);
  }

  reset(): void {
    this.lane = 1;
    this.cars = [];
    this.ticks = 0;
    this.passed = 0;
    this.untilSpawn = 3;
    this.score = 0;
    this.over = false;
  }

  press(key: GameKey): void {
    if (this.over) return;
    if (key === 'left') this.lane = Math.max(0, this.lane - 1);
    if (key === 'right') this.lane = Math.min(LANES - 1, this.lane + 1);
    if (this.hit()) this.over = true;
  }

  step(): void {
    if (this.over) return;
    this.ticks++;
    for (const car of this.cars) car.y++;
    const before = this.cars.length;
    this.cars = this.cars.filter(c => c.y < ROWS);
    this.passed += before - this.cars.length;

    if (--this.untilSpawn <= 0) {
      this.spawn();
      // Gaps shrink as the game speeds up.
      this.untilSpawn = randInt(this.rng, 3, Math.max(4, 8 - Math.floor(this.ticks / 120)));
    }

    this.score = this.passed * 10 + Math.floor(this.ticks / 5);
    if (this.hit()) this.over = true;
  }

  render(): string[] {
    const rows: string[] = [];
    for (let y = 0; y < ROWS; y++) {
      const row = Array<string>(COLS).fill(' ');
      for (let x = 0; x < GRASS; x++) {
        if (hash2(x, y - this.ticks) < 0.12) row[x] = '.';
        if (hash2(x + 99, y - this.ticks) < 0.12) row[COLS - 1 - x] = '.';
      }
      row[GRASS] = '|';
      row[COLS - GRASS - 1] = '|';
      for (let d = 1; d < LANES; d++) {
        // Dashed lane markers scroll down with the traffic.
        row[this.laneX(d) - 1] = (((y - this.ticks) % 3) + 3) % 3 === 0 ? ' ' : ':';
      }
      rows.push(row.join(''));
    }

    const put = (sprite: string[], lane: number, top: number) => {
      sprite.forEach((line, i) => {
        const y = top + i;
        if (y < 0 || y >= ROWS) return;
        const x = this.laneX(lane) + 1;
        rows[y] = rows[y].slice(0, x) + line + rows[y].slice(x + line.length);
      });
    };
    for (const car of this.cars) put(ENEMY, car.lane, car.y);
    put(this.over ? ['\\*X*/', '[x-x]'] : PLAYER, this.lane, PLAYER_Y);
    return rows;
  }

  /** Left edge (inclusive) of a lane, in columns. */
  private laneX(lane: number): number {
    return GRASS + 1 + lane * (LANE_W + 1);
  }

  private spawn(): void {
    // Keep the road passable: never fill every lane near the top at once.
    const busy = new Set(this.cars.filter(c => c.y < 4).map(c => c.lane));
    if (busy.size >= LANES - 1) return;
    const free = [...Array(LANES).keys()].filter(l => !busy.has(l));
    this.cars.push({ lane: free[Math.floor(this.rng() * free.length)], y: -2 });
  }

  private hit(): boolean {
    return this.cars.some(c => c.lane === this.lane && c.y + 1 >= PLAYER_Y && c.y <= PLAYER_Y + 1);
  }
}
