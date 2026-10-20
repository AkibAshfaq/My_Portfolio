import { Component, inject, input } from '@angular/core';
import { NavigationHistoryService } from '../../../core/services/navigation-history.service';

/**
 * "cd .." button. Behaves like the browser back button so the previous page is
 * restored where it was left; the href keeps it a real link for new tabs and
 * for visitors who arrived directly.
 */
@Component({
  selector: 'app-back-link',
  standalone: true,
  template: `
    <a [href]="fallback()" class="btn btn-sm" (click)="onClick($event)" aria-label="Go back">
      <span class="text-(--color-text-muted)">$</span> {{ label() }}
    </a>
  `,
})
export class BackLinkComponent {
  private readonly history = inject(NavigationHistoryService);

  readonly fallback = input('/');
  readonly label = input('cd ..');

  onClick(event: MouseEvent): void {
    // Let modified clicks open the fallback in a new tab/window as usual.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.history.back(this.fallback());
  }
}
