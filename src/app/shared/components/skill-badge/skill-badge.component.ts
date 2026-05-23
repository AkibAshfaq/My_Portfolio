import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

const SKILL_ICONS: Record<string, string> = {
  // Languages
  'JavaScript':          'devicon-javascript-plain colored',
  'TypeScript':          'devicon-typescript-plain colored',
  'C#':                  'devicon-csharp-plain colored',
  'Java':                'devicon-java-plain colored',
  'Kotlin':              'devicon-kotlin-plain colored',
  'PHP':                 'devicon-php-plain colored',
  'C++':                 'devicon-cplusplus-plain colored',
  // Web & Frontend
  'HTML5':               'devicon-html5-plain colored',
  'CSS3':                'devicon-css3-plain colored',
  'Angular':             'devicon-angularjs-plain colored',
  'Tailwind CSS':        'devicon-tailwindcss-plain colored',
  'Bootstrap':           'devicon-bootstrap-plain colored',
  // Mobile & Desktop
  'Android (Kotlin)':    'devicon-android-plain colored',
  'WinForms (.NET)':     'devicon-dot-net-plain colored',
  'Jetpack Navigation':  'devicon-android-plain colored',
  'Material Design':     'devicon-android-plain colored',
  // Backend & Databases
  'ASP.NET':             'devicon-dot-net-plain colored',
  'MySQL':               'devicon-mysql-plain colored',
  'SQL Server':          'devicon-microsoftsqlserver-plain colored',
  // Tools
  'Git':                 'devicon-git-plain colored',
  'GitHub':              'devicon-github-plain',
  'Android Studio':      'devicon-androidstudio-plain colored',
  'Visual Studio':       'devicon-visualstudio-plain colored',
  'VS Code':             'devicon-vscode-plain colored',
  'Arduino / ESP32':     'devicon-arduino-plain colored',
};

@Component({
  selector: 'app-skill-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      role="listitem"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-(--color-surface) text-(--color-text) border border-(--color-border) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-colors cursor-default group"
    >
      @if (iconClass()) {
        <i
          [ngClass]="iconClass()!"
          class="text-base leading-none shrink-0 group-hover:brightness-0 group-hover:invert"
          aria-hidden="true"
        ></i>
      }
      {{ label() }}
    </span>
  `,
})
export class SkillBadgeComponent {
  label = input.required<string>();
  iconClass = computed(() => SKILL_ICONS[this.label()] ?? null);
}
