import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  OnInit,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { GitHubService } from '../../../core/services/github.service';
import { ScrollService } from '../../../core/services/scroll.service';
import { ThemeService } from '../../../core/services/theme.service';
import {
  PROMPT,
  commonPrefix,
  complete,
  runCommand,
  type ShellContext,
  type ShellLine,
} from '../../../core/terminal/shell';
import type { SectionId } from '../../../core/models/portfolio.models';

interface Entry extends ShellLine {
  id: number;
}

/**
 * Interactive shell. Commands come from core/terminal/shell.ts; this component
 * renders output, handles keyboard input and performs the side effects.
 */
@Component({
  selector: 'app-terminal',
  standalone: true,
  template: `
    <div class="flex h-full flex-col font-mono text-[0.8125rem] leading-6" (click)="focusInput($event)">
      <div
        #scroller
        class="flex-1 overflow-y-auto px-4 py-3"
        role="log"
        aria-live="polite"
        [attr.aria-label]="label() + ' output'"
      >
        @for (line of lines(); track line.id) {
          @if (line.href) {
            <a [href]="line.href" target="_blank" rel="noopener noreferrer"
               class="block whitespace-pre-wrap break-words text-(--color-info) hover:underline">{{ line.text }}</a>
          } @else if (line.run) {
            <button type="button" (click)="execute(line.run)"
                    class="block w-full whitespace-pre-wrap break-words text-left hover:bg-(--color-surface-2) hover:text-(--color-primary)"
                    [class]="toneClass(line.tone)">{{ line.text }}</button>
          } @else if (line.tone === 'command') {
            <p class="whitespace-pre-wrap break-words"><span class="text-(--color-primary)">{{ prompt }}</span> {{ line.text }}</p>
          } @else {
            <p class="min-h-6 whitespace-pre-wrap break-words" [class]="toneClass(line.tone)">{{ line.text }}</p>
          }
        }

        <form class="flex items-center gap-2" (submit)="onSubmit($event)">
          <label [for]="inputId" class="shrink-0 text-(--color-primary)">{{ prompt }}</label>
          <input
            #cmdInput
            [id]="inputId"
            type="text"
            class="min-w-0 flex-1 bg-transparent text-(--color-text) caret-(--color-primary) outline-none"
            [value]="draft()"
            (input)="draft.set($any($event.target).value)"
            (keydown)="onKeydown($event)"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            enterkeyhint="go"
            [attr.aria-label]="label() + ' command input'"
          />
        </form>
      </div>

      @if (suggestions().length) {
        <div class="flex gap-2 overflow-x-auto border-t border-(--color-border) bg-(--color-surface-2) px-3 py-2"
             aria-label="Suggested commands">
          @for (s of suggestions(); track s) {
            <button type="button" class="btn btn-sm shrink-0" (click)="execute(s)">{{ s }}</button>
          }
        </div>
      }
    </div>
  `,
})
export class TerminalComponent implements OnInit, AfterViewInit {
  private static nextId = 0;

  readonly label = input('Terminal');
  readonly autofocus = input(false);
  /** Commands run silently on start so the terminal isn't empty. */
  readonly bootCommands = input<string[]>([]);
  readonly suggestions = input<string[]>(['help', 'whoami', 'projects', 'skills', 'cv', 'contact']);
  readonly closed = output<void>();

  readonly prompt = PROMPT;
  readonly inputId = `term-input-${TerminalComponent.nextId++}`;
  readonly lines = signal<Entry[]>([]);
  readonly draft = signal('');

  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly cmdInput = viewChild.required<ElementRef<HTMLInputElement>>('cmdInput');

  private readonly router = inject(Router);
  private readonly scroll = inject(ScrollService);
  private readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ghStats = toSignal(inject(GitHubService).stats$);

  private readonly commandHistory: string[] = [];
  private historyIndex = -1;
  private lineId = 0;

