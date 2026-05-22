import { Component } from '@angular/core';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ProjectCardComponent],
  template: `
    <section id="projects" aria-label="Projects" role="region" class="py-20 bg-(--color-bg)">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-(--color-text) mb-10 text-center">Projects</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of projects; track project.name) {
            <app-project-card [project]="project" />
          }
        </div>
      </div>
    </section>
  `,
})
export class ProjectsSectionComponent {
  projects = PROJECTS_DATA;
}
