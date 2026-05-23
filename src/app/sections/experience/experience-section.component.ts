import { Component } from '@angular/core';
import { EXPERIENCE_DATA } from '../../core/models/portfolio.data';
import { sortExperienceEntries } from '../../core/utils/experience.utils';
import { TimelineEntryComponent } from '../../shared/components/timeline-entry/timeline-entry.component';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [TimelineEntryComponent],
  template: `
    <section
      id="experience"
      aria-label="My Journey"
      role="region"
      class="py-20 bg-(--color-surface)"
    >
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-(--color-text) mb-2 text-center">My Journey</h2>
        <p class="text-center text-(--color-text-muted) mb-10 text-sm">Projects & milestones that shaped my skills</p>
        <div>
          @for (entry of entries; track entry.company) {
            <app-timeline-entry [entry]="entry" />
          }
        </div>
      </div>
    </section>
  `,
})
export class ExperienceSectionComponent {
  entries = sortExperienceEntries(EXPERIENCE_DATA);
}
