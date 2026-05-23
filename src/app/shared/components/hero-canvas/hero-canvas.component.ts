import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SYMBOLS = [
  '</>', '{ }', '( )', '[ ]', '=>', '&&', '||',
  'const', 'async', 'await', 'class', 'import',
  '#include', 'npm', 'git', 'API', 'SQL',
  '<div>', 'fn()', '===', '01', 'λ', 'π',
];

// ── Light-mode palette: deep, saturated — clearly visible on pale bg ──────
const LGT_COLORS = [
  [30,  58,  138],   // blue-900
  [55,  48,  163],   // indigo-800
  [88,  28,  135],   // purple-900
  [15, 118,  110],   // teal-700
  [30,  64,  175],   // blue-800
  [109,  40, 217],   // violet-700
  [7,   89, 133],    // cyan-800
];

// ── Dark-mode palette: vivid neon — pops on dark bg ───────────────────────
const DRK_COLORS = [
  [129, 140, 248],   // indigo-400
  [196, 205, 255],   // indigo-200
  [103, 232, 249],   // cyan-300
  [216, 180, 254],   // purple-300
  [165, 180, 252],   // indigo-300
  [52,  211, 153],   // emerald-400
  [250, 204,  21],   // yellow-400
];

interface P3 {
  x0: number; y: number; z0: number;
  symbol: string | null;
  size: number;
  alpha: number;   // base opacity (higher for better contrast)
  speed: number;
  ci: number;      // colour index into palette
}

