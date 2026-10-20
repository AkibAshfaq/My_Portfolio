import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../core/terminal/shell';
import { TerminalOverlayService } from '../../core/terminal/terminal-overlay.service';

/** Status-bar style footer. */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-(--color-border) bg-(--color-surface-2)">
      <div class="container-page flex flex-col gap-3 py-4 font-mono text-xs text-(--color-text-muted) sm:flex-row sm:items-center sm:justify-between">
        <p class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span class="inline-flex items-center gap-2"><span class="status-dot" aria-hidden="true"></span> online</span>
          <span>&copy; {{ currentYear }} Akib Ashfaq</span>
          <span>Angular · SSR · Tailwind</span>
        </p>
        <nav aria-label="Footer" class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a [href]="github" target="_blank" rel="noopener noreferrer" class="hover:text-(--color-primary)">github</a>
          <a [href]="linkedin" target="_blank" rel="noopener noreferrer" class="hover:text-(--color-primary)">linkedin</a>
          <a [href]="'mailto:' + email" class="hover:text-(--color-primary)">email</a>
          <a routerLink="/games" class="hover:text-(--color-primary)">games</a>
          <button type="button" (click)="overlay.open()" class="hover:text-(--color-primary)">&gt;_ terminal</button>
          <a href="#main" class="hover:text-(--color-primary)">top ↑</a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly overlay = inject(TerminalOverlayService);
  readonly currentYear = new Date().getFullYear();
  readonly email = EMAIL;
  readonly github = GITHUB_URL;
  readonly linkedin = LINKEDIN_URL;
}
