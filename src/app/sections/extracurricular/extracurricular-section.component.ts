import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface IotProject {
  name: string;
  description: string;
  url: string;
}

@Component({
  selector: 'app-extracurricular-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      aria-label="Extra-Curricular Activities"
      role="region"
      class="py-20 lg:py-28 bg-(--color-bg)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-2 text-center">Beyond the Code</h2>
        <p class="text-center text-(--color-text-muted) mb-10 lg:mb-14 text-sm">
          Things I build and do outside of assignments and work
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          <!-- Game Development -->
          <div class="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3">
              <span class="text-3xl" aria-hidden="true">🎮</span>
              <div>
                <h3 class="text-lg font-bold text-(--color-text)">Game Development</h3>
                <p class="text-xs text-(--color-text-muted) font-medium uppercase tracking-wide">Extra-Curricular</p>
              </div>
            </div>
            <p class="text-sm text-(--color-text-muted) leading-relaxed">
              I build mini games to explore canvas rendering, game loops, and interactive programming.
              Currently: a fully playable Snake game with keyboard &amp; touch controls — written in
              TypeScript with HTML Canvas.
            </p>
            <ul class="flex flex-wrap gap-2">
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">TypeScript</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">HTML Canvas</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Game Loop</span></li>
            </ul>
            <a
              routerLink="/games"
              class="mt-auto inline-flex items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) self-start"
            >
              Play Now →
            </a>
          </div>

          <!-- Competitive Programming -->
          <div class="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3">
              <span class="text-3xl" aria-hidden="true">🏆</span>
              <div>
                <h3 class="text-lg font-bold text-(--color-text)">Competitive Programming</h3>
                <p class="text-xs text-(--color-text-muted) font-medium uppercase tracking-wide">Extra-Curricular</p>
              </div>
            </div>
            <p class="text-sm text-(--color-text-muted) leading-relaxed">
              I actively solve algorithmic problems on Codeforces and LeetCode, tracking my
              Codeforces progress in a public GitHub repository. Topics include sorting, binary
              search, dynamic programming, and graph algorithms.
            </p>
            <ul class="flex flex-wrap gap-2">
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">C++</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Algorithms</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Codeforces</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">LeetCode</span></li>
            </ul>
            <div class="mt-auto flex flex-wrap gap-3">
              <a
                href="https://codeforces.com/profile/AkibAshfaq"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
              >
                Codeforces →
              </a>
              <a
                href="https://leetcode.com/u/AkibAshfaq"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
              >
                LeetCode →
              </a>
            </div>
          </div>

          <!-- IoT & Hardware -->
          <div class="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div class="flex items-center gap-3">
              <span class="text-3xl" aria-hidden="true">⚡</span>
              <div>
                <h3 class="text-lg font-bold text-(--color-text)">IoT &amp; Hardware</h3>
                <p class="text-xs text-(--color-text-muted) font-medium uppercase tracking-wide">Extra-Curricular</p>
              </div>
            </div>
            <p class="text-sm text-(--color-text-muted) leading-relaxed">
              I experiment with embedded systems and IoT hardware — building real-world projects
              using ESP32 and Arduino. From Wi-Fi connected boards to smart agricultural sensors
              and interactive hardware interfaces.
            </p>
            <ul class="flex flex-wrap gap-2">
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">C++</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">ESP32</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Arduino</span></li>
              <li><span class="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-text)">Embedded C</span></li>
            </ul>

            <!-- IoT project list -->
            <div class="mt-1 flex flex-col gap-3">
              @for (project of iotProjects; track project.name) {
                <div class="flex items-center justify-between gap-3 rounded-lg border border-(--color-border) bg-(--color-bg) px-4 py-3">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-(--color-text) truncate">{{ project.name }}</p>
                    <p class="text-xs text-(--color-text-muted) truncate">{{ project.description }}</p>
                  </div>
                  <a
                    [href]="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View {{ project.name }} on GitHub"
                    class="shrink-0 inline-flex items-center rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-colors hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
                  >
                    GitHub →
                  </a>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ExtracurricularSectionComponent {
  readonly iotProjects: IotProject[] = [
    {
      name: 'ESP32 WiFi Board',
      description: 'Wi-Fi connected IoT board — remote control & sensor experiments',
      url: 'https://github.com/AkibAshfaq/Esp32-WIFI-Board',
    },
    {
      name: 'Smart Agricultural Automation',
      description: 'Automated soil, temperature & humidity monitoring system',
      url: 'https://github.com/AkibAshfaq/SMART-AGRICULTURAL-AUTOMATION-SYSTEM',
    },
    {
      name: 'TUI Table Tennis Paddle',
      description: 'Smart paddle with embedded sensors & terminal UI interface',
      url: 'https://github.com/AkibAshfaq/TUI-Based-Table-Tennis-Paddle',
    },
  ];
}
