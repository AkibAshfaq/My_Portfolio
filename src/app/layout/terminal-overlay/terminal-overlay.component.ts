import { Component, HostListener, PLATFORM_ID, effect, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TerminalOverlayService } from '../../core/terminal/terminal-overlay.service';
import { TerminalComponent } from '../../shared/components/terminal/terminal.component';

/** Pop-up terminal available on every page. Toggle with the ` key or the nav button. */
@Component({
  selector: 'app-terminal-overlay',
  standalone: true,
  imports: [TerminalComponent],
  template: `
    @if (overlay.isOpen()) {
      <div class="fixed inset-0 z-[60] bg-black/40" (click)="overlay.close()" aria-hidden="true"></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        class="term-window fixed inset-x-2 bottom-2 z-[61] flex h-[min(70vh,34rem)] flex-col shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[44rem]"
      >
        <div class="term-titlebar justify-between">
          <span class="flex items-center gap-3">
            <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
            akib&#64;portfolio — zsh
          </span>
          <button type="button" class="btn btn-sm min-h-7 px-2" (click)="overlay.close()" aria-label="Close terminal">
            esc ✕
          </button>
        </div>
        <app-terminal
          class="min-h-0 flex-1"
          label="Pop-up terminal"
          [autofocus]="true"
          [bootCommands]="['help']"
          (closed)="overlay.close()"
        />
      </div>
    }
  `,
})
export class TerminalOverlayComponent {
  readonly overlay = inject(TerminalOverlayService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private returnFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      if (this.overlay.isOpen()) {
        this.returnFocus = document.activeElement as HTMLElement | null;
      } else {
        this.returnFocus?.focus?.({ preventScroll: true });
        this.returnFocus = null;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target.matches('input, textarea, select, [contenteditable="true"]');
    if (event.key === '`' && !typing) {
      event.preventDefault();
      this.overlay.toggle();
    } else if (event.key === 'Escape' && this.overlay.isOpen()) {
      this.overlay.close();
    }
  }
}
