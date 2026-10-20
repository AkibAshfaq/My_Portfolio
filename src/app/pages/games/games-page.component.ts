import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnakeGameComponent } from './snake-game/snake-game.component';
import { MarioGameComponent } from './mario-game/mario-game.component';
import { CarGameComponent } from './car-game/car-game.component';

@Component({
  selector: 'app-games-page',
  standalone: true,
  imports: [RouterLink, SnakeGameComponent, MarioGameComponent, CarGameComponent],
  template: `
    <main id="main" tabindex="-1" class="min-h-screen pt-14 outline-none">
      <div class="container-page py-12 lg:py-16">
        <a routerLink="/" class="btn btn-sm mb-10"><span class="text-(--color-text-muted)">$</span> cd ~</a>

        <p class="mb-2 font-mono text-sm text-(--color-text-muted)" aria-hidden="true">
          <span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~/games</span>$
          <span class="text-(--color-text)">ls</span>
        </p>
        <h1 class="text-3xl font-semibold text-(--color-text) sm:text-4xl">Games</h1>
        <p class="mt-3 max-w-2xl text-(--color-text-muted)">
          Mini games built from scratch with HTML Canvas and TypeScript — a side project for learning
          rendering loops, collision detection and input handling.
        </p>

        <div class="mt-10 space-y-8">
          @for (game of games; track game.id) {
            <section class="term-window" [attr.aria-labelledby]="game.id">
              <div class="term-titlebar justify-between">
                <span class="flex items-center gap-3">
                  <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
                  ./{{ game.bin }}
                </span>
                <span class="hidden sm:inline">{{ game.tags }}</span>
              </div>
              <div class="p-4 sm:p-6">
                <h2 [id]="game.id" class="text-lg font-semibold text-(--color-text)">{{ game.title }}</h2>
                <p class="mb-5 mt-1 text-[0.9375rem] text-(--color-text-muted)">{{ game.description }}</p>
                @switch (game.id) {
                  @case ('snake') { <app-snake-game /> }
                  @case ('mario') { <app-mario-game /> }
                  @case ('road') { <app-car-game /> }
                }
              </div>
            </section>
          }
        </div>
      </div>
    </main>
  `,
})
export class GamesPageComponent {
  readonly games = [
    {
      id: 'snake',
      bin: 'snake',
      title: 'Snake',
      tags: 'TypeScript · Canvas',
      description: 'Classic snake — keyboard and mobile swipe controls.',
    },
    {
      id: 'mario',
      bin: 'mario-run',
      title: 'Mario Run',
      tags: 'TypeScript · Canvas · Physics',
      description: 'Side-scrolling platformer — run, jump, stomp enemies and collect coins.',
    },
    {
      id: 'road',
      bin: 'road-rush',
      title: 'Road Rush',
      tags: 'TypeScript · Canvas · Physics',
      description: 'Top-down car dodger — survive traffic, rack up distance, beat your best.',
    },
  ];
}
