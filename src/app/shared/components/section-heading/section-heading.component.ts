import { Component, input } from '@angular/core';

/** Section header rendered as a shell prompt followed by the section title. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  template: `
    <header class="mb-10 lg:mb-12">
      <p class="mb-2 font-mono text-sm text-(--color-text-muted)" aria-hidden="true">
        <span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~</span>$
        <span class="text-(--color-text)">{{ command() }}</span>
      </p>
      <h2 [id]="headingId() || null" class="text-2xl font-semibold text-(--color-text) sm:text-3xl">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="mt-2 max-w-3xl text-(--color-text-muted)">{{ subtitle() }}</p>
      }
    </header>
  `,
})
export class SectionHeadingComponent {
  readonly command = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly headingId = input('');
}