@Component({
  selector: 'app-hero-canvas',
  standalone: true,
  template: `<canvas #cv class="absolute inset-0 w-full h-full" aria-hidden="true"></canvas>`,
  host: { class: 'absolute inset-0 overflow-hidden pointer-events-none', 'aria-hidden': 'true' },
})
export class HeroCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv') cvRef!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);

  private raf = 0;
  private angle = 0;
  private mouseX = 0;  private mouseY = 0;
  private targetMX = 0; private targetMY = 0;
  private particles: P3[] = [];
  private W = 0; private H = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.resize(); this.buildParticles(); this.loop();
    window.addEventListener('resize',    this.onResize);
    window.addEventListener('mousemove', this.onMouse);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize',    this.onResize);
    window.removeEventListener('mousemove', this.onMouse);
  }

  private onResize = () => { this.resize(); this.buildParticles(); };
  private onMouse  = (e: MouseEvent) => {
    this.targetMX = (e.clientX / this.W - 0.5) * 2;
    this.targetMY = (e.clientY / this.H - 0.5) * 2;
  };

  private resize(): void {
    const cv = this.cvRef.nativeElement;
    this.W = cv.offsetWidth;
    this.H = cv.offsetHeight;
    cv.width = this.W; cv.height = this.H;
  }

  private buildParticles(): void {
    const count = Math.min(70, Math.floor(this.W * this.H / 12000));
    const R = Math.min(this.W, this.H) * 0.46;
    this.particles = Array.from({ length: count }, (_, i) => {
      const isSymbol = i % 3 !== 0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = R * (0.3 + 0.7 * Math.random());
      return {
        x0:     r * Math.sin(phi) * Math.cos(theta),
        y:      r * Math.sin(phi) * Math.sin(theta),
        z0:     r * Math.cos(phi),
        symbol: isSymbol ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : null,
        size:   isSymbol ? 12 + Math.random() * 8 : 3 + Math.random() * 4,
        alpha:  0.55 + Math.random() * 0.40,   // 0.55–0.95: high contrast
        speed:  (Math.random() - 0.5) * 0.18,
        ci:     Math.floor(Math.random() * 7),
      };
    });
  }

  private loop = (): void => {
    this.raf = requestAnimationFrame(this.loop);
    this.mouseX += (this.targetMX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMY - this.mouseY) * 0.04;
    this.angle  += 0.0022;
    this.render();
  };

  private render(): void {
    const cv  = this.cvRef.nativeElement;
    const ctx = cv.getContext('2d')!;
    const W = this.W, H = this.H;
    const dark = document.documentElement.classList.contains('dark');
    const pal  = dark ? DRK_COLORS : LGT_COLORS;

    ctx.clearRect(0, 0, W, H);

    // ── perspective grid ────────────────────────────────────────────────────
    this.drawGrid(ctx, W, H, dark);

    // ── project + sort ──────────────────────────────────────────────────────
    const fov  = 520;
    const cx   = W / 2 + this.mouseX * 20;
    const cy   = H / 2 + this.mouseY * 14;
    const cosA = Math.cos(this.angle + this.mouseX * 0.16);
    const sinA = Math.sin(this.angle + this.mouseX * 0.16);

    this.particles.forEach(p => {
      p.y += p.speed;
      if (Math.abs(p.y) > H * 0.58) p.speed *= -1;
    });

    const proj = this.particles.map(p => {
      const x = p.x0 * cosA - p.z0 * sinA;
      const z = p.x0 * sinA + p.z0 * cosA;
      const d = fov / (fov + z);
      return { p, x: cx + x * d, y: cy + p.y * d, z, d };
    }).sort((a, b) => b.z - a.z);

    // ── connections ─────────────────────────────────────────────────────────
    const maxDist = Math.min(W, H) * 0.20;
    for (let i = 0; i < proj.length; i++) {
      for (let j = i + 1; j < proj.length; j++) {
        const a = proj[i], b = proj[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) continue;
        const t   = 1 - dist / maxDist;
        const fa  = t * 0.45 * Math.min(a.d, b.d);
        const [r, g, bl] = pal[a.p.ci];
        ctx.strokeStyle = `rgba(${r},${g},${bl},${fa})`;
        ctx.lineWidth   = 0.9 + t * 0.6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    // ── particles ───────────────────────────────────────────────────────────
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    for (const { p, x, y, d } of proj) {
      const a   = p.alpha * d;
      const sz  = p.size * d;
      if (a < 0.05 || sz < 1) continue;

      const [r, g, bl] = pal[p.ci];

      if (p.symbol) {
        // ── symbol text ──────────────────────────────────────────────────
        const fontPx = Math.round(Math.max(8, sz));
        ctx.font      = `600 ${fontPx}px 'JetBrains Mono','Fira Code','Courier New',monospace`;
        ctx.fillStyle = `rgba(${r},${g},${bl},${Math.min(a, 0.92)})`;

        // glow — stronger in dark mode
        const glowR = dark ? 12 : 4;
        if (a > 0.4) {
          ctx.shadowColor = `rgba(${r},${g},${bl},${dark ? 0.6 : 0.25})`;
          ctx.shadowBlur  = glowR;
        }
        ctx.fillText(p.symbol, x, y);
        ctx.shadowBlur = 0;

      } else {
        // ── glowing node ─────────────────────────────────────────────────
        const radius = sz;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        grd.addColorStop(0,   `rgba(${r},${g},${bl},${a})`);
        grd.addColorStop(0.4, `rgba(${r},${g},${bl},${a * 0.45})`);
        grd.addColorStop(1,   `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(x, y, radius * 3, 0, Math.PI * 2); ctx.fill();
        // solid center
        ctx.fillStyle = `rgba(${r},${g},${bl},${Math.min(a * 1.3, 1)})`;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, dark: boolean): void {
    const horizon  = H * 0.56;
    const vpX      = W / 2 + this.mouseX * 35;
    const cols     = 14;
    const rows     = 9;
    // brighter in light mode so the grid is clearly visible
    const baseA    = dark ? 0.10 : 0.16;
    const gridCol  = dark ? '99,102,241' : '55,48,163';

    ctx.save();
    ctx.lineWidth = 0.7;

    // horizontal bands
    for (let r = 0; r <= rows; r++) {
      const t  = r / rows;
      const e  = t * t;
      const y  = horizon + (H - horizon) * e;
      const a  = baseA * (0.15 + 0.85 * e);
      ctx.strokeStyle = `rgba(${gridCol},${a})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // perspective verticals
    for (let c = -cols; c <= cols; c++) {
      const bx = W / 2 + c * (W / cols);
      const a  = baseA * (0.4 + 0.6 * (Math.abs(c) / cols));
      ctx.strokeStyle = `rgba(${gridCol},${a})`;
      ctx.beginPath();
      ctx.moveTo(vpX, horizon);
      ctx.lineTo(bx, H);
      ctx.stroke();
    }

    ctx.restore();
  }
}
