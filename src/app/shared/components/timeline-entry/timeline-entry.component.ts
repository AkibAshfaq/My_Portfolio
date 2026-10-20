import { Component, input } from '@angular/core';
import { WorkEntry } from '../../../core/models/portfolio.models';
import { formatEndDate } from '../../../core/utils/experience.utils';

/** One journey entry, laid out like a `git log --graph` commit. */
@Component({
  selector: 'app-timeline-entry',
  standalone: true,
  template: `
    <article class="relative border-l border-(--color-border) pb-10 pl-7">
      <span
        class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-(--color-bg)"
        [class]="entry().endDate === null ? 'bg-(--color-primary)' : 'bg-(--color-text-muted)'"
        aria-hidden="true"
      ></span>

      <p class="font-mono text-xs text-(--color-warn)">
        {{ entry().startDate }} → {{ formatEndDate(entry().endDate) }}
        @if (entry().endDate === null) {
          <span class="ml-2 rounded border border-(--color-primary)/40 px-1.5 py-px text-(--color-primary)">HEAD</span>
        }
      </p>
      <h3 class="mt-1.5 text-lg font-semibold text-(--color-text)">{{ entry().jobTitle }}</h3>
      <p class="font-mono text-sm text-(--color-info)">{{ entry().company }}</p>

      <ul class="mt-3 space-y-1.5 text-[0.9375rem] leading-relaxed text-(--color-text-muted)">
        @for (resp of entry().responsibilities; track resp) {
          <li class="flex gap-3"><span class="font-mono text-(--color-text-muted)/60" aria-hidden="true">-</span><span>{{ resp }}</span></li>
        }
      </ul>
    </article>
  `,
})
export class TimelineEntryComponent {
  entry = input.required<WorkEntry>();

  formatEndDate = formatEndDate;
}
