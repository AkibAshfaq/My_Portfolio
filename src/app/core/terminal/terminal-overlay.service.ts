import { Injectable, signal } from '@angular/core';

/** Open/closed state of the global pop-up terminal. */
@Injectable({ providedIn: 'root' })
export class TerminalOverlayService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }
}
