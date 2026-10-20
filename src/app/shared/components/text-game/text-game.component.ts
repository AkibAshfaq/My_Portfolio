import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { GameKey, TextGame, Tone } from '../../../core/games/text-game';

type State = 'idle' | 'playing' | 'paused' | 'over';
interface Segment { text: string; tone: Tone }

const KEYS: Record<string, GameKey> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ' ': 'action',
};

const TONE_CLASS: Record<Tone, string> = {
  primary: 'text-(--color-primary)',
  info: 'text-(--color-info)',
  warn: 'text-(--color-warn)',
  error: 'text-(--color-error)',
  muted: 'text-(--color-text-muted)',
  dim: 'text-(--color-text-muted)/50',
  text: 'text-(--color-text)',
};

/**
 * Runs a text-mode game: draws each frame as coloured monospace characters and
 * takes keyboard input only while focused, so arrow keys never hijack the page.
 */
@Component({
  selector: 'app-text-game',
  standalone: true,
  template: `
    <div class="flex flex-col gap-3">
      <!-- status line -->
      <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-(--color-text-muted)">
        <span>
          <span [class]="stateTone()">[{{ state() }}]</span>
          score <span class="text-(--color-text)">{{ score() }}</span>
          · best <span class="text-(--color-warn)">{{ best() }}</span>
        </span>
        <span class="hidden sm:inline">{{ hint() }}</span>
      </div>

      <div
        #screen
        tabindex="0"
        role="application"
        [attr.aria-label]="name() + ' game. ' + hint() + '. Press Enter to start.'"
        class="relative cursor-pointer overflow-hidden rounded border border-(--color-border) bg-(--color-bg) p-2 outline-none focus-visible:border-(--color-primary)"
        style="touch-action: none; container-type: inline-size"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()"
        (click)="onScreenClick()"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        <!-- One block per row: Angular strips whitespace-only text, so newlines can't separate rows. -->
        <pre class="m-0 mx-auto w-fit select-none font-mono leading-[1.2]" [style.font-size]="fontSize()" aria-hidden="true">@for (row of frame(); track $index) {<span class="block whitespace-pre">@for (seg of row; track $index) {<span [class]="toneClass(seg.tone)">{{ seg.text }}</span>}</span>}</pre>

        @if (state() !== 'playing') {
          <div class="absolute inset-0 flex items-center justify-center bg-(--color-bg)/70 p-4">
            <div class="term-window max-w-xs px-5 py-4 text-center font-mono text-sm shadow-xl">
              @switch (state()) {
                @case ('idle') {
                  <p class="text-(--color-primary)">$ ./{{ bin() }}</p>
                  <p class="mt-2 text-(--color-text)">press <kbd class="text-(--color-warn)">ENTER</kbd> or tap to start</p>
                }
                @case ('paused') {
                  <p class="text-(--color-warn)">[paused]</p>
                  <p class="mt-2 text-(--color-text)">press <kbd class="text-(--color-warn)">ENTER</kbd> or tap to resume</p>
                }
                @case ('over') {
                  <p class="text-(--color-error)">process exited · game over</p>
                  <p class="mt-1 text-(--color-text)">score {{ score() }}@if (newBest()) { <span class="text-(--color-warn)">· new best!</span> }</p>
                  <p class="mt-2 text-(--color-text-muted)">press <kbd class="text-(--color-warn)">ENTER</kbd> or tap to retry</p>
                }
              }
              <p class="mt-2 text-xs text-(--color-text-muted)">{{ hint() }}</p>
            </div>
          </div>
        }
      </div>

      <!-- touch controls -->
      <div class="hidden items-center justify-center gap-2 pointer-coarse:flex" aria-label="Game controls">
        @for (b of buttons(); track b.key) {
          <button type="button" class="btn h-12 w-12 px-0 text-base" [attr.aria-label]="b.label"
                  (touchstart)="tap($event, b.key)" (mousedown)="tap($event, b.key)">{{ b.glyph }}</button>
        }
      </div>
    </div>
  `,
})
export class TextGameComponent implements OnInit, OnDestroy {
  /** Creates a fresh engine. */
  readonly create = input.required<() => TextGame>();
  readonly name = input.required<string>();
  readonly bin = input.required<string>();
  readonly hint = input('arrows / WASD to move');
  readonly tones = input<Record<string, Tone>>({});
  readonly controls = input<GameKey[]>(['left', 'up', 'down', 'right']);
  readonly storageKey = input.required<string>();

  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly state = signal<State>('idle');
  readonly frame = signal<Segment[][]>([]);
  readonly score = signal(0);
  readonly best = signal(0);
  readonly newBest = signal(false);

