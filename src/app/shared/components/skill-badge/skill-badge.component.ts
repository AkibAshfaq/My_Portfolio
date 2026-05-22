import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skill-badge',
  standalone: true,
  template: `
    <span
      role="listitem"
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-(--color-surface) text-(--color-text) border border-(--color-border) hover:bg-(--color-primary) hover:text-white transition-colors cursor-default"
    >{{ label() }}</span>
  `,
})
export class SkillBadgeComponent {
  label = input.required<string>();
}
