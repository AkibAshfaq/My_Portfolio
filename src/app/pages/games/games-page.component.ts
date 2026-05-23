import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnakeGameComponent } from './snake-game/snake-game.component';
import { MarioGameComponent } from './mario-game/mario-game.component';

@Component({
  selector: 'app-games-page',
  standalone: true,
  imports: [RouterLink, SnakeGameComponent, MarioGameComponent],
  template: `
    <main role="main" class="min-h-screen bg-(--color-bg) py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">

        <a
          routerLink="/"
          class="inline-flex items-center gap-2 text-(--color-primary) hover:underline mb-10 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) rounded"
        >
          ← Back to Portfolio
        </a>

        <div class="text-center mb-10">
          <h1 class="text-4xl font-extrabold text-(--color-text) mb-3">Games</h1>
          <p class="text-(--color-text-muted) text-sm">
            Mini projects built for fun — part of my extra-curricular coding experiments.
          </p>
        </div>

        <div class="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm">
          <div class="flex items-start gap-4 mb-6">
            <div class="text-3xl mt-0.5" aria-hidden="true">🐍</div>
            <div>
              <h2 class="text-xl font-bold text-(--color-text)">Snake</h2>
              <p class="text-sm text-(--color-text-muted) mt-1">
                Classic snake game — built from scratch with HTML Canvas &amp; TypeScript.
                Keyboard + mobile swipe controls.
              </p>
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">TypeScript</span>
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">HTML Canvas</span>
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Angular</span>
              </div>
            </div>
          </div>

          <app-snake-game />
        </div>

        <!-- Mario Run -->
        <div class="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm mt-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="text-3xl mt-0.5" aria-hidden="true">🍄</div>
            <div>
              <h2 class="text-xl font-bold text-(--color-text)">Mario Run</h2>
              <p class="text-sm text-(--color-text-muted) mt-1">
                Side-scrolling platformer — run, jump, stomp enemies and collect coins.
                Built from scratch with HTML Canvas &amp; TypeScript.
              </p>
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">TypeScript</span>
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">HTML Canvas</span>
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Angular</span>
                <span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Game Physics</span>
              </div>
            </div>
          </div>
          <app-mario-game />
        </div>

        <p class="text-center text-xs text-(--color-text-muted) mt-8">
          More games coming soon — this space grows as I experiment more.
        </p>

      </div>
    </main>
  `,
})
export class GamesPageComponent {}
