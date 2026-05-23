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

// ── Road constants ────────────────────────────────────────────────────────────
const W = 400;
const H = 620;
const ROAD_L = 60;
const ROAD_R = 340;
const ROAD_W = ROAD_R - ROAD_L;
const LANE_COUNT = 3;
const LANE_W = ROAD_W / LANE_COUNT;
const LANE_CX = [
  ROAD_L + LANE_W * 0.5,
  ROAD_L + LANE_W * 1.5,
  ROAD_L + LANE_W * 2.5,
];

// ── Car / speed constants ─────────────────────────────────────────────────────
const CAR_W = 46;
const CAR_H = 76;
const PLAYER_Y = 500;
const INIT_SPEED = 3.5;
const MAX_SPEED = 18;
const STRIPE_H = 28;
const ENEMY_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#a855f7', '#ec4899', '#64748b', '#e2e8f0',
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Enemy { lane: number; y: number; color: string; }
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; r: number; color: string;
}
type CarGameState = 'idle' | 'playing' | 'gameover';

@Component({
  selector: 'app-car-game',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-3 select-none">

      <!-- HUD row -->
      <div class="flex items-center justify-between w-full px-1" style="max-width: 400px">
        <span class="text-sm font-medium text-(--color-text-muted)">
          🏁 <strong class="text-(--color-text)">{{ distanceDisplay() }} m</strong>
        </span>
        <div class="flex items-center gap-1.5 text-base">{{ livesDisplay() }}</div>
        <span class="text-sm font-medium text-(--color-text-muted)">
          Best: <strong class="text-(--color-primary)">{{ best() }} m</strong>
        </span>
      </div>

      <!-- Canvas wrapper -->
      <div class="relative w-full rounded-xl overflow-hidden" style="max-width: 400px; aspect-ratio: 400/620">
        <canvas
          #gameCanvas
          [width]="CW"
          [height]="CH"
          style="width:100%;height:100%;display:block;touch-action:none;image-rendering:pixelated"
        ></canvas>

        @if (gameState() !== 'playing') {
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3"
               style="background:rgba(15,23,42,0.82);backdrop-filter:blur(4px)">
            @if (gameState() === 'idle') {
              <p class="text-4xl" aria-hidden="true">🚗</p>
              <p class="text-xl font-extrabold text-white">Road Rush</p>
              <p class="text-xs text-gray-300 text-center px-6">Dodge traffic · Survive as long as you can</p>
              <button type="button" (click)="startGame()"
                class="mt-2 rounded-xl bg-(--color-primary) px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Start Game
              </button>
            }
            @if (gameState() === 'gameover') {
              <p class="text-4xl" aria-hidden="true">💥</p>
              <p class="text-xl font-extrabold text-white">Game Over</p>
              <p class="text-3xl font-black text-(--color-primary)">{{ distanceDisplay() }} m</p>
              @if (distanceDisplay() === best() && best() > 0) {
                <p class="text-xs font-semibold text-yellow-400">New Best!</p>
              }
              <button type="button" (click)="startGame()"
                class="mt-1 rounded-xl bg-(--color-primary) px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Play Again
              </button>
            }
          </div>
        }
      </div>

      <!-- Mobile controls -->
      <div class="flex items-center gap-4 md:hidden w-full" style="max-width:400px">
        <button
          (pointerdown)="moveLeft()" (contextmenu)="$event.preventDefault()"
          class="flex-1 rounded-xl bg-(--color-surface) border border-(--color-border) py-4 text-2xl font-bold text-(--color-text) active:bg-(--color-primary) active:text-white transition-colors"
          aria-label="Move left">◀</button>
        <button
          (pointerdown)="moveRight()" (contextmenu)="$event.preventDefault()"
          class="flex-1 rounded-xl bg-(--color-surface) border border-(--color-border) py-4 text-2xl font-bold text-(--color-text) active:bg-(--color-primary) active:text-white transition-colors"
          aria-label="Move right">▶</button>
      </div>

      <p class="text-xs text-(--color-text-muted) hidden md:block">
        ← → or A / D to change lanes
      </p>
    </div>
  `,
})
export class CarGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);

  readonly CW = W;
  readonly CH = H;

  readonly gameState = signal<CarGameState>('idle');
  readonly distanceDisplay = signal(0);
  readonly best = signal(0);
  readonly livesDisplay = signal('❤️❤️❤️');

  // ── Game state ──────────────────────────────────────────────────────────────
  private playerLane = 1;
  private playerX = LANE_CX[1];
  private targetX = LANE_CX[1];
  private score = 0;
  private lives = 3;
  private invTimer = 0;
  private frameCount = 0;
  private speed = INIT_SPEED;
  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  private nextSpawn = 0;
  private dashOffset = 0;
  private kerbOffset = 0;

  private ctx!: CanvasRenderingContext2D;
  private raf = 0;
  private touchStartX = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const saved = localStorage.getItem('car-best');
    if (saved) this.best.set(parseInt(saved, 10));
    this.drawIdleFrame();
    window.addEventListener('keydown', this.onKey);
    const el = this.canvasRef.nativeElement;
    el.addEventListener('touchstart', this.onTouchStart, { passive: true });
    el.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKey);
    const el = this.canvasRef?.nativeElement;
    el?.removeEventListener('touchstart', this.onTouchStart);
    el?.removeEventListener('touchend', this.onTouchEnd);
  }

  // ── Public controls ─────────────────────────────────────────────────────────
  startGame(): void {
    this.playerLane = 1;
    this.playerX = LANE_CX[1];
    this.targetX = LANE_CX[1];
    this.score = 0;
    this.lives = 3;
    this.invTimer = 0;
    this.frameCount = 0;
    this.speed = INIT_SPEED;
    this.enemies = [];
    this.particles = [];
    this.dashOffset = 0;
    this.kerbOffset = 0;
    this.nextSpawn = 45;
    this.distanceDisplay.set(0);
    this.gameState.set('playing');
    this.updateLivesDisplay();
    cancelAnimationFrame(this.raf);
    this.loop();
  }

  moveLeft(): void {
    if (this.gameState() !== 'playing') return;
    if (this.playerLane > 0) this.playerLane--;
    this.targetX = LANE_CX[this.playerLane];
  }

  moveRight(): void {
    if (this.gameState() !== 'playing') return;
    if (this.playerLane < LANE_COUNT - 1) this.playerLane++;
    this.targetX = LANE_CX[this.playerLane];
  }

  // ── Game loop ───────────────────────────────────────────────────────────────
  private loop = (): void => {
    if (this.gameState() !== 'playing') return;
    this.update();
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(): void {
    this.frameCount++;
    this.score++;
    this.speed = Math.min(MAX_SPEED, INIT_SPEED + this.frameCount * 0.004);
    this.dashOffset += this.speed;
    this.kerbOffset += this.speed;

    // Lerp player
    this.playerX += (this.targetX - this.playerX) * 0.16;

    // Spawn enemies
    if (this.frameCount >= this.nextSpawn) {
      const lastLane = this.enemies.length > 0 ? this.enemies[this.enemies.length - 1].lane : undefined;
      this.enemies.push({
        lane: this.randomLane(lastLane),
        y: -CAR_H / 2 - 10,
        color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
      });
      const base = 38 + Math.random() * 57;
      const factor = Math.max(0.5, (MAX_SPEED - this.speed) / MAX_SPEED + 0.5);
      this.nextSpawn = this.frameCount + Math.round(base * factor);
    }

    // Move + cull enemies
    for (const e of this.enemies) e.y += this.speed;
    this.enemies = this.enemies.filter(e => e.y < H + CAR_H);

    // Collision
    if (this.invTimer === 0) {
      for (const e of this.enemies) {
        if (this.aabb(this.playerX, PLAYER_Y, LANE_CX[e.lane], e.y)) {
          this.lives--;
          this.invTimer = 110;
          this.spawnParticles(this.playerX, PLAYER_Y);
          this.updateLivesDisplay();
          if (this.lives <= 0) {
            this.gameState.set('gameover');
            const meters = Math.floor(this.score / 6);
            this.distanceDisplay.set(meters);
            if (meters > this.best()) {
              this.best.set(meters);
              localStorage.setItem('car-best', String(meters));
            }
            return;
          }
          break;
        }
      }
    } else {
      this.invTimer--;
    }

    // Particles
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 0.022;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    this.distanceDisplay.set(Math.floor(this.score / 6));
  }

  private render(): void {
    const dark = this.isDark();
    this.ctx.clearRect(0, 0, W, H);
    this.drawRoad(dark);
    for (const e of this.enemies) this.drawCar(LANE_CX[e.lane], e.y, e.color, false, dark);
    this.drawCar(this.playerX, PLAYER_Y, '#6366f1', true, dark);
    this.drawParticles();
  }

  private drawIdleFrame(): void {
    const dark = this.isDark();
    this.ctx.clearRect(0, 0, W, H);
    this.drawRoad(dark);
    this.drawCar(LANE_CX[1], PLAYER_Y, '#6366f1', true, dark);
  }

  // ── Road drawing ────────────────────────────────────────────────────────────
  private drawRoad(dark: boolean): void {
    const grassL = dark ? '#14532d' : '#166534';

    this.ctx.fillStyle = grassL;
    this.ctx.fillRect(0, 0, ROAD_L, H);
    this.ctx.fillRect(ROAD_R, 0, W - ROAD_R, H);

    const kerbW = 18;
    const ko = this.kerbOffset % (STRIPE_H * 2);

    // Left kerb
    for (let y = -STRIPE_H + ko; y < H; y += STRIPE_H * 2) {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(ROAD_L - kerbW, y, kerbW, STRIPE_H);
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillRect(ROAD_L - kerbW, y + STRIPE_H, kerbW, STRIPE_H);
    }
    // Right kerb (offset by one stripe)
    for (let y = -STRIPE_H + ko + STRIPE_H; y < H; y += STRIPE_H * 2) {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(ROAD_R, y, kerbW, STRIPE_H);
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillRect(ROAD_R, y + STRIPE_H, kerbW, STRIPE_H);
    }

    // Asphalt
    const grad = this.ctx.createLinearGradient(ROAD_L, 0, ROAD_R, 0);
    grad.addColorStop(0,   dark ? '#1e293b' : '#374151');
    grad.addColorStop(0.5, dark ? '#263044' : '#3d4a5c');
    grad.addColorStop(1,   dark ? '#1e293b' : '#374151');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(ROAD_L, 0, ROAD_W, H);

    // Edge lines
    this.ctx.strokeStyle = dark ? '#94a3b8' : '#e2e8f0';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath(); this.ctx.moveTo(ROAD_L, 0); this.ctx.lineTo(ROAD_L, H); this.ctx.stroke();
    this.ctx.beginPath(); this.ctx.moveTo(ROAD_R, 0); this.ctx.lineTo(ROAD_R, H); this.ctx.stroke();

    // Lane dashes
    const dashLen = 30; const gapLen = 22;
    this.ctx.strokeStyle = '#fbbf24';
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([dashLen, gapLen]);
    this.ctx.lineDashOffset = -(this.dashOffset % (dashLen + gapLen));
    for (let i = 1; i < LANE_COUNT; i++) {
      const lx = ROAD_L + LANE_W * i;
      this.ctx.beginPath(); this.ctx.moveTo(lx, 0); this.ctx.lineTo(lx, H); this.ctx.stroke();
    }
    this.ctx.setLineDash([]);
  }

  // ── Car drawing ─────────────────────────────────────────────────────────────
  private drawCar(cx: number, cy: number, color: string, isPlayer: boolean, dark: boolean): void {
    const x = cx - CAR_W / 2;
    const y = cy - CAR_H / 2;

    // Shadow
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0,0,0,0.35)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetY = 4;
    this.ctx.fillStyle = 'rgba(0,0,0,0)';
    this.ctx.fillRect(x + 3, y + 6, CAR_W - 6, CAR_H - 8);
    this.ctx.restore();

    // Body
    this.ctx.fillStyle = color;
    this.rr(x, y, CAR_W, CAR_H, 8);
    this.ctx.fill();

    // Hood
    this.ctx.fillStyle = this.shade(color, 30);
    if (isPlayer) this.rr(x + 5, y + 4, CAR_W - 10, CAR_H * 0.3, [4, 4, 2, 2]);
    else          this.rr(x + 5, y + CAR_H * 0.66, CAR_W - 10, CAR_H * 0.3, [2, 2, 4, 4]);
    this.ctx.fill();

    // Roof
    const rx = x + CAR_W * 0.18, ry = y + CAR_H * 0.28;
    const rw = CAR_W * 0.64,     rh = CAR_H * 0.38;
    this.ctx.fillStyle = this.shade(color, -40);
    this.rr(rx, ry, rw, rh, 5);
    this.ctx.fill();

    // Windshields
    const wc = dark ? 'rgba(148,163,184,0.55)' : 'rgba(186,230,253,0.7)';
    this.ctx.fillStyle = wc;
    if (isPlayer) {
      this.rr(rx + 3, ry + 2,          rw - 6, rh * 0.42, 3); this.ctx.fill();
      this.rr(rx + 3, ry + rh * 0.58,  rw - 6, rh * 0.38, 3); this.ctx.fill();
    } else {
      this.rr(rx + 3, ry + rh * 0.56, rw - 6, rh * 0.4,  3); this.ctx.fill();
      this.rr(rx + 3, ry + 2,          rw - 6, rh * 0.4,  3); this.ctx.fill();
    }

    // Wheels
    const wW = 9, wH = 16;
    const wps: [number, number][] = [
      [x - 2, y + 8], [x + CAR_W - wW + 2, y + 8],
      [x - 2, y + CAR_H - wH - 8], [x + CAR_W - wW + 2, y + CAR_H - wH - 8],
    ];
    for (const [wx, wy] of wps) {
      this.ctx.fillStyle = '#1e293b';
      this.rr(wx, wy, wW, wH, 3); this.ctx.fill();
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.beginPath(); this.ctx.arc(wx + wW / 2, wy + wH / 2, 2.5, 0, Math.PI * 2); this.ctx.fill();
    }

    // Headlights
    this.ctx.save();
    this.ctx.shadowColor = '#fef08a'; this.ctx.shadowBlur = 14;
    this.ctx.fillStyle = '#fef9c3';
    const hlY = isPlayer ? y + 6 : y + CAR_H - 6;
    this.ctx.beginPath(); this.ctx.ellipse(x + 8,          hlY, 5, 4, 0, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.beginPath(); this.ctx.ellipse(x + CAR_W - 8,  hlY, 5, 4, 0, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.restore();

    // Taillights
    this.ctx.save();
    this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = '#fca5a5';
    const tlY = isPlayer ? y + CAR_H - 6 : y + 6;
    this.ctx.beginPath(); this.ctx.ellipse(x + 8,         tlY, 5, 3.5, 0, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.beginPath(); this.ctx.ellipse(x + CAR_W - 8, tlY, 5, 3.5, 0, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.restore();

    // Invincibility flash
    if (isPlayer && this.invTimer > 0 && Math.floor(this.invTimer / 6) % 2 === 0) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.ctx.fillStyle = '#fff';
      this.rr(x, y, CAR_W, CAR_H, 8); this.ctx.fill();
      this.ctx.restore();
    }
  }

  private drawParticles(): void {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  private rr(x: number, y: number, w: number, h: number, r: number | number[]): void {
    (this.ctx as CanvasRenderingContext2D & { roundRect(...a: unknown[]): void })
      .roundRect(x, y, w, h, r);
  }

  private shade(hex: string, amt: number): string {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return `rgb(${r},${g},${b})`;
  }

  private aabb(ax: number, ay: number, bx: number, by: number, erode = 2): boolean {
    const e = erode;
    return (
      ax - CAR_W / 2 + e < bx + CAR_W / 2 - e &&
      ax + CAR_W / 2 - e > bx - CAR_W / 2 + e &&
      ay - CAR_H / 2 + e < by + CAR_H / 2 - e &&
      ay + CAR_H / 2 - e > by - CAR_H / 2 + e
    );
  }

  private spawnParticles(cx: number, cy: number): void {
    const colors = ['#ef4444', '#fbbf24', '#fb923c', '#f87171', '#fdba74'];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 5;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        life: 1, r: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  private randomLane(exclude?: number): number {
    const lanes = [0, 1, 2].filter(l => l !== exclude);
    return lanes[Math.floor(Math.random() * lanes.length)];
  }

  private isDark(): boolean {
    return (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    );
  }

  private updateLivesDisplay(): void {
    this.livesDisplay.set('❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives));
  }

  // ── Input ───────────────────────────────────────────────────────────────────
  private onKey = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { this.moveLeft();  e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { this.moveRight(); e.preventDefault(); }
    if ((e.key === 'Enter' || e.key === ' ') && this.gameState() !== 'playing') this.startGame();
  };

  private onTouchStart = (e: TouchEvent): void => {
    this.touchStartX = e.touches[0].clientX;
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (this.gameState() !== 'playing') { this.startGame(); return; }
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(dx) > 30) { if (dx < 0) this.moveLeft(); else this.moveRight(); }
  };
}
