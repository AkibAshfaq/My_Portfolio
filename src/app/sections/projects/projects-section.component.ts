import { Component, signal, computed } from '@angular/core';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '../../core/models/portfolio.data';
import type { ProjectType } from '../../core/models/portfolio.models';
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
        <app-section-heading headingId="projects-title" [command]="command()" title="Projects"
          subtitle="Work across backend, web, desktop and mobile, plus games, hardware and competitive programming." />

        <div class="mb-6 flex flex-wrap items-center gap-3 font-mono text-sm">
          <label for="project-category" class="text-(--color-text-muted)">--category</label>
          <div class="relative">
            <select
              id="project-category"
              class="btn appearance-none pr-9 text-(--color-text)"
              [value]="category()"
              (change)="selectCategory($any($event.target).value)"
            >
              @for (c of categories; track c.value) {
                <option [value]="c.value">{{ c.label }} ({{ countFor(c.value) }})</option>
              }
            </select>
            <svg class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--color-text-muted)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <p class="text-(--color-text-muted)" role="status">{{ filtered().length }} {{ filtered().length === 1 ? 'entry' : 'entries' }}</p>
        </div>

        <ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          @for (project of visible(); track project.slug) {
            <li><app-project-card [project]="project" /></li>
          }
        </ul>

        @if (filtered().length > initialCount) {
          <div class="mt-8">
            <button type="button" (click)="expanded.update(v => !v)" class="btn" [attr.aria-expanded]="expanded()">
              @if (expanded()) {
                <span class="text-(--color-text-muted)">$</span> ls | head -{{ initialCount }}
              } @else {
                <span class="text-(--color-text-muted)">$</span> ls --all
                <span class="text-(--color-text-muted)">(+{{ filtered().length - initialCount }})</span>
              }
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class ProjectsSectionComponent {
  readonly categories = PROJECT_CATEGORIES;
  readonly initialCount = INITIAL_COUNT;
  readonly category = signal<ProjectType | 'all'>('all');
  readonly expanded = signal(false);

  readonly filtered = computed(() => {
    const c = this.category();
    return c === 'all' ? PROJECTS_DATA : PROJECTS_DATA.filter(p => p.projectType === c);
  });

  readonly visible = computed(() =>
    this.expanded() ? this.filtered() : this.filtered().slice(0, INITIAL_COUNT),
  );

  readonly command = computed(() =>
    this.category() === 'all' ? 'ls -l ~/projects' : `ls -l ~/projects --category=${this.category()}`,
  );

  countFor(value: ProjectType | 'all'): number {
    return value === 'all' ? PROJECTS_DATA.length : PROJECTS_DATA.filter(p => p.projectType === value).length;
  }

  selectCategory(value: ProjectType | 'all'): void {
    this.category.set(value);
    this.expanded.set(false);
  }
}
