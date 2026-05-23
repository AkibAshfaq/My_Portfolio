import { Component, input } from '@angular/core';
import { WorkEntry } from '../../../core/models/portfolio.models';
import { formatEndDate } from '../../../core/utils/experience.utils';

@Component({
  selector: 'app-timeline-entry',
  standalone: true,
  template: `
    <div class="relative pl-10 border-l-2 border-(--color-border) pb-32 last:pb-0">

      <!-- Dot marker -->
      <div
        class="absolute left-[-9px] top-5 w-4 h-4 rounded-full bg-(--color-primary) border-2 border-(--color-bg)"
        aria-hidden="true"
      ></div>

      <!-- Card -->
      <div class="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm">

        <!-- Header row -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-4">
          <div>
            <h3 class="text-lg font-bold text-(--color-text)">{{ entry().company }}</h3>
            <h4 class="text-base font-medium text-(--color-primary) mt-0.5">{{ entry().jobTitle }}</h4>
          </div>
          <span class="shrink-0 text-xs font-medium text-(--color-text-muted) bg-(--color-bg) border border-(--color-border) rounded-full px-3 py-1 self-start mt-1 sm:mt-0">
            {{ entry().startDate }} – {{ formatEndDate(entry().endDate) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-(--color-border) mb-4"></div>

        <!-- Responsibilities -->
        <ul class="space-y-2.5 list-disc list-inside text-(--color-text)">
          @for (resp of entry().responsibilities; track resp) {
            <li class="text-sm leading-relaxed">{{ resp }}</li>
          }
        </ul>

      </div>
    </div>
  `,
})
export class TimelineEntryComponent {
  entry = input.required<WorkEntry>();

  formatEndDate = formatEndDate;
}
