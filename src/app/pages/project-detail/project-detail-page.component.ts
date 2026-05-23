import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import type { Project } from '../../core/models/portfolio.models';

const TYPE_META: Record<
  string,
  { label: string; icon: string; runNote: string; runHow: string }
> = {
  web:         { label: 'Web App',               icon: '🌐', runNote: '', runHow: '' },
  mobile:      { label: 'Android App',           icon: '📱', runNote: 'This is an Android application and cannot run in the browser.', runHow: 'Clone the repo and open it in Android Studio to build and run on an emulator or device.' },
  desktop:     { label: 'Desktop App',           icon: '🖥️', runNote: 'This is a Windows desktop application and cannot run in the browser.', runHow: 'Clone the repo and open it in Visual Studio to build and run on Windows.' },
  backend:     { label: 'Backend / Server',      icon: '⚙️', runNote: 'This is a server-side application — there is no visual browser interface.', runHow: 'Clone the repo and follow the README for build and run instructions.' },
  competitive: { label: 'Competitive Programming', icon: '🏆', runNote: 'These are standalone C++ solutions — not a runnable app.', runHow: 'Each file is a self-contained Codeforces solution. Compile any file with a C++ compiler to run it.' },
};

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (project) {
      <main role="main" class="min-h-screen bg-(--color-bg) py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">

          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-(--color-primary) hover:underline mb-8 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) rounded"
          >
            ← Back to Portfolio
          </a>

          <div class="mb-8">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="inline-block rounded-full bg-(--color-primary) text-white text-xs font-semibold px-4 py-1">
                {{ project.role }}
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface) text-xs font-medium px-3 py-1 text-(--color-text-muted)">
                <span aria-hidden="true">{{ meta.icon }}</span> {{ meta.label }}
              </span>
            </div>
            <h1 class="text-4xl font-extrabold text-(--color-text) mb-4">{{ project.name }}</h1>
            <p class="text-lg text-(--color-text-muted) leading-relaxed">{{ project.description }}</p>
          </div>

          @if (project.projectType === 'web' && project.demoUrl) {
            <div class="mb-10">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-xl font-bold text-(--color-text)">Live Demo</h2>
                <a
                  [href]="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-(--color-primary) hover:underline"
                >Open in new tab ↗</a>
              </div>
              <div class="rounded-xl border border-(--color-border) overflow-hidden shadow-sm" style="height: 480px">
                <iframe
                  [src]="safeDemoUrl"
                  [title]="project.name + ' live demo'"
                  class="w-full h-full"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                ></iframe>
              </div>
            </div>
          } @else if (project.projectType !== 'web' || !project.demoUrl) {
            <div class="mb-10 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
              <div class="flex items-start gap-4">
                <span class="text-3xl mt-0.5" aria-hidden="true">{{ meta.icon }}</span>
                <div>
                  <h2 class="text-base font-bold text-(--color-text) mb-1">{{ meta.label }}</h2>
                  @if (meta.runNote) {
                    <p class="text-sm text-(--color-text-muted) mb-2">{{ meta.runNote }}</p>
                    <p class="text-sm text-(--color-text)">{{ meta.runHow }}</p>
                  } @else {
                    <p class="text-sm text-(--color-text-muted)">No live demo is hosted for this project yet.</p>
                  }
                  @if (project.repoUrl) {
                    <a
                      [href]="project.repoUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center mt-4 text-sm text-(--color-primary) font-semibold hover:underline"
                    >View source on GitHub →</a>
                  }
                </div>
              </div>
            </div>
          }

          <div class="grid md:grid-cols-2 gap-8 lg:gap-12 mb-10">
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
  private sanitizer = inject(DomSanitizer);

  project: Project | null = null;
  meta = TYPE_META['web'];
  safeDemoUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.project = PROJECTS_DATA.find(p => p.slug === slug) ?? null;
    if (this.project) {
      this.meta = TYPE_META[this.project.projectType] ?? TYPE_META['web'];
      if (this.project.demoUrl) {
        this.safeDemoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.demoUrl);
      }
    }
  }
}
