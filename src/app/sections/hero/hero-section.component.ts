import { Component, inject } from '@angular/core';
import { ScrollService } from '../../core/services/scroll.service';
import { HERO_DATA } from '../../core/models/portfolio.data';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  template: `
    <section
      id="hero"
      aria-label="Hero"
      role="region"
      class="min-h-screen flex items-center justify-center bg-(--color-bg) px-4 sm:px-6 lg:px-8 py-24 lg:py-32"
    >
      <div class="mx-auto max-w-4xl text-center">

        @if (hero.openToWork) {
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
            <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
            Open to Opportunities
          </div>
        }

        <h1 class="mb-4 text-5xl font-extrabold tracking-tight text-(--color-text) sm:text-6xl lg:text-7xl xl:text-8xl">
          {{ hero.name }}
        </h1>

        <p class="mb-4 text-xl font-medium text-(--color-primary) sm:text-2xl">
          {{ hero.title }}
        </p>

        <p class="mb-10 text-lg leading-relaxed text-(--color-text-muted) sm:text-xl">
          {{ hero.tagline }}
        </p>

        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12">
          <button
            type="button"
            (click)="scrollService.scrollTo('projects')"
            class="inline-flex items-center rounded-xl bg-(--color-primary) px-8 py-3 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
          >
            View My Work
          </button>

          @if (hero.resumeUrl) {
            <a
              [href]="hero.resumeUrl"
              download
              class="inline-flex items-center rounded-xl border border-(--color-border) bg-(--color-surface) px-8 py-3 text-base font-semibold text-(--color-text) shadow-sm transition-colors hover:bg-(--color-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
            >
              Download Résumé
            </a>
          }
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-(--color-text-muted)">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9 6 9-6"/>
            </svg>
            <span>8+ Projects Built</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <span>7 Languages</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>19 Repos on GitHub</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  readonly scrollService = inject(ScrollService);
  readonly hero = HERO_DATA;
}
