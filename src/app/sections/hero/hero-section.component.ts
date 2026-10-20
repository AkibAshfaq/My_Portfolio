import { Component, inject } from '@angular/core';
import { UiStateService } from '../../core/services/ui-state.service';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScrollService } from '../../core/services/scroll.service';
import { GitHubService } from '../../core/services/github.service';
import { ABOUT_DATA, HERO_DATA } from '../../core/models/portfolio.data';
import { TerminalComponent } from '../../shared/components/terminal/terminal.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TerminalComponent, RouterLink],
  template: `
    <section id="hero" aria-labelledby="hero-title" class="border-b border-(--color-border) pt-14">
      <div class="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-14 lg:py-24 xl:gap-20 2xl:py-32">

        <!-- Recruiter summary -->
        <div>
          <p class="mb-6 font-mono text-sm text-(--color-text-muted)">~/akib-ashfaq/README.md</p>

          <p class="mb-5 inline-flex items-center gap-2.5 rounded border border-(--color-border) bg-(--color-surface) px-3 py-1.5 font-mono text-xs text-(--color-text)">
            <span class="status-dot" aria-hidden="true"></span>
            {{ hero.title }} &#64; {{ hero.company }}
          </p>

          <h1 id="hero-title" class="text-4xl font-semibold text-(--color-text) sm:text-5xl lg:text-6xl 2xl:text-7xl">
            {{ hero.name }}<span class="cursor-blink ml-2" aria-hidden="true"></span>
          </h1>
          <p class="mt-4 font-mono text-lg text-(--color-primary) sm:text-xl">{{ hero.title }} — .NET &amp; Backend</p>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-(--color-text-muted)">
            {{ hero.tagline }}
            @if (!bioOpen()) {
              <button type="button" class="see-more" (click)="bioOpen.set(true)" aria-expanded="false" aria-controls="hero-bio">see more…</button>
            }
          </p>
          @if (bioOpen()) {
            <div id="hero-bio" class="mt-4 max-w-2xl space-y-3 text-[0.9375rem] leading-relaxed text-(--color-text)">
              @for (para of bio; track $index) {
                <p>
                  {{ para }}
                  @if ($last) {
                    <button type="button" class="see-more" (click)="bioOpen.set(false)" aria-expanded="true" aria-controls="hero-bio">see less</button>
                  }
                </p>
              }
            </div>
          }

          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/cv" class="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/></svg>
              View CV
            </a>
            <button type="button" class="btn" (click)="scroll.scrollTo('projects')">View projects</button>
            <button type="button" class="btn" (click)="scroll.scrollTo('contact')">Contact</button>
          </div>

          <dl class="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-(--color-border) pt-6 sm:grid-cols-4">
            @for (fact of facts(); track fact.label) {
              <div>
                <dt class="label">{{ fact.label }}</dt>
                <dd class="mt-1 font-mono text-sm text-(--color-text)">{{ fact.value }}</dd>
              </div>
            }
          </dl>
        </div>

        <!-- Interactive shell -->
        <div class="term-window flex h-[26rem] flex-col shadow-xl shadow-black/10 sm:h-[30rem] 2xl:h-[34rem]">
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
  readonly bio = ABOUT_DATA.biography.split('\n\n');
  readonly bioOpen = inject(UiStateService).bioOpen;
  private readonly gh = toSignal(inject(GitHubService).stats$);

  readonly facts = () => [
    { label: 'Company', value: HERO_DATA.company },
    { label: 'Stack', value: '.NET · C#' },
    { label: 'Location', value: 'Dhaka, BD' },
    { label: 'GitHub', value: `${this.gh()?.publicRepos ?? '—'} repos` },
  ];
}
