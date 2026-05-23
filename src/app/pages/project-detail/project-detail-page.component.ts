import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import type { Project } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (project) {
      <main role="main" class="min-h-screen bg-(--color-bg) py-16 px-4">
        <div class="max-w-4xl mx-auto">

          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-(--color-primary) hover:underline mb-8 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) rounded"
          >
            ← Back to Portfolio
          </a>

          <div class="mb-8">
            <span class="inline-block rounded-full bg-(--color-primary) text-white text-xs font-semibold px-4 py-1 mb-4">
              {{ project.role }}
            </span>
            <h1 class="text-4xl font-extrabold text-(--color-text) mb-4">{{ project.name }}</h1>
            <p class="text-lg text-(--color-text-muted) leading-relaxed">{{ project.description }}</p>
          </div>

          <div
            class="rounded-xl border border-(--color-border) bg-(--color-surface) h-56 flex flex-col items-center justify-center mb-10 gap-2"
            aria-label="Project screenshot placeholder"
          >
            <svg class="w-10 h-10 opacity-25 text-(--color-text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-(--color-text-muted)">UI screenshots coming soon</p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 class="text-xl font-bold text-(--color-text) mb-3">Architecture</h2>
              <p class="text-(--color-text-muted) leading-relaxed text-sm">{{ project.architecture }}</p>
            </div>
            <div>
              <h2 class="text-xl font-bold text-(--color-text) mb-3">Technologies</h2>
              <ul role="list" class="flex flex-wrap gap-2">
                @for (tech of project.technologies; track tech) {
                  <li>
                    <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">
                      {{ tech }}
                    </span>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div class="mb-10">
            <h2 class="text-xl font-bold text-(--color-text) mb-4">Key Features</h2>
            <ul class="space-y-2">
              @for (feature of project.features; track feature) {
                <li class="flex items-start gap-3 text-(--color-text) text-sm leading-relaxed">
                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--color-primary) shrink-0" aria-hidden="true"></span>
                  {{ feature }}
                </li>
              }
            </ul>
          </div>

          <div class="flex flex-wrap gap-4">
            @if (project.repoUrl) {
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-3 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
              >
                View Source Code →
              </a>
            }
            @if (project.demoUrl) {
              <a
                [href]="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
              >
                Live Demo →
              </a>
            }
          </div>

        </div>
      </main>
    } @else {
      <main role="main" class="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-(--color-text) mb-4">Project not found</h1>
          <a routerLink="/" class="text-(--color-primary) hover:underline">← Back to Portfolio</a>
        </div>
      </main>
    }
  `,
})
export class ProjectDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  project: Project | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.project = PROJECTS_DATA.find(p => p.slug === slug) ?? null;
  }
}
