import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS_DATA } from './core/models/portfolio.data';
import { hasDetailPage } from './core/utils/project.utils';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      PROJECTS_DATA.filter(hasDetailPage).map(p => ({ slug: p.slug })),
  },
  {
    path: 'games',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
