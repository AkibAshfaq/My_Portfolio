import { Component } from '@angular/core';
import { ABOUT_DATA } from '../../core/models/portfolio.data';
import type { AboutData } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-about-section',
  standalone: true,
  template: `
    <section
      id="about"
      aria-label="About"
      role="region"
      class="py-20 lg:py-28 bg-(--color-surface)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-10 lg:mb-14 text-center">About Me</h2>

        <div class="grid md:grid-cols-2 xl:grid-cols-5 gap-10 lg:gap-16 items-start">

          <div class="flex flex-col gap-6 xl:col-span-2">
            <img
              [src]="about.photoUrl"
              [alt]="about.photoAlt"
              (error)="onImgError($event)"
              loading="lazy"
              class="rounded-2xl w-full object-cover shadow-lg aspect-square"
            />

            <div class="rounded-xl border border-(--color-border) bg-(--color-bg) p-5 flex flex-col gap-3">
              <h3 class="text-sm font-bold text-(--color-text) uppercase tracking-wider">Quick Info</h3>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">University</p>
                  <p class="text-(--color-text) font-medium">AIUB</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Location</p>
                  <p class="text-(--color-text) font-medium">Dhaka, Bangladesh</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">GitHub</p>
                  <a
                    href="https://github.com/AkibAshfaq"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-(--color-primary) font-medium hover:underline"
                  >AkibAshfaq</a>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Repos</p>
                  <p class="text-(--color-text) font-medium">19 Public</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Status</p>
                  <p class="text-green-600 dark:text-green-400 font-semibold">Open to Work</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Member Since</p>
                  <p class="text-(--color-text) font-medium">Sep 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6 xl:col-span-3">
            <p class="text-(--color-text) leading-relaxed whitespace-pre-line">
              {{ about.biography }}
            </p>

            <div class="rounded-xl border border-(--color-border) bg-(--color-bg) p-5">
              <h3 class="text-sm font-bold text-(--color-text) uppercase tracking-wider mb-4">GitHub</h3>

              <div class="flex items-center gap-4 mb-5">
                <img
                  src="/images/akib-ashfaq.jpeg"
                  alt="Akib Ashfaq GitHub avatar"
                  class="w-12 h-12 rounded-full border border-(--color-border) shrink-0 object-cover"
                  loading="lazy"
                  width="48"
                  height="48"
                />
                <div>
                  <p class="font-semibold text-(--color-text)">AkibAshfaq</p>
                  <a
                    href="https://github.com/AkibAshfaq"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs text-(--color-primary) hover:underline"
                  >github.com/AkibAshfaq ↗</a>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center mb-4">
                <div class="rounded-lg border border-(--color-border) bg-(--color-surface) p-3">
                  <p class="text-2xl font-extrabold text-(--color-text)">19</p>
                  <p class="text-xs text-(--color-text-muted) mt-0.5">Repos</p>
                </div>
                <div class="rounded-lg border border-(--color-border) bg-(--color-surface) p-3">
                  <p class="text-2xl font-extrabold text-(--color-text)">8+</p>
                  <p class="text-xs text-(--color-text-muted) mt-0.5">Projects</p>
                </div>
                <div class="rounded-lg border border-(--color-border) bg-(--color-surface) p-3">
                  <p class="text-2xl font-extrabold text-(--color-text)">7</p>
                  <p class="text-xs text-(--color-text-muted) mt-0.5">Languages</p>
                </div>
              </div>

              <a
                href="https://github.com/AkibAshfaq?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full text-center rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary)"
              >
                View All Repositories →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  readonly about: AboutData = ABOUT_DATA;

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/183318977?v=4';
  }
}
