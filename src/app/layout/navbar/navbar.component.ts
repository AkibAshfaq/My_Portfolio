import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../core/services/scroll.service';
import { SectionId } from '../../core/models/portfolio.models';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <nav
      role="navigation"
      aria-label="Main navigation"
      class="fixed top-0 left-0 right-0 z-50 bg-(--color-bg)/90 backdrop-blur border-b border-(--color-border)"
    >
      <!-- Skip to main content link (accessibility) -->
      <a
        href="#hero"
        class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--color-primary) focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo/brand -->
        <span class="font-bold text-(--color-text) text-lg">Alex Rivera</span>
        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-6">
          @for (link of SECTION_LINKS; track link.id) {
            <button
              type="button"
              (click)="scrollService.scrollTo(link.id); menuOpen.set(false)"
              [attr.aria-label]="link.label"
              [class]="activeSection() === link.id
                ? 'text-(--color-primary) font-semibold text-sm transition-colors'
                : 'text-(--color-text-muted) hover:text-(--color-text) font-medium text-sm transition-colors'"
            >{{ link.label }}</button>
          }
        </div>
        <!-- Right side: theme toggle + hamburger -->
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            }
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      @if (menuOpen()) {
        <div class="md:hidden border-t border-(--color-border) bg-(--color-bg) px-4 py-3 flex flex-col gap-3">
          @for (link of SECTION_LINKS; track link.id) {
            <button
              type="button"
              (click)="scrollService.scrollTo(link.id); menuOpen.set(false)"
              [attr.aria-label]="link.label"
              class="text-left text-(--color-text) hover:text-(--color-primary) font-medium py-1 transition-colors"
            >{{ link.label }}</button>
          }
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  readonly scrollService = inject(ScrollService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly SECTION_LINKS = [
    { id: 'hero' as SectionId, label: 'Home' },
    { id: 'about' as SectionId, label: 'About' },
    { id: 'skills' as SectionId, label: 'Skills' },
    { id: 'experience' as SectionId, label: 'Experience' },
    { id: 'projects' as SectionId, label: 'Projects' },
    { id: 'contact' as SectionId, label: 'Contact' },
  ];

  activeSection = signal<SectionId>('hero');
  menuOpen = signal<boolean>(false);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.activeSection.set(entry.target.id as SectionId);
            }
          }
        },
        { threshold: 0.3 },
      );

      document.querySelectorAll('section[id]').forEach((section) => {
        this.observer!.observe(section);
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
