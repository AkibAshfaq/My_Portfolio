import { Component } from '@angular/core';
import { SKILLS_DATA } from '../../core/models/portfolio.data';
import { SkillBadgeComponent } from '../../shared/components/skill-badge/skill-badge.component';
import { TechDecorComponent } from '../../shared/components/tech-decor/tech-decor.component';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [SkillBadgeComponent, TechDecorComponent],
  template: `
    <section
      id="skills"
      aria-label="Skills"
      role="region"
      class="relative py-20 lg:py-28 bg-(--color-bg) overflow-hidden"
    >
      <app-tech-decor [seed]="2" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-10 lg:mb-14 text-center">Skills</h2>
        <div class="xl:grid xl:grid-cols-2 xl:gap-x-16">
          @for (category of skills; track category.name) {
            <div class="mb-8 xl:mb-10">
              <h3 class="text-xl font-semibold text-(--color-text) mb-3">{{ category.name }}</h3>
              <div role="list" class="flex flex-wrap gap-2">
                @for (skill of category.skills; track skill) {
                  <app-skill-badge [label]="skill" />
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class SkillsSectionComponent {
  skills = SKILLS_DATA;
}
