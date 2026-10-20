import { Injectable, signal } from '@angular/core';
import type { ProjectType } from '../models/portfolio.models';

/**
 * Home-page UI state that must survive navigating to a sub-page and back,
 * so the page height (and therefore the restored scroll position) matches.
 */
@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly bioOpen = signal(false);
  readonly projectCategory = signal<ProjectType | 'all'>('all');
  readonly projectsExpanded = signal(false);
}
