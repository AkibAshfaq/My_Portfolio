import { Component, inject } from '@angular/core';
import { ScrollService } from '../../core/services/scroll.service';
import { HERO_DATA } from '../../core/models/portfolio.data';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  template: `
    <section
      id="hero"
      aria-label="Hero"
      role="region"
      class="min-h-screen flex items-center justify-center bg-(--color-bg) px-6 py-24"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h1 class="mb-4 text-5xl font-extrabold tracking-tight text-(--color-text) sm:text-6xl lg:text-7xl">
          {{ hero.name }}
        </h1>

        <p class="mb-4 text-xl font-medium text-(--color-primary) sm:text-2xl">
          {{ hero.title }}
        </p>

        <p class="mb-10 text-lg leading-relaxed text-(--color-text-muted) sm:text-xl">
          {{ hero.tagline }}
        </p>

        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  readonly scrollService = inject(ScrollService);
  readonly hero = HERO_DATA;
}
