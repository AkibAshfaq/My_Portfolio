import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROJECTS_DATA } from '../../core/models/portfolio.data';
import type { Project } from '../../core/models/portfolio.models';
import { PROJECT_TYPE_LABEL } from '../../shared/components/project-card/project-card.component';

const RUN_STEPS: Record<Project['projectType'], { note: string; steps: string[] }> = {
  web: {
    note: 'Web application — follow the README for environment setup.',
    steps: ['# see README.md for install & run'],
  },
  mobile: {
    note: 'Android application — it cannot run in the browser.',
    steps: ['# open the folder in Android Studio', '# then Run ▶ on an emulator or device'],
  },
  desktop: {
    note: 'Windows desktop application — it cannot run in the browser.',
    steps: ['# open the .sln in Visual Studio', '# then Start (F5) on Windows'],
  },
  backend: {
    note: 'Server-side application — no visual browser interface.',
    steps: ['# see README.md for build & run'],
  },
  competitive: {
    note: 'Standalone C++ solutions — each file compiles on its own.',
    steps: ['g++ -O2 -o solution solution.cpp && ./solution'],
  },
};

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main id="main" tabindex="-1" class="min-h-screen pt-14 outline-none">
      <div class="container-page max-w-5xl py-12 lg:py-16">
        <a routerLink="/" fragment="projects" class="btn btn-sm mb-10">
          <span class="text-(--color-text-muted)">$</span> cd ..
        </a>

        @if (project; as p) {
          <p class="mb-2 font-mono text-sm text-(--color-text-muted)" aria-hidden="true">
            <span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~/projects/{{ p.slug }}</span>$
            <span class="text-(--color-text)">cat README.md</span>
          </p>
          <h1 class="text-3xl font-semibold text-(--color-text) sm:text-4xl">{{ p.name }}</h1>
          <p class="mt-3 flex flex-wrap items-center gap-2 font-mono text-sm">
            <span class="text-(--color-info)">{{ p.role }}</span>
            <span class="chip">{{ typeLabel }}</span>
          </p>
          <p class="mt-5 max-w-3xl text-lg leading-relaxed text-(--color-text-muted)">{{ p.description }}</p>

          <div class="mt-6 flex flex-wrap gap-2">
            @if (p.repoUrl) {
              <a [href]="p.repoUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">source on github ↗</a>
            }
            @if (p.demoUrl) {
              <a [href]="p.demoUrl" target="_blank" rel="noopener noreferrer" class="btn">live demo ↗</a>
            }
          </div>

          @if (p.projectType === 'web' && safeDemoUrl) {
            <div class="term-window mt-10">
              <div class="term-titlebar justify-between">
                <span class="flex items-center gap-3">
                  <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
                  {{ p.demoUrl }}
                </span>
              </div>
              <iframe [src]="safeDemoUrl" [title]="p.name + ' live demo'" class="h-[28rem] w-full bg-white"
                      loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
            </div>
          }

          <div class="mt-12 grid gap-10 md:grid-cols-2">
            <section aria-labelledby="arch-title">
              <h2 id="arch-title" class="mb-3 text-lg font-semibold text-(--color-text)"><span class="text-(--color-text-muted)">## </span>Architecture</h2>
              <p class="leading-relaxed text-(--color-text-muted)">{{ p.architecture }}</p>
            </section>
            <section aria-labelledby="tech-title">
              <h2 id="tech-title" class="mb-3 text-lg font-semibold text-(--color-text)"><span class="text-(--color-text-muted)">## </span>Technologies</h2>
              <ul class="flex flex-wrap gap-1.5">
                @for (tech of p.technologies; track tech) {
                  <li class="chip">{{ tech }}</li>
                }
              </ul>
            </section>
          </div>

          <section class="mt-12" aria-labelledby="feat-title">
            <h2 id="feat-title" class="mb-4 text-lg font-semibold text-(--color-text)"><span class="text-(--color-text-muted)">## </span>Key features</h2>
            <ul class="space-y-2 text-[0.9375rem] leading-relaxed text-(--color-text)">
              @for (feature of p.features; track feature) {
                <li class="flex gap-3"><span class="font-mono text-(--color-primary)" aria-hidden="true">✓</span><span>{{ feature }}</span></li>
              }
            </ul>
          </section>

          @if (p.repoUrl) {
            <section class="mt-12" aria-labelledby="run-title">
              <h2 id="run-title" class="mb-2 text-lg font-semibold text-(--color-text)"><span class="text-(--color-text-muted)">## </span>Run it locally</h2>
              <p class="mb-4 text-(--color-text-muted)">{{ run.note }}</p>
              <div class="term-window">
                <div class="term-titlebar justify-between">
                  <span>bash</span>
                  <button type="button" class="btn btn-sm min-h-7 px-2" (click)="copySetup()"
                          [attr.aria-label]="copied() ? 'Commands copied' : 'Copy setup commands'">
                    {{ copied() ? 'copied ✓' : 'copy' }}
                  </button>
                </div>
                <pre class="overflow-x-auto p-4 text-[0.8125rem] leading-6"><code>@for (line of setupLines; track $index) {<span [class]="line.startsWith('#') ? 'text-(--color-text-muted)' : 'text-(--color-text)'">@if (!line.startsWith('#')) {<span class="text-(--color-primary) select-none">$ </span>}{{ line }}</span>
}</code></pre>
              </div>
            </section>
          }
        } @else {
          <h1 class="font-mono text-xl text-(--color-error)">cat: README.md: No such project</h1>
          <p class="mt-3 text-(--color-text-muted)">The project you're looking for doesn't exist. Head back to the project list.</p>
        }
      </div>
    </main>
  `,
})
export class ProjectDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  project: Project | null = null;
  typeLabel = '';
  run = RUN_STEPS.web;
  setupLines: string[] = [];
  safeDemoUrl: SafeResourceUrl | null = null;
  readonly copied = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.project = PROJECTS_DATA.find(p => p.slug === slug) ?? null;
    if (!this.project) return;

    this.typeLabel = PROJECT_TYPE_LABEL[this.project.projectType];
    this.run = RUN_STEPS[this.project.projectType];
    if (this.project.repoUrl) {
      const dir = this.project.repoUrl.split('/').pop()!;
      this.setupLines = [`git clone ${this.project.repoUrl}.git`, `cd ${dir}`, ...this.run.steps];
    }
    if (this.project.demoUrl) {
      this.safeDemoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.demoUrl);
    }
  }

  async copySetup(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      await navigator.clipboard.writeText(this.setupLines.filter(l => !l.startsWith('#')).join('\n'));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // clipboard blocked — the commands remain selectable on the page
    }
  }
}
