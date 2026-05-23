import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ── Constants ────────────────────────────────────────────────────────────────
const CW = 800;          // canvas logical width
const CH = 400;          // canvas logical height
const GRAVITY = 0.55;
const JUMP_VEL = -13;
const MOVE_SPD = 4.2;
const LEVEL_W = 1900;
const FLAG_X  = 1820;

// ── Level data ────────────────────────────────────────────────────────────────
interface Plat { x:number; y:number; w:number; h:number; c:string; }
interface CoinD { x:number; y:number; }
interface EnemyD { x:number; y:number; minX:number; maxX:number; }

const PLATS: Plat[] = [
  // ground chunks
  { x:0,    y:340, w:420,  h:60, c:'#4a7c3f' },
  { x:460,  y:340, w:260,  h:60, c:'#4a7c3f' },
  { x:770,  y:340, w:340,  h:60, c:'#4a7c3f' },
  { x:1160, y:340, w:740,  h:60, c:'#4a7c3f' },
  // brick platforms
  { x:130,  y:258, w:120,  h:18, c:'#c47c32' },
  { x:360,  y:225, w:140,  h:18, c:'#c47c32' },
  { x:570,  y:195, w:110,  h:18, c:'#c47c32' },
  { x:800,  y:248, w: 90,  h:18, c:'#c47c32' },
  { x:970,  y:208, w:160,  h:18, c:'#c47c32' },
  { x:1220, y:185, w:130,  h:18, c:'#c47c32' },
  { x:1420, y:255, w: 90,  h:18, c:'#c47c32' },
  { x:1600, y:215, w:100,  h:18, c:'#c47c32' },
];

const COIN_POS: CoinD[] = [
  {x:148,y:228},{x:185,y:228},{x:222,y:228},
  {x:378,y:195},{x:418,y:195},{x:458,y:195},
  {x:584,y:165},{x:622,y:165},
  {x:812,y:218},{x:848,y:218},
  {x:980,y:178},{x:1020,y:178},{x:1060,y:178},
  {x:1232,y:155},{x:1270,y:155},
  {x:1432,y:225},
  {x:1612,y:185},{x:1648,y:185},
];

const ENEMY_POS: EnemyD[] = [
  { x:220,  y:306, minX:40,   maxX:380  },
  { x:520,  y:306, minX:462,  maxX:715  },
  { x:870,  y:306, minX:772,  maxX:1100 },
  { x:1010, y:174, minX:972,  maxX:1126 },
  { x:1310, y:306, minX:1162, maxX:1895 },
  { x:1640, y:182, minX:1602, maxX:1696 },
];

// ── Runtime interfaces ────────────────────────────────────────────────────────
interface Player {
  x:number; y:number; w:number; h:number;
  vx:number; vy:number;
  onGround:boolean; facing:1|-1; dead:boolean;
  frame:number; frameTimer:number;
}
interface Coin  { x:number; y:number; r:number; collected:boolean; bobT:number; }
interface Enemy { x:number; y:number; w:number; h:number; vx:number; vy:number; alive:boolean; squished:boolean; squishT:number; }