  private readonly ctx: ShellContext = {
    scrollTo: (id: SectionId) => {
      if (this.router.url.split('#')[0] === '/') {
        this.scroll.scrollTo(id);
      } else {
        this.router.navigate(['/'], { fragment: id });
      }
    },
    navigate: path => this.router.navigateByUrl(path),
    openUrl: url => {
      if (this.isBrowser) {
        window.open(url, url.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
      }
    },
    setTheme: t => this.themeService.set(t),
    theme: () => this.themeService.theme(),
    close: () => this.closed.emit(),
    history: () => this.commandHistory,
    github: () => this.ghStats(),
    now: () => new Date(),
  };

  ngOnInit(): void {
    // Boot commands render on the server too, so the output is part of the prerendered page.
    for (const cmd of this.bootCommands()) {
      this.print({ text: cmd, tone: 'command' });
      this.print(...runCommand(cmd, this.ctx).lines);
    }
  }

  ngAfterViewInit(): void {
    if (this.autofocus()) {
      this.cmdInput().nativeElement.focus({ preventScroll: true });
    }
  }

  execute(raw: string): void {
    const cmd = raw.trim();
    this.print({ text: cmd, tone: 'command' });
    if (cmd) {
      this.commandHistory.push(cmd);
    }
    this.historyIndex = -1;
    this.setDraft('');
    const result = runCommand(cmd, this.ctx);
    if (result.clear) {
      this.lines.set([]);
    }
    this.print(...result.lines);
    this.cmdInput().nativeElement.focus({ preventScroll: true });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.execute(this.cmdInput().nativeElement.value);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.browseHistory(1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.browseHistory(-1);
        break;
      case 'Tab':
        if (this.draft()) {
          event.preventDefault();
          this.autocomplete();
        }
        break;
      case 'Escape':
        this.closed.emit();
        break;
      default:
        if (event.ctrlKey && event.key.toLowerCase() === 'l') {
          event.preventDefault();
          this.lines.set([]);
        } else if (event.ctrlKey && event.key.toLowerCase() === 'c' && !this.hasSelection()) {
          event.preventDefault();
          this.print({ text: `${this.draft()}^C`, tone: 'command' });
          this.setDraft('');
        }
    }
  }

  focusInput(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('a, button') && !window.getSelection()?.toString()) {
      this.cmdInput().nativeElement.focus({ preventScroll: true });
    }
  }

  toneClass(tone: ShellLine['tone']): string {
    switch (tone) {
      case 'muted': return 'text-(--color-text-muted)';
      case 'accent': return 'text-(--color-primary) font-medium';
      case 'info': return 'text-(--color-info)';
      case 'warn': return 'text-(--color-warn)';
      case 'error': return 'text-(--color-error)';
      default: return 'text-(--color-text)';
    }
  }

  /**
   * Writes the draft to both the signal and the input element. Writing the element
   * directly matters: if keystrokes outpace change detection, a [value] binding can
   * see no net change (e.g. '' → '') and leave stale text in the field.
   */
  private setDraft(value: string): void {
    this.draft.set(value);
    const el = this.cmdInput().nativeElement;
    el.value = value;
    el.setSelectionRange(value.length, value.length);
  }

  private hasSelection(): boolean {
    const el = this.cmdInput().nativeElement;
    return el.selectionStart !== el.selectionEnd || !!window.getSelection()?.toString();
  }

  private print(...lines: ShellLine[]): void {
    if (!lines.length) return;
    this.lines.update(ls => [...ls, ...lines.map(l => ({ ...l, id: this.lineId++ }))]);
    if (this.isBrowser) {
      requestAnimationFrame(() => {
        const el = this.scroller().nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    }
  }

  private browseHistory(step: number): void {
    if (!this.commandHistory.length) return;
    const max = this.commandHistory.length - 1;
    this.historyIndex = Math.min(max, Math.max(-1, this.historyIndex + step));
    this.setDraft(this.historyIndex === -1 ? '' : this.commandHistory[max - this.historyIndex]);
  }

  private autocomplete(): void {
    const options = complete(this.draft());
    if (options.length === 1) {
      this.setDraft(options[0] + ' ');
    } else if (options.length > 1) {
      const prefix = commonPrefix(options);
      if (prefix.length > this.draft().length) {
        this.setDraft(prefix);
      } else {
        this.print({ text: this.draft(), tone: 'command' }, { text: options.map(o => o.split(' ').pop()).join('   '), tone: 'muted' });
      }
    }
  }
}
