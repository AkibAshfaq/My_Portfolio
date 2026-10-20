import { describe, it, expect } from 'vitest';
import { SnakeGame } from './snake';
import { RoadRushGame } from './road-rush';
import { MarioRunGame } from './mario-run';
import type { TextGame } from './text-game';

/** Deterministic RNG so tests are repeatable. */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function expectFrameShape(game: TextGame) {
  const frame = game.render();
  expect(frame.length).toBe(game.rows);
  for (const row of frame) expect(row.length).toBe(game.cols);
}

describe('SnakeGame', () => {
  it('renders a frame of the declared size', () => {
    expectFrameShape(new SnakeGame(seeded()));
  });

  it('moves right by default and ignores reversing into itself', () => {
    const g = new SnakeGame(seeded());
    g.food = { x: 0, y: 0 };
    g.press('left');
    g.step();
    expect(g.body[0]).toEqual({ x: 9, y: 8 });
  });

  it('grows and scores when eating', () => {
    const g = new SnakeGame(seeded());
    g.food = { x: 9, y: 8 };
    g.step();
    expect(g.score).toBe(1);
    expect(g.body.length).toBe(4);
  });

  it('dies on hitting a wall', () => {
    const g = new SnakeGame(seeded());
    g.food = { x: 0, y: 0 };
    g.press('up');
    for (let i = 0; i < 20 && !g.over; i++) g.step();
    expect(g.over).toBe(true);
  });
});

describe('RoadRushGame', () => {
  it('renders a frame of the declared size', () => {
    const g = new RoadRushGame(seeded());
    for (let i = 0; i < 30; i++) g.step();
    expectFrameShape(g);
  });

  it('switches lanes within bounds', () => {
    const g = new RoadRushGame(seeded());
    g.press('left');
    g.press('left');
    expect(g.lane).toBe(0);
    g.press('right');
    g.press('right');
    g.press('right');
    expect(g.lane).toBe(2);
  });

  it('crashes when a car reaches the player lane', () => {
    const g = new RoadRushGame(seeded());
    g.cars = [{ lane: g.lane, y: 10 }];
    for (let i = 0; i < 10 && !g.over; i++) g.step();
    expect(g.over).toBe(true);
  });

  it('never blocks every lane near the top', () => {
    const g = new RoadRushGame(seeded(7));
    for (let i = 0; i < 2000 && !g.over; i++) {
      g.step();
      const top = new Set(g.cars.filter(c => c.y < 4).map(c => c.lane));
      expect(top.size).toBeLessThan(3);
    }
  });
});

describe('MarioRunGame', () => {
  it('renders a frame of the declared size', () => {
    const g = new MarioRunGame(seeded());
    for (let i = 0; i < 5; i++) g.step();
    expectFrameShape(g);
  });

  it('follows the full jump arc', () => {
    const g = new MarioRunGame(seeded());
    g.press('up');
    const heights: number[] = [];
    for (let i = 0; i < 8; i++) {
      g.step();
      heights.push(g.height);
    }
    expect(heights).toEqual([1, 2, 3, 3, 3, 2, 1, 0]);
  });

  it('falls into a pit when not jumping', () => {
    const g = new MarioRunGame(seeded());
    g.world[9].ground = false;
    g.step();
    expect(g.over).toBe(true);
  });

  it('clears a 3-wide pit with a well-timed jump', () => {
    const g = new MarioRunGame(seeded());
    for (const x of [10, 11, 12]) g.world[x].ground = false;
    g.press('up');
    for (let i = 0; i < 8; i++) g.step();
    expect(g.over).toBe(false);
  });

  it('stomps an enemy when landing on it', () => {
    const g = new MarioRunGame(seeded());
    g.world[15].enemy = true; // reached on the 7th tick, at height 1 while descending
    g.press('up');
    for (let i = 0; i < 7; i++) g.step();
    expect(g.over).toBe(false);
    expect(g.score).toBeGreaterThanOrEqual(25);
  });

  it('is survivable: a jump always clears the next obstacle', () => {
    // Bot: jump whenever a hazard is 2 columns ahead.
    const g = new MarioRunGame(seeded(3));
    for (let i = 0; i < 3000 && !g.over; i++) {
      const ahead = g.world[10];
      if (!ahead.ground || ahead.block || ahead.enemy) g.press('up');
      g.step();
    }
    expect(g.over).toBe(false);
  });
});
