import { Component, OnInit, inject } from '@angular/core';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';
import { ABOUT_DATA, EXPERIENCE_DATA, HERO_DATA, HOME_SEO } from '../../core/models/portfolio.data';
import {
  CV_COURSES,
  CV_EDUCATION,
  CV_PDF_FILENAME,
  CV_PDF_URL,
  CV_PROJECTS,
  CV_SKILLS,
  CV_WEBSITE,
} from '../../core/models/cv.data';
import { SeoService } from '../../core/services/seo.service';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../core/terminal/shell';
import { formatEndDate, sortExperienceEntries } from '../../core/utils/experience.utils';

/** Web view of the CV rendered like `tree` output; the PDF is offered as a download. */
@Component({
  selector: 'app-cv-page',
  standalone: true,
  imports: [BackLinkComponent],
  template: `
    <main id="main" tabindex="-1" class="min-h-screen pt-14 outline-none">
      <div class="container-page py-12 lg:py-16">
        <div class="mb-10 flex flex-wrap items-center justify-between gap-3">
          <app-back-link fallback="/" />
          <a [href]="pdfUrl" [attr.download]="pdfName" class="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>
            Download PDF
          </a>
        </div>

        <article class="term-window">
          <div class="term-titlebar justify-between">
            <span class="flex items-center gap-3">
              <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
              ~/cv — less cv.txt
            </span>
            <span class="hidden sm:inline">{{ pdfName }}</span>
          </div>

          <div class="space-y-12 p-5 font-mono text-sm leading-6 sm:p-8 lg:p-10">
            <!-- Header -->
            <header>
              <p class="text-(--color-text-muted)" aria-hidden="true"><span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~/cv</span>$ cat cv.txt</p>
              <h1 class="mt-3 text-3xl font-semibold text-(--color-text) sm:text-4xl">{{ hero.name }}</h1>
              <p class="mt-1 text-base text-(--color-primary)">{{ hero.title }} · {{ hero.location }}</p>
              <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                <li><span class="text-(--color-text-muted)">email:</span> <a [href]="'mailto:' + email" class="link">{{ email }}</a></li>
                <li><span class="text-(--color-text-muted)">github:</span> <a [href]="github" target="_blank" rel="noopener noreferrer" class="link">github.com/AkibAshfaq</a></li>
                <li><span class="text-(--color-text-muted)">linkedin:</span> <a [href]="linkedin" target="_blank" rel="noopener noreferrer" class="link">linkedin.com/in/akib-ashfaq-dev</a></li>
                <li><span class="text-(--color-text-muted)">web:</span> <a [href]="website" target="_blank" rel="noopener noreferrer" class="link">akibashfaq.com</a></li>
              </ul>
            </header>

            <!-- Summary -->
            <section aria-labelledby="cv-summary">
              <h2 id="cv-summary" class="cv-h"><span aria-hidden="true">## </span>summary</h2>
              <div class="space-y-3 font-sans text-[0.9375rem] leading-relaxed text-(--color-text)">
                @for (p of summary; track $index) { <p>{{ p }}</p> }
              </div>
            </section>

            <!-- Experience -->
            <section aria-labelledby="cv-exp">
              <h2 id="cv-exp" class="cv-h"><span aria-hidden="true">## </span>experience</h2>
              @for (job of experience; track job.company) {
                <div class="mb-6 last:mb-0">
                  <p class="flex flex-wrap justify-between gap-x-4">
                    <span><span class="text-(--color-info)">{{ job.company }}/</span> <span class="text-(--color-text)">{{ job.jobTitle }}</span></span>
                    <span class="text-(--color-warn)">{{ job.startDate }} → {{ formatEndDate(job.endDate) }}</span>
                  </p>
                  <ul class="tree">
                    @for (r of job.responsibilities; track r) { <li>{{ r }}</li> }
                  </ul>
                </div>
              }
            </section>

            <!-- Education -->
            <section aria-labelledby="cv-edu">
              <h2 id="cv-edu" class="cv-h"><span aria-hidden="true">## </span>education</h2>
              <ul class="tree">
                @for (edu of education; track edu.institution) {
                  <li>Studied {{ edu.degree }} at <span class="text-(--color-info)">{{ edu.institution }}</span></li>
                }
              </ul>
            </section>

            <!-- Projects -->
            <section aria-labelledby="cv-proj">
              <h2 id="cv-proj" class="cv-h"><span aria-hidden="true">## </span>projects</h2>
              <div class="grid gap-x-12 gap-y-7 xl:grid-cols-2">
                @for (proj of projects; track proj.name) {
                  <div>
                    <p class="flex flex-wrap justify-between gap-x-4">
                      <a [href]="proj.url" target="_blank" rel="noopener noreferrer" class="text-(--color-info) hover:underline">{{ proj.name }}/</a>
                      <span class="text-(--color-warn)">{{ proj.period }}</span>
                    </p>
                    <p class="text-(--color-text-muted)">{{ proj.stack }}</p>
                    <ul class="tree">
                      @for (pt of proj.points; track pt) { <li>{{ pt }}</li> }
                    </ul>
                  </div>
                }
              </div>
            </section>

            <!-- Skills -->
            <section aria-labelledby="cv-skills">
              <h2 id="cv-skills" class="cv-h"><span aria-hidden="true">## </span>technical skills</h2>
              <dl class="grid gap-x-6 gap-y-2 sm:grid-cols-[11rem_1fr]">
                @for (g of skills; track g.label) {
                  <dt class="text-(--color-text-muted)">{{ g.label }}</dt>
                  <dd class="mb-2 text-(--color-text) sm:mb-0">{{ g.items.join(', ') }}</dd>
                }
              </dl>
            </section>

            <!-- Courses -->
            <section aria-labelledby="cv-courses">
              <h2 id="cv-courses" class="cv-h"><span aria-hidden="true">## </span>additional courses</h2>
              <ul class="tree">
                @for (c of courses; track c.name) {
                  <li>{{ c.name }} @if (c.period) { <span class="text-(--color-warn)">({{ c.period }})</span> }</li>
                }
              </ul>
            </section>

            <p class="text-(--color-text-muted)">
              <span class="text-(--color-primary)">akib&#64;portfolio</span>:<span class="text-(--color-info)">~/cv</span>$
              <a [href]="pdfUrl" [attr.download]="pdfName" class="link">download {{ pdfName }}</a><span class="cursor-blink ml-1" aria-hidden="true"></span>
            </p>
          </div>
        </article>
      </div>
    </main>
  `,
})
export class CvPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly hero = HERO_DATA;
  readonly summary = ABOUT_DATA.biography.split('\n\n');
  readonly experience = sortExperienceEntries(EXPERIENCE_DATA);
  readonly education = CV_EDUCATION;
  readonly projects = CV_PROJECTS;
  readonly skills = CV_SKILLS;
  readonly courses = CV_COURSES;
  readonly pdfUrl = CV_PDF_URL;
  readonly pdfName = CV_PDF_FILENAME;
  readonly website = CV_WEBSITE;
  readonly email = EMAIL;
  readonly github = GITHUB_URL;
  readonly linkedin = LINKEDIN_URL;
  readonly formatEndDate = formatEndDate;

  ngOnInit(): void {
    this.seo.updateSeo({
      ...HOME_SEO,
      title: 'CV — Akib Ashfaq',
      ogTitle: 'CV — Akib Ashfaq, Software Engineer (.NET)',
    });
  }
}
