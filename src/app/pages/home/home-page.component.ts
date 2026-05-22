import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { HOME_SEO } from '../../core/models/portfolio.data';
import { HeroSectionComponent } from '../../sections/hero/hero-section.component';
import { AboutSectionComponent } from '../../sections/about/about-section.component';
import { SkillsSectionComponent } from '../../sections/skills/skills-section.component';
import { ExperienceSectionComponent } from '../../sections/experience/experience-section.component';
import { ProjectsSectionComponent } from '../../sections/projects/projects-section.component';
import { ContactSectionComponent } from '../../sections/contact/contact-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    SkillsSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <main role="main">
      <app-hero-section />
      <app-about-section />
      <app-skills-section />
      <app-experience-section />
      <app-projects-section />
      <app-contact-section />
    </main>
  `,
})
export class HomePageComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(HOME_SEO);
  }
}
