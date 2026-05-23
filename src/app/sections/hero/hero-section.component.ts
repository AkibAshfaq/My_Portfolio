import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScrollService } from '../../core/services/scroll.service';
import { GitHubService } from '../../core/services/github.service';
import { HERO_DATA, PROJECTS_DATA } from '../../core/models/portfolio.data';
import { HeroCanvasComponent } from '../../shared/components/hero-canvas/hero-canvas.component';
import type { HeroStat } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [HeroCanvasComponent],
  template: `
    <section
      id="hero"
      aria-label="Hero"
      role="region"
      class="relative min-h-screen flex items-center justify-center bg-(--color-bg) px-4 sm:px-6 lg:px-8 py-24 lg:py-32 overflow-hidden"
    >
      <!-- 3D animated tech background -->
      <app-hero-canvas />

      <!-- Radial vignette: bg-solid at center → transparent at edges.
           Keeps the hero text clearly readable while animation shows on the sides. -->
      <div
        class="absolute inset-0 z-[1] pointer-events-none"
        style="background: radial-gradient(ellipse 68% 62% at 50% 44%, var(--color-bg) 0%, color-mix(in oklch, var(--color-bg) 75%, transparent) 38%, color-mix(in oklch, var(--color-bg) 30%, transparent) 62%, transparent 100%)"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 mx-auto max-w-4xl text-center">

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
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-xl border border-(--color-border) bg-(--color-surface) px-8 py-3 text-base font-semibold text-(--color-text) shadow-sm transition-colors hover:bg-(--color-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2"
            >
              Download Résumé
            </a>
          }
        </div>

        <!-- Dynamic stats row -->
        <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-(--color-text-muted)">
          @for (stat of stats(); track stat.label) {
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                @for (d of stat.paths; track d) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="d"/>
                }
              </svg>
              <span>{{ stat.label }}</span>
            </div>
          }
        </div>

      </div><!-- /z-10 content -->
    </section>
  `,
})
export class HeroSectionComponent {
  readonly scrollService = inject(ScrollService);
  readonly hero = HERO_DATA;

  private readonly ghStats = toSignal(inject(GitHubService).stats$);

  readonly stats = computed<HeroStat[]>(() => {
    const gh = this.ghStats();
    return [
      {
        label: `${PROJECTS_DATA.length}+ Projects Built`,
        paths: [
          'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z',
          'M3 9l9 6 9-6',
        ],
      },
      {
        label: `${gh?.languageCount ?? '…'} Languages`,
        paths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
      },
      {
        label: `${gh?.publicRepos ?? '…'} Repos on GitHub`,
        paths: [
          'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        ],
      },
      {
        label: HERO_DATA.location,
        paths: [
          'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
          'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        ],
      },
    ];
  });
}
