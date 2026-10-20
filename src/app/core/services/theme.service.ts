import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../models/portfolio.models';

/**
 * Dark is the default theme (set statically on <html> in index.html).
 * A saved "light" preference is applied by an inline script before first paint;
 * this service mirrors that state and persists changes.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  theme = signal<Theme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.set(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
  }

  toggle(): void {
    this.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  set(next: Theme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.theme.set(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage unavailable — theme still applies for this visit
    }
    document.documentElement.classList.toggle('dark', next === 'dark');
  }
}
