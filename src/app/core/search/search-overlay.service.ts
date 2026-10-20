import { Injectable, signal } from '@angular/core';

/** Open/closed state of the site-wide search panel. */
@Injectable({ providedIn: 'root' })
export class SearchOverlayService {
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
