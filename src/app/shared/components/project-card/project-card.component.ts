import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article
      class="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm transition-shadow hover:shadow-md h-full"
    >
      <h3 class="text-xl font-semibold text-(--color-text)">{{ project().name }}</h3>

      <p class="flex-1 text-sm leading-relaxed text-(--color-text-muted)">{{ project().description }}</p>

      <ul role="list" class="flex flex-wrap gap-2">
        @for (tech of project().technologies; track tech) {
          <li>
            <span
              class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)"
            >{{ tech }}</span>
          </li>
        }
      </ul>

      <div class="flex flex-wrap gap-3">
        <a
          [routerLink]="['/projects', project().slug]"
          class="inline-flex items-center gap-1 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
        >View Details</a>

        @if (project().demoUrl) {
          <a
            [href]="project().demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm font-medium text-(--color-text) transition-colors hover:bg-(--color-bg)"
          >Live Demo</a>
        }

        @if (project().repoUrl) {
          <a
            [href]="project().repoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm font-medium text-(--color-text) transition-colors hover:bg-(--color-bg)"
          >Source Code</a>
        }
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
