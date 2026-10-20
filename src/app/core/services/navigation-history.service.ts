import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Knows whether there is an in-app page to go back to. */
@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private navigations = 0;

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.navigations++);
  }

  /**
   * Goes back through browser history when the visitor came from another page of
   * this site, so the router restores the previous scroll position and the page
   * state. A visitor who landed here directly goes to the fallback URL instead.
   */
  back(fallbackUrl: string): void {
    if (this.navigations > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(fallbackUrl);
    }
  }
}
