import { Component } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { CONTACT_DATA } from '../../core/models/portfolio.data';
import type { SocialLink } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ContactFormComponent],
  template: `
    <section
      id="contact"
      aria-label="Contact"
      role="region"
      class="py-20 lg:py-28 bg-(--color-surface)"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-2 text-center">Get In Touch</h2>
        <p class="text-center text-(--color-text-muted) mb-10 lg:mb-14 text-sm">
          Open to internships, entry-level roles, and collaborative projects
        </p>

        <div class="grid md:grid-cols-5 gap-8 lg:gap-12">

          <div class="md:col-span-2 flex flex-col gap-4">
            <div class="rounded-xl border border-(--color-border) bg-(--color-bg) p-5 flex flex-col gap-4">
              <h3 class="text-sm font-bold text-(--color-text) uppercase tracking-wider">Availability</h3>

              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" aria-hidden="true"></span>
                <p class="text-sm font-semibold text-green-600 dark:text-green-400">Available now</p>
              </div>

              <div class="space-y-3 text-sm">
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Looking for</p>
                  <p class="text-(--color-text) font-medium">Internship / Entry-level</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Location</p>
                  <p class="text-(--color-text) font-medium">Dhaka</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Response time</p>
                  <p class="text-(--color-text) font-medium">Within 24 hours</p>
                </div>
                <div>
                  <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Email</p>
                  <a
                    href="mailto:akibash.dev@gmail.com"
                    class="text-(--color-primary) font-medium hover:underline break-all"
                  >akibash.dev@gmail.com</a>
                </div>
              </div>

              <div class="pt-2 border-t border-(--color-border)">
                <p class="text-xs text-(--color-text-muted) mb-2 font-medium">Connect</p>
                <div class="flex flex-wrap gap-3">
                  @for (link of socialLinks; track link.platform) {
                    <a
                      [href]="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      [attr.aria-label]="link.ariaLabel"
                      class="text-(--color-primary) font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-(--color-primary) rounded"
                    >
                      {{ link.platform }}
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="md:col-span-3">
            <app-contact-form />
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  readonly socialLinks: SocialLink[] = CONTACT_DATA.socialLinks;
}
