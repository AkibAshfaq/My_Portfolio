import { Component } from '@angular/core';
import { SKILLS_DATA } from '../../core/models/portfolio.data';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [SectionHeadingComponent],
  template: `
    <section id="skills" aria-labelledby="skills-title" class="border-b border-(--color-border) bg-(--color-surface-2)/40 py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="skills-title" command="skills --list" title="Skills" subtitle="Languages, frameworks and tools I use to ship software." />

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (category of skills; track category.name; let i = $index) {
            <div class="term-window">
              <h3 class="term-titlebar justify-between">
                <span class="text-(--color-text)">{{ category.name }}</span>
                <span aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              </h3>
              <ul class="flex flex-wrap gap-2 p-4" [attr.aria-label]="category.name">
                @for (skill of category.skills; track skill) {
                  <li class="chip">{{ skill }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class SkillsSectionComponent {
  readonly skills = SKILLS_DATA;
  readonly String = String;
}
