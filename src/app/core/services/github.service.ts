import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay, catchError, of } from 'rxjs';
import type { GitHubStats } from '../models/portfolio.models';

// ── Raw API shapes ────────────────────────────────────────────────────────────

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

// ── Fallback values (shown while loading or if the API is unavailable) ────────

const FALLBACK: GitHubStats = {
  publicRepos: 22,
  languageCount: 7,
  languages: ['TypeScript', 'C#', 'Kotlin', 'PHP', 'JavaScript', 'C++', 'HTML'],
  followers: 4,
  memberSince: 'Sep 2024',
  avatarUrl: 'https://avatars.githubusercontent.com/u/183318977?v=4',
  totalStars: 4,
};

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly http = inject(HttpClient);
  private readonly username = 'AkibAshfaq';
  private readonly api = 'https://api.github.com';

  /**
   * Emits exactly once with the computed GitHub stats.
   * Cached with shareReplay so multiple subscribers (hero + about)
   * only trigger one pair of HTTP calls.
   * Falls back to FALLBACK values if the API is unreachable.
   */
  readonly stats$: Observable<GitHubStats> = forkJoin({
    user: this.http.get<GitHubUser>(`${this.api}/users/${this.username}`),
    repos: this.http.get<GitHubRepo[]>(
      `${this.api}/users/${this.username}/repos?per_page=100&sort=updated`,
    ),
  }).pipe(
    map(({ user, repos }) => {
      // Count only non-fork repos when deriving language list
      const ownRepos = repos.filter(r => !r.fork);
      const languages = [
        ...new Set(
          ownRepos
            .map(r => r.language)
            .filter((l): l is string => l !== null),
        ),
      ];
      const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      return {
        publicRepos: user.public_repos,
        languageCount: languages.length,
        languages,
        followers: user.followers,
        memberSince,
        avatarUrl: user.avatar_url,
        totalStars,
      } satisfies GitHubStats;
    }),
    catchError(() => of(FALLBACK)),
    shareReplay(1),
  );
}
