import { hash2, randInt, type GameKey, type Rng, type TextGame } from './text-game';

const COLS = 56;
const ROWS = 14;
const PLAYER_X = 8;
/** Row the player stands on at height 0. */
const BASE = ROWS - 3;
/** Height above ground for each tick of a jump. */
const ARC = [1, 2, 3, 3, 3, 2, 1];
const PEAK = 4;

interface Column {
  ground: boolean;
  block: number; // height of a '#' block, 0 = none
  enemy: boolean;
  coin: number; // height of a coin, 0 = none
}

const plain = (): Column => ({ ground: true, block: 0, enemy: false, coin: 0 });

/**
 * Side-scrolling runner. The world scrolls one column per tick; jump over
 * pits and blocks, stomp 'g' enemies from above and collect 'o' coins.
 */
export class MarioRunGame implements TextGame {
  readonly cols = COLS;
  readonly rows = ROWS;
  score = 0;
  over = false;

  height = 0;
  world: Column[] = [];
  private jump = -1; // index into ARC, -1 when on the ground
  private wantsJump = false;
  private ticks = 0;
  private bonus = 0;
  private cooldown = 0;
  private pending: Column[] = [];

  constructor(private readonly rng: Rng = Math.random) {
    this.reset();
  }

  tickMs(): number {
    return Math.max(42, 80 - Math.floor(this.ticks / 150) * 4);
  }

  reset(): void {
    this.world = Array.from({ length: COLS }, plain);
    this.height = 0;
    this.jump = -1;
    this.wantsJump = false;
    this.ticks = 0;
    this.bonus = 0;
    this.cooldown = 12;
    this.pending = [];
    this.score = 0;
    this.over = false;
  }

  press(key: GameKey): void {
    if (key === 'up' || key === 'action') this.wantsJump = true;
  }

  step(): void {
    if (this.over) return;
    this.ticks++;
    this.world.shift();
    this.world.push(this.generate());

    if (this.jump >= 0) {
      this.jump++;
      if (this.jump >= ARC.length) this.jump = -1;
    }
    // A new jump starts at ARC[0], so the player is airborne for ARC.length ticks.
    if (this.wantsJump && this.jump === -1) this.jump = 0;
    this.wantsJump = false;
    this.height = this.jump >= 0 ? ARC[this.jump] : 0;

    const col = this.world[PLAYER_X];
    if (col.block > this.height) {
      this.over = true;
    } else if (!col.ground && this.height === 0) {
      this.over = true;
    } else if (col.enemy) {
      if (this.height === 0) {
        this.over = true;
      } else if (this.jump > PEAK && this.height <= 1) {
        // Stomp: remove the enemy and bounce back up.
        col.enemy = false;
        this.bonus += 25;
        this.jump = 1;
        this.height = ARC[1];
      }
    }
    if (!this.over && col.coin && col.coin === this.height) {
      col.coin = 0;
      this.bonus += 10;
    }
    this.score = Math.floor(this.ticks / 3) + this.bonus;
  }

  render(): string[] {
    const grid = Array.from({ length: ROWS }, () => Array<string>(COLS).fill(' '));
    for (let x = 0; x < COLS; x++) {
      // Clouds drift at half speed for a little parallax.
      for (const y of [1, 2]) {
        if (hash2(x + Math.floor(this.ticks / 2), y) < 0.06) grid[y][x] = '~';
      }
      const c = this.world[x];
      if (c.ground) {
        grid[ROWS - 2][x] = '=';
        grid[ROWS - 1][x] = ':';
      }
      for (let h = 0; h < c.block; h++) grid[BASE - h][x] = '#';
      if (c.enemy) grid[BASE][x] = 'g';
      if (c.coin) grid[BASE - c.coin][x] = 'o';
    }
    const fell = this.over && !this.world[PLAYER_X].ground;
    grid[fell ? ROWS - 1 : BASE - this.height][PLAYER_X] = this.over ? 'X' : '@';
    return grid.map(r => r.join(''));
  }

  private generate(): Column {
    if (this.pending.length) return this.pending.shift()!;
    if (this.cooldown > 0) {
      this.cooldown--;
      const c = plain();
      if (this.rng() < 0.12) c.coin = randInt(this.rng, 2, 3);
      return c;
    }

    const r = this.rng();
    const width = randInt(this.rng, 1, 2);
    let feature: Column[];
    if (r < 0.3) {
      const h = randInt(this.rng, 1, 2);
      feature = Array.from({ length: width }, () => ({ ...plain(), block: h }));
    } else if (r < 0.55) {
      // Pits: up to three columns wide, often with a coin above.
      feature = Array.from({ length: width + 1 }, () => ({ ...plain(), ground: false }));
      if (this.rng() < 0.6) feature[Math.floor(feature.length / 2)].coin = 3;
    } else {
      feature = [{ ...plain(), enemy: true }];
    }
    this.cooldown = randInt(this.rng, 7, 13);
    this.pending = feature.slice(1);
    return feature[0];
  }
}
