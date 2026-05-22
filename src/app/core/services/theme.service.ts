import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme');
      let initial: Theme;

      if (stored === 'light' || stored === 'dark') {
        initial = stored;
      } else {
        initial = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }

      this.theme.set(initial);

      if (initial === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }

  toggle(): void {
    if (isPlatformBrowser(this.platformId)) {
      const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
      this.theme.set(next);
      localStorage.setItem('theme', next);

      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
