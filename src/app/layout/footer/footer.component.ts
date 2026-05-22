import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer role="contentinfo" class="border-t border-(--color-border) bg-(--color-surface) py-8">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-(--color-text-muted)">
          &copy; {{ currentYear }} Alex Rivera. All rights reserved.
        </p>
        <a
          href="#hero"
          class="text-sm text-(--color-primary) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) rounded"
          aria-label="Back to top"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
