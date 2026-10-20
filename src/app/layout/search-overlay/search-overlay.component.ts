import {
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';
import { SearchOverlayService } from '../../core/search/search-overlay.service';
import { search, type SearchItem } from '../../core/search/search';

const SUGGESTED = ['.NET', 'Redis', 'MongoDB', 'Domain-Driven Design', 'CV', 'Games'];

/** Site-wide search panel. Open with "/" or Ctrl+K, or the search button in the nav. */
@Component({
  selector: 'app-search-overlay',
  standalone: true,
  template: `
    @if (overlay.isOpen()) {
      <div class="fixed inset-0 z-[60] bg-black/50" (click)="overlay.close()" aria-hidden="true"></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        class="term-window fixed inset-x-2 top-16 z-[61] mx-auto flex max-h-[min(75vh,40rem)] max-w-2xl flex-col shadow-2xl sm:top-24"
      >
        <div class="flex items-center gap-3 border-b border-(--color-border) px-4">
          <span class="font-mono text-(--color-primary)" aria-hidden="true">grep -i</span>
          <input
            #searchInput
            type="search"
            role="combobox"
            aria-label="Search sections, projects, skills and CV"
            aria-autocomplete="list"
            aria-controls="search-results"
            [attr.aria-expanded]="results().length > 0"
            [attr.aria-activedescendant]="results().length ? 'search-opt-' + active() : null"
            placeholder="search projects, skills, experience, cv …"
            class="h-12 min-w-0 flex-1 bg-transparent font-mono text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted)/70"
            [value]="query()"
            (input)="onInput($any($event.target).value)"
            (keydown)="onKeydown($event)"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="btn btn-sm min-h-7 px-2" (click)="overlay.close()" aria-label="Close search">esc</button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-2">
          @if (!query().trim()) {
            <p class="px-2 pt-2 pb-3 font-mono text-xs text-(--color-text-muted)">try:</p>
            <div class="flex flex-wrap gap-2 px-2 pb-2">
              @for (s of suggested; track s) {
                <button type="button" class="btn btn-sm" (click)="onInput(s)">{{ s }}</button>
              }
            </div>
          } @else if (!results().length) {
            <p class="px-3 py-6 font-mono text-sm text-(--color-text-muted)">no matches for '{{ query() }}'</p>
          } @else {
            <ul id="search-results" role="listbox" aria-label="Search results">
              @for (r of results(); track r.group + r.title; let i = $index) {
                @if (i === 0 || results()[i - 1].group !== r.group) {
                  <li role="presentation" class="label px-3 pt-3 pb-1">{{ r.group }}</li>
                }
                <li
                  [id]="'search-opt-' + i"
                  role="option"
                  [attr.aria-selected]="i === active()"
                  (click)="choose(r)"
                  (mousemove)="active.set(i)"
                  class="flex cursor-pointer items-center justify-between gap-4 rounded px-3 py-2"
                  [style.background]="i === active() ? 'var(--color-surface-2)' : null"
                >
                  <span class="min-w-0">
                    <span class="block truncate font-mono text-sm" [class]="i === active() ? 'text-(--color-primary)' : 'text-(--color-text)'">{{ r.title }}</span>
                    <span class="block truncate text-xs text-(--color-text-muted)">{{ r.subtitle }}</span>
                  </span>
                  <span class="shrink-0 font-mono text-xs text-(--color-text-muted)" aria-hidden="true">{{ hint(r) }}</span>
                </li>
              }
            </ul>
          }
        </div>

        <div class="flex gap-4 border-t border-(--color-border) bg-(--color-surface-2) px-4 py-2 font-mono text-[0.6875rem] text-(--color-text-muted)">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    }
  `,
})
export class SearchOverlayComponent {
  readonly overlay = inject(SearchOverlayService);
  private readonly router = inject(Router);
  private readonly scroll = inject(ScrollService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly suggested = SUGGESTED;
  readonly query = signal('');
  readonly active = signal(0);
  /** Results grouped so that items of the same group sit together, best group first. */
  readonly results = computed(() => {
    const hits = search(this.query(), 14);
    const order = [...new Set(hits.map(h => h.group))];
    return order.flatMap(g => hits.filter(h => h.group === g));
  });

  private returnFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      if (this.overlay.isOpen()) {
        this.returnFocus = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.searchInput()?.nativeElement.focus());
      } else {
        this.query.set('');
        this.active.set(0);
        this.returnFocus?.focus?.({ preventScroll: true });
        this.returnFocus = null;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target.matches('input, textarea, select, [contenteditable="true"]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.overlay.toggle();
    } else if (event.key === '/' && !typing) {
      event.preventDefault();
      this.overlay.open();
    } else if (event.key === 'Escape' && this.overlay.isOpen()) {
      this.overlay.close();
    }
  }

  onInput(value: string): void {
    this.query.set(value);
    this.active.set(0);
    const el = this.searchInput()?.nativeElement;
    if (el && el.value !== value) {
      el.value = value;
      el.focus();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const n = this.results().length;
    if (event.key === 'ArrowDown' && n) {
      event.preventDefault();
      this.active.update(i => (i + 1) % n);
    } else if (event.key === 'ArrowUp' && n) {
      event.preventDefault();
      this.active.update(i => (i - 1 + n) % n);
    } else if (event.key === 'Enter' && n) {
      event.preventDefault();
      this.choose(this.results()[this.active()]);
    }
    if (event.key.startsWith('Arrow')) {
      queueMicrotask(() => document.getElementById(`search-opt-${this.active()}`)?.scrollIntoView({ block: 'nearest' }));
    }
  }

  hint(r: SearchItem): string {
    switch (r.target.kind) {
      case 'section': return `#${r.target.id === 'hero' ? 'home' : r.target.id}`;
      case 'route': return r.target.path;
      case 'url': return '↗';
    }
  }

  choose(r: SearchItem): void {
    this.overlay.close();
    const t = r.target;
    if (t.kind === 'url') {
      window.open(t.url, '_blank', 'noopener');
    } else if (t.kind === 'route') {
      this.router.navigateByUrl(t.path);
    } else if (this.router.url.split('#')[0] === '/') {
      this.scroll.scrollTo(t.id);
    } else {
      this.router.navigate(['/'], { fragment: t.id });
    }
  }
}
