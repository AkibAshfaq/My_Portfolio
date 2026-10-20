import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ScrollService } from '../../core/services/scroll.service';
import { TerminalOverlayService } from '../../core/terminal/terminal-overlay.service';
import { SearchOverlayService } from '../../core/search/search-overlay.service';
import { SectionId } from '../../core/models/portfolio.models';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeToggleComponent, RouterLink, RouterLinkActive],
  template: `
    <nav
      aria-label="Main navigation"
      class="fixed inset-x-0 top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/92 backdrop-blur"
    >
      <div class="container-page flex h-14 items-center justify-between gap-4">
        <a
          routerLink="/"
          class="font-mono text-sm font-medium text-(--color-text) hover:text-(--color-primary)"
          aria-label="Akib Ashfaq — home"
        >
          <span class="text-(--color-primary)">akib</span><span class="text-(--color-text-muted)">&#64;portfolio:</span><span class="text-(--color-info)">~</span><span class="text-(--color-text-muted)">$</span>
        </a>

        <ul class="hidden items-center gap-1 md:flex">
          @for (link of SECTION_LINKS; track link.id) {
            <li>
              <button
                type="button"
                (click)="handleNavClick(link.id)"
                [attr.aria-current]="activeSection() === link.id ? 'location' : null"
                class="rounded px-2.5 py-1.5 font-mono text-[0.8125rem] transition-colors"
                [class]="activeSection() === link.id
                  ? 'text-(--color-primary) bg-(--color-surface-2)'
                  : 'text-(--color-text-muted) hover:text-(--color-text)'"
              >./{{ link.label }}</button>
            </li>
          }
          <li>
            <a routerLink="/cv" routerLinkActive="text-(--color-primary) bg-(--color-surface-2)" class="rounded px-2.5 py-1.5 font-mono text-[0.8125rem] text-(--color-text-muted) hover:text-(--color-text)">./cv</a>
          </li>
          <li>
            <a routerLink="/games" routerLinkActive="text-(--color-primary) bg-(--color-surface-2)" class="rounded px-2.5 py-1.5 font-mono text-[0.8125rem] text-(--color-text-muted) hover:text-(--color-text)">./games</a>
          </li>
        </ul>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-sm"
            (click)="searchOverlay.open()"
            aria-label="Search the site (shortcut: slash or Ctrl+K)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <span class="hidden xl:inline">search</span>
            <kbd class="hidden rounded border border-(--color-border) px-1 text-[0.6875rem] text-(--color-text-muted) lg:inline">/</kbd>
          </button>
          <button
            type="button"
            class="btn btn-sm"
            (click)="overlay.toggle()"
            [attr.aria-expanded]="overlay.isOpen()"
            aria-label="Open terminal (shortcut: backtick key)"
          >
            <span class="text-(--color-primary)" aria-hidden="true">&gt;_</span>
            <span class="hidden sm:inline">terminal</span>
            <kbd class="hidden rounded border border-(--color-border) px-1 text-[0.6875rem] text-(--color-text-muted) lg:inline">\`</kbd>
          </button>
          <app-theme-toggle />
          <button
            type="button"
            class="btn btn-sm w-9 px-0 md:hidden"
            (click)="menuOpen.update(v => !v)"
            [attr.aria-label]="menuOpen() ? 'Close navigation menu' : 'Open navigation menu'"
            [attr.aria-expanded]="menuOpen()"
          >
            @if (menuOpen()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            }
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <ul class="container-page flex flex-col border-t border-(--color-border) py-2 font-mono text-sm md:hidden">
          @for (link of SECTION_LINKS; track link.id) {
            <li>
              <button type="button" (click)="handleNavClick(link.id)"
                      class="w-full py-2.5 text-left text-(--color-text) hover:text-(--color-primary)">
                <span class="text-(--color-text-muted)">cd</span> {{ link.label }}/
              </button>
            </li>
          }
          <li>
            <a routerLink="/cv" (click)="menuOpen.set(false)" class="block py-2.5 text-(--color-text) hover:text-(--color-primary)">
              <span class="text-(--color-text-muted)">cd</span> cv/
            </a>
          </li>
          <li>
            <a routerLink="/games" (click)="menuOpen.set(false)" class="block py-2.5 text-(--color-text) hover:text-(--color-primary)">
              <span class="text-(--color-text-muted)">cd</span> games/
            </a>
          </li>
        </ul>
      }
    </nav>
  `,
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  readonly scrollService = inject(ScrollService);
  readonly overlay = inject(TerminalOverlayService);
  readonly searchOverlay = inject(SearchOverlayService);
  readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly SECTION_LINKS: { id: SectionId; label: string }[] = [
    { id: 'skills', label: 'skills' },
    { id: 'experience', label: 'experience' },
    { id: 'projects', label: 'projects' },
    { id: 'contact', label: 'contact' },
  ];

  activeSection = signal<SectionId>('hero');
  menuOpen = signal(false);
  private observer: IntersectionObserver | null = null;

  constructor() {
    // Sections are re-created when returning to the home page; re-observe them.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.activeSection.set('hero');
        setTimeout(() => this.observeSections());
      });
  }

  handleNavClick(id: SectionId): void {
    this.menuOpen.set(false);
    if (this.router.url.split('#')[0] === '/') {
      this.scrollService.scrollTo(id);
    } else {
      this.router.navigate(['/'], { fragment: id });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    this.observeSections();
  }

  private observeSections(): void {
    if (!this.observer) return;
    this.observer.disconnect();
    document.querySelectorAll('main section[id]').forEach(s => this.observer!.observe(s));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
