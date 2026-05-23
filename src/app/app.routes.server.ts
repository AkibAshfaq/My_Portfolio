import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS_DATA } from './core/models/portfolio.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      PROJECTS_DATA.map(p => ({ slug: p.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
