import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SectionId } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);

  scrollTo(sectionId: SectionId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
