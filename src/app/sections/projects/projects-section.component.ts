import { Component, signal, computed } from '@angular/core';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

const INITIAL_COUNT = 6;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ProjectCardComponent, SectionHeadingComponent],
  template: `
    <section id="projects" aria-labelledby="projects-title" class="border-b border-(--color-border) bg-(--color-surface-2)/40 py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="projects-title" command="ls -l ~/projects" title="Projects"
          subtitle="Selected work across web, mobile, desktop and backend. Open any project for architecture notes and setup steps." />

        <ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          @for (project of visibleProjects(); track project.slug) {
            <li><app-project-card [project]="project" /></li>
          }
        </ul>

        @if (projects.length > initialCount) {
          <div class="mt-8">
            <button type="button" (click)="expanded.update(v => !v)" class="btn" [attr.aria-expanded]="expanded()">
              @if (expanded()) {
                <span class="text-(--color-text-muted)">$</span> ls ~/projects | head -{{ initialCount }}
              } @else {
                <span class="text-(--color-text-muted)">$</span> ls ~/projects --all
                <span class="text-(--color-text-muted)">(+{{ projects.length - initialCount }})</span>
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
}
