import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CODEFORCES_URL, LEETCODE_URL } from '../../core/terminal/shell';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

interface Item {
  name: string;
  description: string;
  url?: string;
  route?: string;
  action: string;
}

interface Group {
  title: string;
  path: string;
  summary: string;
  tags: string[];
  items: Item[];
}

@Component({
  selector: 'app-extracurricular-section',
  standalone: true,
  imports: [RouterLink, SectionHeadingComponent],
  template: `
    <section aria-labelledby="beyond-title" class="border-b border-(--color-border) py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="beyond-title" command="ls ~/side-projects" title="Beyond the code"
          subtitle="Things I build and practise outside of coursework." />

        <div class="grid gap-4 lg:grid-cols-3 xl:gap-5">
          @for (group of groups; track group.title) {
            <article class="term-window flex flex-col">
              <div class="term-titlebar">{{ group.path }}</div>
              <div class="flex flex-1 flex-col gap-4 p-5">
                <h3 class="text-lg font-semibold text-(--color-text)">{{ group.title }}</h3>
                <p class="text-[0.9375rem] leading-relaxed text-(--color-text-muted)">{{ group.summary }}</p>
                <ul class="flex flex-wrap gap-1.5" aria-label="Technologies">
                  @for (tag of group.tags; track tag) {
                    <li class="chip">{{ tag }}</li>
                  }
                </ul>
                <ul class="mt-auto divide-y divide-(--color-border) rounded border border-(--color-border)">
                  @for (item of group.items; track item.name) {
                    <li class="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div class="min-w-0">
                        <p class="truncate font-mono text-sm text-(--color-text)">{{ item.name }}</p>
                        <p class="truncate text-xs text-(--color-text-muted)">{{ item.description }}</p>
                      </div>
                      @if (item.route) {
                        <a [routerLink]="item.route" class="btn btn-sm shrink-0" [attr.aria-label]="item.action + ' ' + item.name">{{ item.action }}</a>
                      } @else {
                        <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="btn btn-sm shrink-0"
                           [attr.aria-label]="item.action + ' ' + item.name">{{ item.action }} ↗</a>
                      }
                    </li>
                  }
                </ul>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ExtracurricularSectionComponent {
  readonly groups: Group[] = [
    {
      title: 'Game development',
      path: '~/side-projects/games',
      summary:
        'Mini games built from scratch to explore canvas rendering, game physics and input handling — no engines, just TypeScript and HTML Canvas.',
      tags: ['TypeScript', 'HTML Canvas', 'Game physics', 'Angular'],
      items: [
        { name: 'snake', description: "Classic snake — eat, grow, don't crash", route: '/games', action: 'play' },
        { name: 'mario-run', description: 'Platformer — jump, stomp, collect coins', route: '/games', action: 'play' },
        { name: 'road-rush', description: 'Top-down car dodger — survive traffic', route: '/games', action: 'play' },
      ],
    },
    {
      title: 'Competitive programming',
      path: '~/side-projects/cp',
      summary:
        'Regular practice on Codeforces and LeetCode in C++: sorting, binary search, dynamic programming and graph algorithms.',
      tags: ['C++', 'Algorithms', 'Data structures'],
      items: [
        { name: 'codeforces', description: 'Rated contests and problem sets', url: CODEFORCES_URL, action: 'visit' },
        { name: 'leetcode', description: 'DSA practice and interview prep', url: LEETCODE_URL, action: 'visit' },
      ],
    },
    {
      title: 'IoT & hardware',
      path: '~/side-projects/iot',
      summary:
        'Embedded projects with ESP32 and Arduino — Wi-Fi boards, agricultural sensors and interactive hardware interfaces.',
      tags: ['C++', 'ESP32', 'Arduino', 'Embedded C'],
      items: [
        { name: 'esp32-wifi-board', description: 'Remote control and sensor experiments', url: 'https://github.com/AkibAshfaq/Esp32-WIFI-Board', action: 'repo' },
        { name: 'smart-agri-automation', description: 'Soil, temperature and humidity monitoring', url: 'https://github.com/AkibAshfaq/SMART-AGRICULTURAL-AUTOMATION-SYSTEM', action: 'repo' },
        { name: 'tui-tt-paddle', description: 'Sensor paddle with a terminal UI', url: 'https://github.com/AkibAshfaq/TUI-Based-Table-Tennis-Paddle', action: 'repo' },
      ],
    },
  ];
}
