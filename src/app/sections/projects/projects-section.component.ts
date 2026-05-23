import { Component, signal, computed } from '@angular/core';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

const INITIAL_COUNT = 3;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ProjectCardComponent],
  template: `
    <section id="projects" aria-label="Projects" role="region" class="py-20 lg:py-28 bg-(--color-bg)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-10 lg:mb-14 text-center">Projects</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          @for (project of visibleProjects(); track project.name) {
            <app-project-card [project]="project" />
          }
        </div>

        @if (projects.length > initialCount) {
          <div class="mt-10 text-center">
            <button
              type="button"
              (click)="toggleExpand()"
              class="inline-flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-3 text-sm font-semibold text-(--color-text) shadow-sm transition-colors hover:bg-(--color-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            >
              @if (expanded()) {
                Show Less
              } @else {
                Show More ({{ projects.length - initialCount }} more)
              }
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class ProjectsSectionComponent {
  readonly projects = PROJECTS_DATA;
  readonly initialCount = INITIAL_COUNT;
  readonly expanded = signal(false);

  readonly visibleProjects = computed(() =>
    this.expanded() ? this.projects : this.projects.slice(0, INITIAL_COUNT)
  );

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }
}
