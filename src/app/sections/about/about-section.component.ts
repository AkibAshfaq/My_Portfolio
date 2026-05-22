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
      class="py-20 bg-(--color-bg)"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-(--color-text) mb-10 text-center">
          About Me
        </h2>
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              [src]="about.photoUrl"
              [alt]="about.photoAlt"
              (error)="onImgError($event)"
              loading="lazy"
              class="rounded-xl w-full object-cover shadow-lg"
            />
          </div>
          <div>
            <p class="text-(--color-text) leading-relaxed whitespace-pre-line">
              {{ about.biography }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  readonly about: AboutData = ABOUT_DATA;

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/avatar-fallback.svg';
  }
}
