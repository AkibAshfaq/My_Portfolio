import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';

interface FloatItem {
  symbol: string;
  left?: string;
  right?: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  opacity: string;
}

// Left-side items
const LEFT: FloatItem[] = [
  { symbol: '</>',    left: '1%',  top: '12%', size: '13px', delay: '0s',    duration: '7s',  opacity: '0.55' },
  { symbol: '{ }',    left: '2%',  top: '35%', size: '11px', delay: '1.5s',  duration: '9s',  opacity: '0.45' },
  { symbol: '=>',     left: '0.5%',top: '58%', size: '12px', delay: '3s',    duration: '8s',  opacity: '0.5'  },
  { symbol: '[ ]',    left: '3%',  top: '78%', size: '10px', delay: '0.8s',  duration: '11s', opacity: '0.4'  },
  { symbol: 'async',  left: '1.5%',top: '22%', size: '9px',  delay: '2.2s',  duration: '10s', opacity: '0.38' },
  { symbol: 'npm',    left: '2.5%',top: '68%', size: '9px',  delay: '4s',    duration: '7s',  opacity: '0.35' },
  { symbol: '&&',     left: '0.8%',top: '47%', size: '11px', delay: '1s',    duration: '8.5s',opacity: '0.42' },
];

// Right-side items
const RIGHT: FloatItem[] = [
  { symbol: '( )',    right: '1%',  top: '8%',  size: '12px', delay: '0.5s',  duration: '8s',  opacity: '0.5'  },
  { symbol: 'class',  right: '2%',  top: '30%', size: '10px', delay: '2s',    duration: '9.5s',opacity: '0.42' },
  { symbol: '===',    right: '0.5%',top: '52%', size: '11px', delay: '1.2s',  duration: '7.5s',opacity: '0.48' },
  { symbol: '#',      right: '2.5%',top: '72%', size: '13px', delay: '3.5s',  duration: '10s', opacity: '0.4'  },
  { symbol: 'const',  right: '1.5%',top: '19%', size: '9px',  delay: '0.3s',  duration: '8s',  opacity: '0.36' },
  { symbol: 'API',    right: '1%',  top: '62%', size: '10px', delay: '2.8s',  duration: '9s',  opacity: '0.38' },
  { symbol: '||',     right: '3%',  top: '42%', size: '11px', delay: '1.7s',  duration: '7s',  opacity: '0.44' },
];

@Component({
  selector: 'app-tech-decor',
  standalone: true,
  imports: [NgStyle],
  styles: [`
    @keyframes floatY {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50%       { transform: translateY(-18px) rotate(2deg); }
    }
    .float-sym {
      position: absolute;
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      font-weight: 600;
      color: var(--color-primary);
      pointer-events: none;
      user-select: none;
      animation: floatY var(--dur, 8s) ease-in-out var(--delay, 0s) infinite;
      white-space: nowrap;
    }
  `],
  template: `
    @for (item of leftItems; track item.symbol + item.top) {
      <span
        class="float-sym"
        [ngStyle]="{
          left:       item.left,
          top:        item.top,
          fontSize:   item.size,
          opacity:    item.opacity,
          '--dur':    item.duration,
          '--delay':  item.delay
        }"
        aria-hidden="true"
      >{{ item.symbol }}</span>
    }
    @for (item of rightItems; track item.symbol + item.top) {
      <span
        class="float-sym"
        [ngStyle]="{
          right:      item.right,
          top:        item.top,
          fontSize:   item.size,
          opacity:    item.opacity,
          '--dur':    item.duration,
          '--delay':  item.delay
        }"
        aria-hidden="true"
      >{{ item.symbol }}</span>
    }
  `,
  host: { class: 'absolute inset-0 overflow-hidden pointer-events-none', 'aria-hidden': 'true' },
})
export class TechDecorComponent {
  /** Pass a seed (0-3) to vary which symbols appear per section */
  seed = input<number>(0);

  get leftItems(): FloatItem[] {
    const s = this.seed();
    return LEFT.map((item, i) => ({
      ...item,
      top: `${(parseInt(item.top) + s * 7) % 90}%`,
    })).slice(0, 5);
  }

  get rightItems(): FloatItem[] {
    const s = this.seed();
    return RIGHT.map((item, i) => ({
      ...item,
      top: `${(parseInt(item.top) + s * 11) % 90}%`,
    })).slice(0, 5);
  }
}
