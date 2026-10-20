import type { Project } from '../models/portfolio.models';

/** True when the project has enough content for its own detail page. */
export const hasDetailPage = (p: Project): boolean => !!p.features?.length;
