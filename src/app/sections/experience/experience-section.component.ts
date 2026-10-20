import { Component } from '@angular/core';
import { EXPERIENCE_DATA } from '../../core/models/portfolio.data';
import { sortExperienceEntries } from '../../core/utils/experience.utils';
import { TimelineEntryComponent } from '../../shared/components/timeline-entry/timeline-entry.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [TimelineEntryComponent, SectionHeadingComponent],
  template: `
    <section id="experience" aria-labelledby="experience-title" class="border-b border-(--color-border) py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="experience-title" command="git log --experience" title="Experience" />
        <ol class="max-w-5xl">
          @for (entry of entries; track entry.company) {
            <li><app-timeline-entry [entry]="entry" /></li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class ExperienceSectionComponent {
  entries = sortExperienceEntries(EXPERIENCE_DATA);
}
