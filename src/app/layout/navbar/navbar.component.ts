import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';
import { SectionId } from '../../core/models/portfolio.models';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeToggleComponent, RouterLink],
  template: `
    <nav
      role="navigation"
      aria-label="Main navigation"
      class="fixed top-0 left-0 right-0 z-50 bg-(--color-bg)/90 backdrop-blur border-b border-(--color-border)"
    >
      <a
        href="#hero"
        class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--color-primary) focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          routerLink="/"
          class="font-bold text-(--color-text) text-lg hover:text-(--color-primary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) rounded"
        >
          Akib Ashfaq
        </a>

        <div class="hidden md:flex items-center gap-1">
          @for (link of SECTION_LINKS; track link.id) {
            <button
              type="button"
              (click)="handleNavClick(link.id)"
              [attr.aria-label]="link.label"
              [class]="activeSection() === link.id
                ? 'text-(--color-primary) font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors'
                : 'text-(--color-text-muted) hover:text-(--color-text) font-medium text-sm px-3 py-1.5 rounded-lg transition-colors'"
            >{{ link.label }}</button>
          }

          <a
            routerLink="/games"
            class="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
          >
            <span aria-hidden="true">🎮</span> Games
          </a>
        </div>

        <div class="flex items-center gap-2">
          <app-theme-toggle />
          <button
            type="button"
            class="md:hidden p-2 rounded-lg text-(--color-text) hover:bg-(--color-surface) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            (click)="menuOpen.update(v => !v)"
            [attr.aria-label]="menuOpen() ? 'Close navigation menu' : 'Open navigation menu'"
            [attr.aria-expanded]="menuOpen()"
          >
            @if (menuOpen()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            }
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div class="md:hidden border-t border-(--color-border) bg-(--color-bg) px-4 py-3 flex flex-col gap-1">
          @for (link of SECTION_LINKS; track link.id) {
            <button
              type="button"
              (click)="handleNavClick(link.id)"
              [attr.aria-label]="link.label"
              class="text-left text-(--color-text) hover:text-(--color-primary) font-medium py-2 px-2 rounded-lg transition-colors"
            >{{ link.label }}</button>
          }
          <a
            routerLink="/games"
            (click)="menuOpen.set(false)"
            class="inline-flex items-center gap-2 text-(--color-text) hover:text-(--color-primary) font-medium py-2 px-2 rounded-lg transition-colors"
          >
            <span aria-hidden="true">🎮</span> Games
          </a>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  readonly scrollService = inject(ScrollService);
  readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly SECTION_LINKS: { id: SectionId; label: string }[] = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  activeSection = signal<SectionId>('hero');
  menuOpen = signal(false);
  private observer: IntersectionObserver | null = null;

  handleNavClick(id: SectionId): void {
    this.menuOpen.set(false);
    if (this.router.url === '/') {
      // On home page — smooth-scroll directly
      this.scrollService.scrollTo(id);
    } else {
      // On another page — navigate to home then let anchorScrolling take over
      this.router.navigate(['/'], { fragment: id });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const validIds = new Set(this.SECTION_LINKS.map(l => l.id));
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && validIds.has(entry.target.id as SectionId)) {
              this.activeSection.set(entry.target.id as SectionId);
            }
          }
        },
        { threshold: 0.3 },
      );
      document.querySelectorAll('section[id]').forEach(s => this.observer!.observe(s));
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
