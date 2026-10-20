import type { Project } from '../models/portfolio.models';

/** True when the project has enough content for its own detail page. */
export const hasDetailPage = (p: Project): boolean => !!p.features?.length;

/** URL that opens a game on /games: the fragment lets the router scroll to it, `play` focuses it. */
export const playUrl = (gameId: string): string => `/games?play=${gameId}#${gameId}`;
