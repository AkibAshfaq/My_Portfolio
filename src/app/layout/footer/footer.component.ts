import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer role="contentinfo" class="border-t border-(--color-border) bg-(--color-surface) py-8">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 text-sm text-(--color-text-muted)">
          <span>&copy; {{ currentYear }} Akib Ashfaq</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/AkibAshfaq"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-(--color-primary) transition-colors"
          >GitHub</a>
          <span aria-hidden="true">·</span>
          <a
            routerLink="/games"
            class="hover:text-(--color-primary) transition-colors"
          >🎮 Games</a>
        </div>
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