@Component({
  selector: 'app-mario-game',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-3 select-none">

      <!-- HUD -->
      <div class="flex items-center justify-between w-full max-w-[800px] px-2 text-sm font-bold text-(--color-text)">
        <span>🪙 {{ score() }}</span>
        <span>Best: {{ hiScore() }}</span>
        <span>{{ lives() }} ❤️</span>
      </div>

      <!-- Canvas wrapper -->
      <div class="relative w-full max-w-[800px] rounded-xl overflow-hidden border border-(--color-border) shadow-lg" style="aspect-ratio:2/1">
        <canvas #canvas
          style="width:100%;height:100%;display:block;image-rendering:pixelated"
          [width]="CW" [height]="CH">
        </canvas>

        <!-- Overlay screens -->
        @if (state() === 'idle') {
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60">
            <p class="text-4xl font-extrabold text-yellow-400 drop-shadow-lg">🍄 Mario Run</p>
            <p class="text-white text-sm">Collect coins · Stomp enemies · Reach the flag</p>
            <button (click)="startGame()"
              class="rounded-xl bg-yellow-400 px-8 py-3 font-bold text-black hover:bg-yellow-300 transition-colors">
              Play
            </button>
          </div>
        }
        @if (state() === 'gameover') {
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70">
            <p class="text-3xl font-extrabold text-red-400">Game Over</p>
            <p class="text-white text-sm">Score: {{ score() }}</p>
            <button (click)="startGame()"
              class="rounded-xl bg-red-500 px-8 py-3 font-bold text-white hover:bg-red-400 transition-colors">
              Try Again
            </button>
          </div>
        }
        @if (state() === 'win') {
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60">
            <p class="text-3xl font-extrabold text-yellow-400">🎉 You Win!</p>
            <p class="text-white text-sm">Score: {{ score() }} · Best: {{ hiScore() }}</p>
            <button (click)="startGame()"
              class="rounded-xl bg-green-500 px-8 py-3 font-bold text-white hover:bg-green-400 transition-colors">
              Play Again
            </button>
          </div>
        }
      </div>

      <!-- Mobile controls -->
      <div class="flex items-center gap-4 md:hidden">
        <button (pointerdown)="keys.left=true"  (pointerup)="keys.left=false"  (pointercancel)="keys.left=false"
          class="w-14 h-14 rounded-xl bg-(--color-surface) border border-(--color-border) text-2xl font-bold text-(--color-text) active:bg-(--color-primary) active:text-white transition-colors">◀</button>
        <button (pointerdown)="keys.jump=true"  (pointerup)="keys.jump=false"  (pointercancel)="keys.jump=false"
          class="w-16 h-16 rounded-full bg-yellow-400 border-2 border-yellow-600 text-2xl font-bold text-black active:bg-yellow-300 transition-colors">▲</button>
        <button (pointerdown)="keys.right=true" (pointerup)="keys.right=false" (pointercancel)="keys.right=false"
          class="w-14 h-14 rounded-xl bg-(--color-surface) border border-(--color-border) text-2xl font-bold text-(--color-text) active:bg-(--color-primary) active:text-white transition-colors">▶</button>
      </div>

      <p class="text-xs text-(--color-text-muted) hidden md:block">Arrow keys / WASD · Space or Up to jump</p>
    </div>
  `,
})
export class MarioGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);

  readonly CW = CW;
  readonly CH = CH;

  state   = signal<'idle'|'playing'|'gameover'|'win'>('idle');
  score   = signal(0);
  hiScore = signal(0);
  lives   = signal(3);

  keys = { left:false, right:false, jump:false };
  private jumpHeld = false;
  private raf = 0;

  // game objects
  private player!: Player;
  private coins: Coin[] = [];
  private enemies: Enemy[] = [];
  private camX = 0;
  private deathTimer = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('mario-hi');
    if (saved) this.hiScore.set(+saved);
    this.drawIdle();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (['ArrowLeft','a','A'].includes(e.key))               this.keys.left  = true;
    if (['ArrowRight','d','D'].includes(e.key))              this.keys.right = true;
    if (['ArrowUp','w','W','  ',' '].includes(e.key))        this.keys.jump  = true;
    if (['ArrowUp','w','W',' '].includes(e.key))             e.preventDefault();
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    if (['ArrowLeft','a','A'].includes(e.key))               this.keys.left  = false;
    if (['ArrowRight','d','D'].includes(e.key))              this.keys.right = false;
    if (['ArrowUp','w','W',' '].includes(e.key))             this.keys.jump  = false;
  }

  // ── Public API ────────────────────────────────────────────────────────────
  startGame(): void {
    this.lives.set(3);
    this.score.set(0);
    this.spawnLevel();
    this.state.set('playing');
    cancelAnimationFrame(this.raf);
    this.loop();
  }

  // ── Level / player init ───────────────────────────────────────────────────
  private spawnLevel(): void {
    this.camX = 0;
    this.deathTimer = 0;
    this.jumpHeld = false;

    this.player = { x:60, y:270, w:28, h:36, vx:0, vy:0, onGround:false, facing:1, dead:false, frame:0, frameTimer:0 };

    this.coins = COIN_POS.map(c => ({ x:c.x, y:c.y, r:8, collected:false, bobT:Math.random()*Math.PI*2 }));

    this.enemies = ENEMY_POS.map(e => ({
      x:e.x, y:e.y, w:32, h:32, vx:1.2, vy:0, alive:true, squished:false, squishT:0,
    }));
  }

  private respawn(): void {
    this.camX = 0;
    this.deathTimer = 0;
    this.jumpHeld = false;
    this.player = { x:60, y:270, w:28, h:36, vx:0, vy:0, onGround:false, facing:1, dead:false, frame:0, frameTimer:0 };
    // reset enemies too
    this.enemies = ENEMY_POS.map((e,i) => ({
      x: e.x, y: e.y, w:32, h:32,
      vx: this.enemies[i]?.vx > 0 ? 1.2 : -1.2, vy: 0,
      alive:true, squished:false, squishT:0,
    }));
    // coins stay collected
  }

  // ── Game loop ────────────────────────────────────────────────────────────
  private loop = (): void => {
    if (this.state() !== 'playing') return;
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  // ── Update ────────────────────────────────────────────────────────────────
  private update(): void {
    const p = this.player;

    // death animation
    if (p.dead) {
      p.vy += GRAVITY;
      p.y  += p.vy;
      this.deathTimer++;
      if (this.deathTimer > 90) {
        const newLives = this.lives() - 1;
        this.lives.set(newLives);
        if (newLives <= 0) { this.state.set('gameover'); this.saveHi(); return; }
        this.respawn();
      }
      return;
    }

    // ── input ──
    if (this.keys.left)  { p.vx = -MOVE_SPD; p.facing = -1; }
    else if (this.keys.right) { p.vx = MOVE_SPD; p.facing = 1; }
    else p.vx *= 0.75;

    if (this.keys.jump && !this.jumpHeld && p.onGround) {
      p.vy = JUMP_VEL;
      this.jumpHeld = true;
    }
    if (!this.keys.jump) this.jumpHeld = false;

    // ── physics ──
    p.vy += GRAVITY;
    if (p.vy > 14) p.vy = 14;
    p.x += p.vx;
    p.y += p.vy;

    // clamp left
    if (p.x < 0) { p.x = 0; p.vx = 0; }
    // clamp right
    if (p.x + p.w > LEVEL_W) { p.x = LEVEL_W - p.w; p.vx = 0; }

    // ── platform collisions ──
    p.onGround = false;
    for (const pl of PLATS) {
      if (this.aabb(p, pl)) {
        const overlapX = Math.min(p.x+p.w, pl.x+pl.w) - Math.max(p.x, pl.x);
        const overlapY = Math.min(p.y+p.h, pl.y+pl.h) - Math.max(p.y, pl.y);
        if (overlapY < overlapX) {
          if (p.y + p.h/2 < pl.y + pl.h/2) {
            p.y = pl.y - p.h; p.vy = 0; p.onGround = true;
          } else {
            p.y = pl.y + pl.h; if (p.vy < 0) p.vy = 0;
          }
        } else {
          if (p.x + p.w/2 < pl.x + pl.w/2) { p.x = pl.x - p.w; }
          else { p.x = pl.x + pl.w; }
          p.vx = 0;
        }
      }
    }

    // fall death
    if (p.y > CH + 50) { p.dead = true; p.vy = -8; this.deathTimer = 0; }

    // ── enemies ──
    for (const en of this.enemies) {
      if (!en.alive) { if (en.squished) { en.squishT++; } continue; }
      en.x += en.vx;
      en.vy += GRAVITY;
      en.y  += en.vy;

      // enemy platform collisions
      for (const pl of PLATS) {
        if (this.aabb(en, pl)) {
          const overlapX = Math.min(en.x+en.w, pl.x+pl.w) - Math.max(en.x, pl.x);
          const overlapY = Math.min(en.y+en.h, pl.y+pl.h) - Math.max(en.y, pl.y);
          if (overlapY < overlapX) {
            if (en.y + en.h/2 < pl.y + pl.h/2) { en.y = pl.y - en.h; en.vy = 0; }
            else { en.y = pl.y + pl.h; en.vy = 0; }
          } else {
            en.vx *= -1;
            if (en.x + en.w/2 < pl.x + pl.w/2) en.x = pl.x - en.w;
            else en.x = pl.x + pl.w;
          }
        }
      }

      // enemy patrol bounds
      const ed = ENEMY_POS[this.enemies.indexOf(en)];
      if (ed) {
        if (en.x < ed.minX) { en.x = ed.minX; en.vx = Math.abs(en.vx); }
        if (en.x + en.w > ed.maxX) { en.x = ed.maxX - en.w; en.vx = -Math.abs(en.vx); }
      }

      // player stomps enemy
      if (!p.dead && this.aabb(p, en)) {
        const pBottom = p.y + p.h;
        const enTop   = en.y;
        if (p.vy > 0 && pBottom - p.vy <= enTop + 4) {
          en.alive = false; en.squished = true; en.squishT = 0;
          p.vy = -7;
          this.score.update(s => s + 100);
        } else {
          // player dies
          p.dead = true; p.vy = -9; this.deathTimer = 0;
        }
      }
    }

    // ── coins ──
    for (const c of this.coins) {
      c.bobT += 0.06;
      if (!c.collected && this.circRect(c, p)) {
        c.collected = true;
        this.score.update(s => s + 10);
      }
    }

    // ── flag / win ──
    if (p.x + p.w >= FLAG_X) {
      this.state.set('win');
      this.saveHi();
      return;
    }

    // ── camera ──
    const target = p.x - CW * 0.35;
    this.camX += (target - this.camX) * 0.12;
    this.camX = Math.max(0, Math.min(this.camX, LEVEL_W - CW));

    // ── walk frame ──
    if (Math.abs(p.vx) > 0.5 && p.onGround) {
      p.frameTimer++;
      if (p.frameTimer >= 8) { p.frame = (p.frame + 1) % 2; p.frameTimer = 0; }
    } else { p.frame = 0; p.frameTimer = 0; }
  }

  // ── Draw ──────────────────────────────────────────────────────────────────
  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx    = canvas.getContext('2d')!;
    const dark   = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, CW, CH);

    // sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CH);
    if (dark) { sky.addColorStop(0,'#0d1b2a'); sky.addColorStop(1,'#1a2f4a'); }
    else      { sky.addColorStop(0,'#87ceeb'); sky.addColorStop(1,'#b8e4f9'); }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // clouds (parallax at 0.4)
    this.drawClouds(ctx, dark);

    ctx.save();
    ctx.translate(-this.camX, 0);

    // platforms
    for (const pl of PLATS) this.drawPlatform(ctx, pl, dark);

    // flag
    this.drawFlag(ctx, dark);

    // coins
    for (const c of this.coins) if (!c.collected) this.drawCoin(ctx, c);

    // enemies
    for (const en of this.enemies) this.drawEnemy(ctx, en, dark);

    // player
    this.drawPlayer(ctx, dark);

    ctx.restore();
  }

  private drawIdle(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dark = document.documentElement.classList.contains('dark');
    const sky = ctx.createLinearGradient(0,0,0,CH);
    if (dark) { sky.addColorStop(0,'#0d1b2a'); sky.addColorStop(1,'#1a2f4a'); }
    else      { sky.addColorStop(0,'#87ceeb'); sky.addColorStop(1,'#b8e4f9'); }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);
  }

  private drawClouds(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const cols = dark
      ? ['rgba(255,255,255,0.06)','rgba(255,255,255,0.04)']
      : ['rgba(255,255,255,0.85)','rgba(255,255,255,0.65)'];
    const positions = [
      {x:80,  y:50, r:30}, {x:160, y:45, r:22}, {x:120, y:40, r:18},
      {x:320, y:65, r:28}, {x:390, y:60, r:20}, {x:355, y:55, r:15},
      {x:560, y:45, r:32}, {x:630, y:42, r:24},
    ];
    const px = (this.camX * 0.35) % CW;
    ctx.save();
    for (let rep = -1; rep <= 1; rep++) {
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        ctx.fillStyle = cols[i % 2];
        ctx.beginPath();
        ctx.arc(p.x - px + rep * CW, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawPlatform(ctx: CanvasRenderingContext2D, pl: Plat, dark: boolean): void {
    // main fill
    ctx.fillStyle = dark ? this.darken(pl.c, 0.6) : pl.c;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    // top highlight stripe
    ctx.fillStyle = dark ? this.darken(pl.c, 0.8) : this.lighten(pl.c, 1.3);
    ctx.fillRect(pl.x, pl.y, pl.w, 5);
    // dark edge
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';
    ctx.fillRect(pl.x, pl.y + pl.h - 5, pl.w, 5);
    // brick lines for floating platforms
    if (pl.h <= 20) {
      ctx.strokeStyle = dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      for (let bx = pl.x + 20; bx < pl.x + pl.w; bx += 20) {
        ctx.beginPath(); ctx.moveTo(bx, pl.y); ctx.lineTo(bx, pl.y + pl.h); ctx.stroke();
      }
    }
  }

  private drawFlag(ctx: CanvasRenderingContext2D, dark: boolean): void {
    // pole
    ctx.fillStyle = dark ? '#9ca3af' : '#6b7280';
    ctx.fillRect(FLAG_X, 180, 6, 160);
    // flag banner
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(FLAG_X + 6, 180);
    ctx.lineTo(FLAG_X + 46, 200);
    ctx.lineTo(FLAG_X + 6, 220);
    ctx.closePath();
    ctx.fill();
    // base
    ctx.fillStyle = dark ? '#78716c' : '#a8a29e';
    ctx.fillRect(FLAG_X - 8, 335, 22, 10);
  }

  private drawCoin(ctx: CanvasRenderingContext2D, c: Coin): void {
    const yOff = Math.sin(c.bobT) * 3;
    // outer coin
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(c.x, c.y + yOff, c.r, 0, Math.PI*2);
    ctx.fill();
    // inner shine
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(c.x - 2, c.y + yOff - 2, c.r * 0.45, 0, Math.PI*2);
    ctx.fill();
    // text
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', c.x, c.y + yOff);
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, en: Enemy, dark: boolean): void {
    if (en.squished) {
      // flat squished enemy
      const opacity = Math.max(0, 1 - en.squishT / 30);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(en.x, en.y + en.h - 8, en.w, 8);
      ctx.globalAlpha = 1;
      return;
    }
    if (!en.alive) return;

    const x = en.x, y = en.y, w = en.w, h = en.h;
    // body
    ctx.fillStyle = dark ? '#b91c1c' : '#dc2626';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    // "feet" walk anim
    ctx.fillStyle = dark ? '#7f1d1d' : '#991b1b';
    ctx.fillRect(x + 3, y + h - 8, 8, 8);
    ctx.fillRect(x + w - 11, y + h - 8, 8, 8);
    // eyes
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(x + 9,  y + 10, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w - 9, y + 10, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1e293b';
    const eyeDir = en.vx > 0 ? 2 : -2;
    ctx.beginPath(); ctx.arc(x + 9  + eyeDir, y + 10, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w - 9 + eyeDir, y + 10, 2.5, 0, Math.PI*2); ctx.fill();
    // angry brows
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 5,  y + 5); ctx.lineTo(x + 14, y + 7); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - 5, y + 5); ctx.lineTo(x + w - 14, y + 7); ctx.stroke();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const p  = this.player;
    const x  = p.x;
    const y  = p.dead ? p.y : p.y;
    const fl = p.facing === -1;

    ctx.save();
    if (fl) { ctx.translate(x + p.w, y); ctx.scale(-1, 1); ctx.translate(-x, -y); }

    // shadow
    if (!p.dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(x + p.w/2, y + p.h + 2, p.w/2, 4, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // legs / feet
    const legOff = (p.frame === 1 && Math.abs(p.vx) > 0.5 && !p.dead) ? 3 : 0;
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(x + 2,          y + p.h - 14, 10, 14);
    ctx.fillRect(x + p.w - 12,   y + p.h - 14 + legOff, 10, 14 - legOff);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(x,              y + p.h - 6, 13, 6);
    ctx.fillRect(x + p.w - 13,   y + p.h - 6, 13, 6);

    // body (overalls)
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(x + 2, y + p.h - 22, p.w - 4, 10);
    // shirt
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 3, y + 14, p.w - 6, p.h - 30);

    // head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.roundRect(x + 3, y + 2, p.w - 6, 18, 5);
    ctx.fill();

    // hat
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 1, y + 4, p.w - 2, 8);
    ctx.fillRect(x + 5, y,     p.w - 10, 7);
    // hat brim shadow
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x + 1, y + 10, p.w - 2, 2);

    // eyes
    ctx.fillStyle = dark ? '#e2e8f0' : '#1e293b';
    ctx.beginPath();
    ctx.arc(x + p.w - 9, y + 9, 2.5, 0, Math.PI*2);
    ctx.fill();
    // whites
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + p.w - 10, y + 8.5, 2, 0, Math.PI*2);
    ctx.fill();

    // mustache
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + p.w - 15, y + 14, 13, 3);

    ctx.restore();
  }

  // ── Collision helpers ─────────────────────────────────────────────────────
  private aabb(a:{x:number;y:number;w:number;h:number}, b:{x:number;y:number;w:number;h:number}): boolean {
    return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  }
  private circRect(c:{x:number;y:number;r:number}, r:{x:number;y:number;w:number;h:number}): boolean {
    const cx = Math.max(r.x, Math.min(c.x, r.x+r.w));
    const cy = Math.max(r.y, Math.min(c.y, r.y+r.h));
    return (cx-c.x)**2 + (cy-c.y)**2 <= c.r**2;
  }

  // ── Color helpers ─────────────────────────────────────────────────────────
  private lighten(hex: string, f: number): string { return this.scaleHex(hex, f); }
  private darken (hex: string, f: number): string { return this.scaleHex(hex, f); }
  private scaleHex(hex: string, f: number): string {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round(((n>>16)&0xff)*f));
    const g = Math.min(255, Math.round(((n>>8) &0xff)*f));
    const b = Math.min(255, Math.round(( n     &0xff)*f));
    return `rgb(${r},${g},${b})`;
  }

  private saveHi(): void {
    if (this.score() > this.hiScore()) {
      this.hiScore.set(this.score());
      localStorage.setItem('mario-hi', String(this.score()));
    }
  }
}
