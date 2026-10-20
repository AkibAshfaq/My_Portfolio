import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectType } from '../../../core/models/portfolio.models';
import { hasDetailPage } from '../../../core/utils/project.utils';

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  web: 'web',
  backend: 'backend',
  mobile: 'android',
  desktop: 'desktop',
  game: 'game',
  iot: 'iot',
  competitive: 'cp',
};

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="term-window flex h-full flex-col transition-colors hover:border-(--color-primary)/60">
      <div class="term-titlebar justify-between">
        <span class="truncate">~/projects/{{ project().slug }}</span>
        <span class="shrink-0 rounded border border-(--color-border) px-1.5 text-[0.6875rem]">{{ typeLabel() }}</span>
      </div>

      <div class="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 class="text-lg font-semibold text-(--color-text)">
            @if (hasDetail()) {
              <a [routerLink]="['/projects', project().slug]" class="hover:text-(--color-primary)">{{ project().name }}</a>
            } @else {
              {{ project().name }}
            }
          </h3>
          <p class="mt-0.5 font-mono text-xs text-(--color-info)">{{ project().role }}</p>
        </div>

        <p class="flex-1 text-[0.9375rem] leading-relaxed text-(--color-text-muted)">{{ project().description }}</p>

        <ul class="flex flex-wrap gap-1.5" aria-label="Technologies">
          @for (tech of project().technologies; track tech) {
            <li class="chip">{{ tech }}</li>
          }
        </ul>

        <div class="flex flex-wrap gap-2 border-t border-(--color-border) pt-4">
          @if (hasDetail()) {
            <a [routerLink]="['/projects', project().slug]" class="btn btn-sm btn-primary"
               [attr.aria-label]="'Details for ' + project().name">details</a>
          }
          @if (project().playRoute) {
            <a [routerLink]="project().playRoute" class="btn btn-sm btn-primary"
               [attr.aria-label]="'Play ' + project().name">play</a>
          }
          @if (project().profileUrl) {
            <a [href]="project().profileUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary"
               [attr.aria-label]="project().name + ' profile'">profile ↗</a>
          }
          @if (project().demoUrl) {
            <a [href]="project().demoUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm"
               [attr.aria-label]="'Live demo of ' + project().name">demo ↗</a>
          }
          @if (project().repoUrl) {
            <a [href]="project().repoUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm"
               [attr.aria-label]="'Source code of ' + project().name">source ↗</a>
          }
        </div>
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  project = input.required<Project>();

  typeLabel = () => PROJECT_TYPE_LABEL[this.project().projectType];
  hasDetail = () => hasDetailPage(this.project());
}
