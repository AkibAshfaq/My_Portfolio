import { Component, DestroyRef, PLATFORM_ID, afterNextRender, inject, viewChildren } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';
import { TextGameComponent } from '../../shared/components/text-game/text-game.component';
import { GAMES } from '../../core/games/games.registry';

@Component({
  selector: 'app-games-page',
  standalone: true,
  imports: [BackLinkComponent, TextGameComponent],
  template: `
    <main id="main" tabindex="-1" class="min-h-screen pt-14 outline-none">
      <div class="container-page py-12 lg:py-16">
        <app-back-link class="mb-10 inline-block" fallback="/" />

        <p class="mb-2 font-mono text-sm text-(--color-text-muted)" aria-hidden="true">
          <span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~/games</span>$
          <span class="text-(--color-text)">ls</span>
        </p>
        <h1 class="text-3xl font-semibold text-(--color-text) sm:text-4xl">Games</h1>
        <p class="mt-3 max-w-3xl text-(--color-text-muted)">
          Text-mode games that run like terminal programs — every frame is drawn with characters.
          Click a screen (or press Enter) to start; the game only listens to the keyboard while it's focused.
          You can also launch one from the terminal with <code class="text-(--color-primary)">play snake</code>.
        </p>

        <div class="mt-10 grid gap-6 2xl:grid-cols-2">
          @for (game of games; track game.id) {
            <section class="term-window" [id]="game.id" [attr.aria-labelledby]="game.id + '-title'">
              <div class="term-titlebar justify-between">
                <span class="flex items-center gap-3">
                  <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
                  ./{{ game.bin }}
                </span>
                <span class="hidden sm:inline">{{ game.tags }}</span>
              </div>
              <div class="p-4 sm:p-5">
                <h2 [id]="game.id + '-title'" class="text-lg font-semibold text-(--color-text)">{{ game.title }}</h2>
                <p class="mb-4 mt-1 text-[0.9375rem] text-(--color-text-muted)">{{ game.description }}</p>
                <app-text-game
                  [create]="game.create"
                  [name]="game.title"
                  [bin]="game.bin"
                  [hint]="game.hint"
                  [tones]="game.tones"
                  [controls]="game.controls"
                  [storageKey]="game.storageKey"
                />
              </div>
            </section>
          }
        </div>
      </div>
    </main>
  `,
})
export class GamesPageComponent {
  readonly games = GAMES;
  private readonly players = viewChildren(TextGameComponent);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // `play <game>` links here with ?play=<id>#<id>: the router scrolls to the anchor, we focus the game.
    afterNextRender(() => {
      this.route.queryParamMap
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(params => this.focusGame(params.get('play')));
    });
  }

  private focusGame(id: string | null): void {
    if (!this.isBrowser || !id) return;
    const index = GAMES.findIndex(g => g.id === id);
    if (index === -1) return;
    this.players()[index]?.focus();
  }
}
