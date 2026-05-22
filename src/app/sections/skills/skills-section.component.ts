import { Component } from '@angular/core';
import { SKILLS_DATA } from '../../core/models/portfolio.data';
import { SkillBadgeComponent } from '../../shared/components/skill-badge/skill-badge.component';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [SkillBadgeComponent],
  template: `
    <section
      id="skills"
      aria-label="Skills"
      role="region"
      class="py-20 bg-(--color-bg)"
    >
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-(--color-text) mb-10 text-center">Skills</h2>
        @for (category of skills; track category.name) {
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-(--color-text) mb-3">{{ category.name }}</h3>
            <div role="list" class="flex flex-wrap gap-2">
              @for (skill of category.skills; track skill) {
                <app-skill-badge [label]="skill" />
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsSectionComponent {
  skills = SKILLS_DATA;
}