  readonly stateTone = computed(() =>
    ({ idle: 'text-(--color-text-muted)', playing: 'text-(--color-primary)', paused: 'text-(--color-warn)', over: 'text-(--color-error)' })[this.state()],
  );

  readonly buttons = computed(() => {
    const all: Record<GameKey, { glyph: string; label: string }> = {
      left: { glyph: '◀', label: 'Left' },
      up: { glyph: '▲', label: 'Up' },
      down: { glyph: '▼', label: 'Down' },
      right: { glyph: '▶', label: 'Right' },
      action: { glyph: '⤒', label: 'Jump' },
    };
    return this.controls().map(key => ({ key, ...all[key] }));
  });

  private game!: TextGame;
  /** Fits the frame to the screen width with container units (IBM Plex Mono glyphs are 0.6em wide). */
  fontSize = () => `clamp(7px, calc(100cqw / ${this.game.cols * 0.6}), 18px)`;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private touch = { x: 0, y: 0 };

  ngOnInit(): void {
    this.game = this.create()();
    this.best.set(this.loadBest());
    this.draw();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  /** Focuses the game screen (used by `play <game>`). */
  focus(): void {
    this.screen().nativeElement.focus({ preventScroll: true });
  }

  start(): void {
    if (this.state() === 'over' || this.state() === 'idle') {
      this.game.reset();
      this.newBest.set(false);
    }
    this.state.set('playing');
    this.draw();
    this.scheduleTick();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.state() !== 'playing') this.start();
      return;
    }
    if (event.key === 'p' || event.key === 'P') {
      if (this.state() === 'playing') this.pause();
      else if (this.state() === 'paused') this.start();
      return;
    }
    const key = KEYS[event.key];
    if (!key) return;
    event.preventDefault(); // keep arrows/space from scrolling the page while playing
    if (this.state() === 'playing') {
      this.input(key);
    } else if (key === 'action') {
      this.start();
    }
  }

  onBlur(): void {
    if (this.state() === 'playing') this.pause();
  }

  onScreenClick(): void {
    this.focus();
    if (this.state() !== 'playing') this.start();
  }

  onTouchStart(event: TouchEvent): void {
    this.touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touch.x;
    const dy = event.changedTouches[0].clientY - this.touch.y;
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return; // a tap — handled by click
    event.preventDefault();
    if (this.state() !== 'playing') return;
    this.input(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  }

  tap(event: Event, key: GameKey): void {
    event.preventDefault();
    this.focus();
    if (this.state() === 'playing') this.input(key);
    else this.start();
  }

  toneClass(tone: Tone): string {
    return TONE_CLASS[tone];
  }

  private input(key: GameKey): void {
    this.game.press(key);
    // Some moves (e.g. switching lanes) take effect immediately.
    this.draw();
    if (this.game.over) this.finish();
  }

  private pause(): void {
    this.stopLoop();
    this.state.set('paused');
  }

  private scheduleTick(): void {
    this.stopLoop();
    this.timer = setTimeout(() => {
      if (this.state() !== 'playing') return;
      this.game.step();
      this.draw();
      if (this.game.over) {
        this.finish();
      } else {
        this.scheduleTick();
      }
    }, this.game.tickMs());
  }

  private finish(): void {
    this.stopLoop();
    this.state.set('over');
    if (this.game.score > this.best()) {
      this.best.set(this.game.score);
      this.newBest.set(true);
      this.saveBest(this.game.score);
    }
  }

  private stopLoop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** Splits each row into runs of characters that share a colour. */
  private draw(): void {
    const tones = this.tones();
    this.score.set(this.game.score);
    this.frame.set(
      this.game.render().map(row => {
        const segs: Segment[] = [];
        for (const ch of row) {
          const tone = tones[ch] ?? 'muted';
          const last = segs[segs.length - 1];
          if (last && last.tone === tone) last.text += ch;
          else segs.push({ text: ch, tone });
        }
        return segs;
      }),
    );
  }

  private loadBest(): number {
    if (!this.isBrowser) return 0;
    try {
      return Number(localStorage.getItem(this.storageKey())) || 0;
    } catch {
      return 0;
    }
  }

  private saveBest(score: number): void {
    try {
      localStorage.setItem(this.storageKey(), String(score));
    } catch {
      // storage unavailable — best score lasts for this visit only
    }
  }
}
