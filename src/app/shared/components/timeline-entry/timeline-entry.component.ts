import { Component, input } from '@angular/core';
import { WorkEntry } from '../../../core/models/portfolio.models';
import { formatEndDate } from '../../../core/utils/experience.utils';

@Component({
  selector: 'app-timeline-entry',
  standalone: true,
  template: `
    <div class="relative pl-8 border-l-2 border-(--color-border) pb-8 last:pb-0">
      <!-- Dot marker -->
      <div
        class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-(--color-primary) border-2 border-(--color-bg)"
        aria-hidden="true"
      ></div>

      <!-- Company name -->
      <h3 class="text-lg font-semibold text-(--color-text)">
        {{ entry().company }}
      </h3>

      <!-- Job title -->
      <h4 class="text-base font-medium text-(--color-primary) mt-0.5">
        {{ entry().jobTitle }}
      </h4>

      <!-- Date range -->
      <p class="text-sm text-(--color-text-muted) mt-1">
        {{ entry().startDate }} – {{ formatEndDate(entry().endDate) }}
      </p>

      <!-- Responsibilities -->
      <ul class="mt-3 space-y-1 list-disc list-inside text-(--color-text)">
        @for (resp of entry().responsibilities; track resp) {
          <li class="text-sm leading-relaxed">{{ resp }}</li>
        }
      </ul>
    </div>
  `,
})
export class TimelineEntryComponent {
  entry = input.required<WorkEntry>();

  formatEndDate = formatEndDate;
}
