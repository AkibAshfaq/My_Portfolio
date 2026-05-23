import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'playing' | 'gameover';
interface Point { x: number; y: number; }

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const CANVAS_SIZE = CELL * COLS;

@Component({
  selector: 'app-snake-game',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-4 select-none">
      <div class="flex items-center justify-between w-full" style="max-width: 400px">
        <span class="text-sm font-medium text-(--color-text-muted)">
          Score: <strong class="text-(--color-text)">{{ score() }}</strong>
        </span>
        <span class="text-sm font-medium text-(--color-text-muted)">
          Best: <strong class="text-(--color-primary)">{{ highScore() }}</strong>
        </span>
      </div>

      <div class="relative" style="max-width: 400px; width: 100%">
        <canvas
          #gameCanvas
          [width]="CANVAS_SIZE"
          [height]="CANVAS_SIZE"
          class="rounded-xl border border-(--color-border) w-full"
          style="touch-action: none; display: block;"
        ></canvas>

        @if (gameState() !== 'playing') {
          <div
            class="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3"
            style="background: rgba(0,0,0,0.55); backdrop-filter: blur(4px)"
          >
            @if (gameState() === 'idle') {
              <p class="text-4xl" aria-hidden="true">🐍</p>
              <p class="text-xl font-extrabold text-white">Snake</p>
              <p class="text-xs text-gray-300 text-center px-6">Arrow keys / WASD to move · Swipe on mobile</p>
              <button
                type="button"
                (click)="startGame()"
                class="mt-2 rounded-xl bg-(--color-primary) px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Start Game
              </button>
            }
            @if (gameState() === 'gameover') {
              <p class="text-4xl" aria-hidden="true">💀</p>
              <p class="text-xl font-extrabold text-white">Game Over</p>
              <p class="text-sm text-gray-300">Score: {{ score() }}</p>
              @if (score() === highScore() && score() > 0) {
                <p class="text-xs font-semibold text-yellow-400">New High Score!</p>
              }
              <button
                type="button"
                (click)="startGame()"
                class="mt-2 rounded-xl bg-(--color-primary) px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Play Again
              </button>
            }
          </div>
        }
      </div>

      <p class="text-xs text-(--color-text-muted)">
        Arrow keys / WASD on desktop · Swipe on mobile
      </p>
    </div>
  `,
})
export class SnakeGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private platformId = inject(PLATFORM_ID);

  readonly CANVAS_SIZE = CANVAS_SIZE;
  readonly score = signal(0);
  readonly highScore = signal(0);
  readonly gameState = signal<GameState>('idle');

  private ctx!: CanvasRenderingContext2D;
  private snake: Point[] = [];
  private food: Point = { x: 5, y: 5 };
  private direction: Direction = 'RIGHT';
  private nextDirection: Direction = 'RIGHT';
  private loop: ReturnType<typeof setInterval> | null = null;
  private touchX = 0;
  private touchY = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const saved = localStorage.getItem('snake-hi');
    if (saved) this.highScore.set(+saved);
    this.drawBackground();
    window.addEventListener('keydown', this.onKey);
    const el = this.canvasRef.nativeElement;
    el.addEventListener('touchstart', this.onTouchStart, { passive: true });
    el.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  ngOnDestroy(): void {
    this.clearLoop();
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('keydown', this.onKey);
    const el = this.canvasRef?.nativeElement;
    el?.removeEventListener('touchstart', this.onTouchStart);
    el?.removeEventListener('touchend', this.onTouchEnd);
  }

  startGame(): void {
    this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.score.set(0);
    this.spawnFood();
    this.gameState.set('playing');
    this.clearLoop();
    this.loop = setInterval(() => this.tick(), 130);
  }

  private tick(): void {
    this.direction = this.nextDirection;
    const h = this.snake[0];
    const next: Point = {
      x: h.x + (this.direction === 'RIGHT' ? 1 : this.direction === 'LEFT' ? -1 : 0),
      y: h.y + (this.direction === 'DOWN' ? 1 : this.direction === 'UP' ? -1 : 0),
    };

    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS ||
        this.snake.some(p => p.x === next.x && p.y === next.y)) {
      this.clearLoop();
      this.gameState.set('gameover');
      return;
    }

    this.snake.unshift(next);
    if (next.x === this.food.x && next.y === this.food.y) {
      const s = this.score() + 1;
      this.score.set(s);
      if (s > this.highScore()) {
        this.highScore.set(s);
        localStorage.setItem('snake-hi', String(s));
      }
      this.spawnFood();
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  private spawnFood(): void {
    let f: Point;
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (this.snake.some(p => p.x === f.x && p.y === f.y));
    this.food = f;
  }

  private drawBackground(): void {
    const dark = document.documentElement.classList.contains('dark');
    this.ctx.fillStyle = dark ? '#1c1c2a' : '#f1f5f9';
    this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  private draw(): void {
    const ctx = this.ctx;
    const dark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = dark ? '#1c1c2a' : '#f1f5f9';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // subtle grid
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, CANVAS_SIZE); ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(CANVAS_SIZE, j * CELL); ctx.stroke();
    }

    // food — pulsing red dot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(this.food.x * CELL + CELL / 2, this.food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();

    // snake
    this.snake.forEach((p, i) => {
      const alpha = i === 0 ? 1 : Math.max(0.25, 1 - (i / this.snake.length) * 0.75);
      ctx.fillStyle = i === 0 ? '#22c55e' : `rgba(34,197,94,${alpha})`;
      const pad = i === 0 ? 1 : 2;
      const r = i === 0 ? 5 : 3;
      const x = p.x * CELL + pad;
      const y = p.y * CELL + pad;
      const w = CELL - pad * 2;
      const h = CELL - pad * 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    });

    // eyes on head
    if (this.snake.length > 0) {
      const head = this.snake[0];
      ctx.fillStyle = '#fff';
      const ex1 = head.x * CELL + (this.direction === 'LEFT' ? 5 : 13);
      const ey1 = head.y * CELL + (this.direction === 'UP' ? 5 : 13);
      ctx.beginPath();
      ctx.arc(ex1, head.y * CELL + CELL / 2 - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private clearLoop(): void {
    if (this.loop !== null) { clearInterval(this.loop); this.loop = null; }
  }

  private readonly OPPOSITE: Record<Direction, Direction> = {
    UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
  };

  private onKey = (e: KeyboardEvent): void => {
    if (this.gameState() !== 'playing') return;
    const map: Record<string, Direction> = {
      ArrowUp: 'UP', w: 'UP', W: 'UP',
      ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
      ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
      ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
    };
    const d = map[e.key];
    if (d && d !== this.OPPOSITE[this.direction]) {
      this.nextDirection = d;
      e.preventDefault();
    }
  };

  private onTouchStart = (e: TouchEvent): void => {
    this.touchX = e.touches[0].clientX;
    this.touchY = e.touches[0].clientY;
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (this.gameState() !== 'playing') { this.startGame(); return; }
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    const d: Direction = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'RIGHT' : 'LEFT')
      : (dy > 0 ? 'DOWN' : 'UP');
    if (d !== this.OPPOSITE[this.direction]) this.nextDirection = d;
  };
}
