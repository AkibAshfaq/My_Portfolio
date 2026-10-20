import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ABOUT_DATA, HERO_DATA } from '../../core/models/portfolio.data';
import { GitHubService } from '../../core/services/github.service';
import { GITHUB_URL } from '../../core/terminal/shell';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [SectionHeadingComponent],
  template: `
    <section id="about" aria-labelledby="about-title" class="border-b border-(--color-border) py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="about-title" command="cat about.md" title="About" />

        <div class="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-14">
          <figure class="term-window self-start">
            <div class="term-titlebar">akib-ashfaq.jpeg</div>
            <img
              [src]="about.photoUrl"
              [alt]="about.photoAlt"
              (error)="onImgError($event)"
              loading="lazy"
              width="272"
              height="272"
              class="aspect-square w-full object-cover"
            />
          </figure>

          <div class="grid gap-10 xl:grid-cols-[1fr_19rem]">
            <div class="space-y-4 text-[1.0625rem] leading-relaxed text-(--color-text)">
              @for (para of paragraphs; track $index) {
                <p>{{ para }}</p>
              }
            </div>

            <div class="term-window self-start">
              <div class="term-titlebar">profile.yml</div>
              <dl class="divide-y divide-(--color-border) font-mono text-sm">
                @for (row of profile(); track row.key) {
                  <div class="flex justify-between gap-4 px-4 py-2.5">
                    <dt class="text-(--color-text-muted)">{{ row.key }}</dt>
                    <dd class="text-right" [class]="row.tone">
                      @if (row.href) {
                        <a [href]="row.href" target="_blank" rel="noopener noreferrer" class="link">{{ row.value }}</a>
                      } @else {
                        {{ row.value }}
                      }
                    </dd>
                  </div>
                }
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  readonly about = ABOUT_DATA;
  readonly paragraphs = ABOUT_DATA.biography.split('\n\n');
  private readonly gh = toSignal(inject(GitHubService).stats$);

  readonly profile = () => [
    { key: 'university', value: 'AIUB', tone: 'text-(--color-text)' },
    { key: 'location', value: HERO_DATA.location, tone: 'text-(--color-text)' },
    { key: 'focus', value: 'Backend · APIs', tone: 'text-(--color-text)' },
    { key: 'status', value: 'open to work', tone: 'text-(--color-primary)' },
    { key: 'github', value: 'AkibAshfaq', href: GITHUB_URL, tone: '' },
    { key: 'public_repos', value: `${this.gh()?.publicRepos ?? '—'}`, tone: 'text-(--color-warn)' },
    { key: 'member_since', value: this.gh()?.memberSince ?? '—', tone: 'text-(--color-text)' },
  ];

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/183318977?v=4';
  }
}
