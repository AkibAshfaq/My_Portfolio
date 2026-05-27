import { Component } from '@angular/core';
import { CONTACT_DATA } from '../../core/models/portfolio.data';
import type { SocialLink } from '../../core/models/portfolio.models';
import { TechDecorComponent } from '../../shared/components/tech-decor/tech-decor.component';

const EMAIL = 'akibash.dev@gmail.com';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [TechDecorComponent],
  template: `
    <section
      id="contact"
      aria-label="Contact"
      role="region"
      class="relative py-20 lg:py-28 bg-(--color-surface) overflow-hidden"
    >
      <app-tech-decor [seed]="1" />
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-(--color-text) mb-2 text-center">Get In Touch</h2>
        <p class="text-center text-(--color-text-muted) mb-10 lg:mb-14 text-sm">
          Open to internships, entry-level roles, and collaborative projects
        </p>

        <div class="grid md:grid-cols-2 gap-8 lg:gap-12">

          <!-- Left — Availability -->
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
                <p class="text-(--color-text) font-medium">Dhaka, Bangladesh</p>
              </div>
              <div>
                <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Response time</p>
                <p class="text-(--color-text) font-medium">Within 24 hours</p>
              </div>
              <div>
                <p class="text-(--color-text-muted) text-xs uppercase tracking-wide mb-0.5">Email</p>
                <a
                  [href]="mailtoLink"
                  class="text-(--color-primary) font-medium hover:underline break-all"
                >{{ email }}</a>
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
                  >{{ link.platform }}</a>
                }
              </div>
            </div>
          </div>

          <!-- Right — Email CTA -->
          <div class="rounded-xl border border-(--color-border) bg-(--color-bg) p-6 sm:p-8 flex flex-col items-center justify-center gap-6 text-center">

            <!-- Icon -->
            <div class="w-16 h-16 rounded-2xl bg-(--color-primary)/10 border border-(--color-primary)/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            <div>
              <h3 class="text-xl font-bold text-(--color-text) mb-2">Send Me an Email</h3>
              <p class="text-sm text-(--color-text-muted) leading-relaxed max-w-xs mx-auto">
                Got a project idea, job offer, or just want to say hi?
                Drop me a message directly.
              </p>
            </div>

            <!-- Email address display -->
            <div class="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3">
              <p class="text-sm font-mono font-medium text-(--color-text) break-all select-all">{{ email }}</p>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row gap-3 w-full">
              <a
                [href]="mailtoLink"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
                aria-label="Open email client to contact Akib"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Open Email App
              </a>

              <a
                [href]="gmailLink"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-3 text-sm font-semibold text-(--color-text) transition-colors hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
                aria-label="Compose email in Gmail"
              >
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
                Open in Gmail
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  readonly email = EMAIL;
  readonly mailtoLink = `mailto:${EMAIL}?subject=Hello%20Akib%20%E2%80%94%20Let%27s%20Connect`;
  readonly gmailLink  = `https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=Hello%20Akib%20%E2%80%94%20Let%27s%20Connect`;
  readonly socialLinks: SocialLink[] = CONTACT_DATA.socialLinks;
}
