import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScrollService } from '../../core/services/scroll.service';
import { GitHubService } from '../../core/services/github.service';
import { HERO_DATA, PROJECTS_DATA } from '../../core/models/portfolio.data';
import { TerminalComponent } from '../../shared/components/terminal/terminal.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TerminalComponent],
  template: `
    <section id="hero" aria-labelledby="hero-title" class="border-b border-(--color-border) pt-14">
      <div class="container-page grid items-center gap-10 py-14 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-14 lg:py-24">

        <!-- Recruiter summary -->
        <div>
          <p class="mb-6 font-mono text-sm text-(--color-text-muted)">~/akib-ashfaq/README.md</p>

          @if (hero.openToWork) {
            <p class="mb-5 inline-flex items-center gap-2.5 rounded border border-(--color-border) bg-(--color-surface) px-3 py-1.5 font-mono text-xs text-(--color-text)">
              <span class="status-dot" aria-hidden="true"></span>
              Open to internships &amp; entry-level roles
            </p>
          }

          <h1 id="hero-title" class="text-4xl font-semibold text-(--color-text) sm:text-5xl lg:text-6xl">
            {{ hero.name }}<span class="cursor-blink ml-2" aria-hidden="true"></span>
          </h1>
          <p class="mt-4 font-mono text-lg text-(--color-primary) sm:text-xl">{{ hero.title }} — Backend &amp; Full-Stack</p>
          <p class="mt-4 max-w-xl text-lg leading-relaxed text-(--color-text-muted)">{{ hero.tagline }}</p>

          <div class="mt-8 flex flex-wrap gap-3">
            @if (hero.resumeUrl) {
              <a [href]="hero.resumeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>
                Download CV
              </a>
            }
            <button type="button" class="btn" (click)="scroll.scrollTo('projects')">View projects</button>
            <button type="button" class="btn" (click)="scroll.scrollTo('contact')">Contact</button>
          </div>

          <dl class="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-(--color-border) pt-6 sm:grid-cols-4">
            @for (fact of facts(); track fact.label) {
              <div>
                <dt class="label">{{ fact.label }}</dt>
                <dd class="mt-1 font-mono text-sm text-(--color-text)">{{ fact.value }}</dd>
              </div>
            }
          </dl>
        </div>

        <!-- Interactive shell -->
        <div class="term-window flex h-[26rem] flex-col shadow-xl shadow-black/10 sm:h-[30rem]">
          <div class="term-titlebar justify-between">
            <span class="flex items-center gap-3">
              <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
              akib&#64;portfolio — interactive résumé
            </span>
            <span class="hidden sm:inline">try: help</span>
          </div>
          <app-terminal class="min-h-0 flex-1" label="Interactive résumé terminal" [bootCommands]="['whoami']" />
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  readonly scroll = inject(ScrollService);
  readonly hero = HERO_DATA;
  private readonly gh = toSignal(inject(GitHubService).stats$);

  readonly facts = () => [
    { label: 'Location', value: 'Dhaka, BD' },
    { label: 'Education', value: 'AIUB' },
    { label: 'Projects', value: `${PROJECTS_DATA.length}+ built` },
    { label: 'GitHub', value: `${this.gh()?.publicRepos ?? '—'} repos` },
  ];
}
