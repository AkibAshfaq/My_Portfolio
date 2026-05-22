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
      class="py-20 bg-(--color-surface)"
    >
      <div class="max-w-2xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-(--color-text) mb-10 text-center">
          Get In Touch
        </h2>

        <app-contact-form />

        <div class="mt-10 flex flex-wrap justify-center gap-6">
          @for (link of socialLinks; track link.platform) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              [attr.aria-label]="link.ariaLabel"
              class="text-(--color-primary) font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-(--color-primary) rounded"
            >
              {{ link.platform }}
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  readonly socialLinks: SocialLink[] = CONTACT_DATA.socialLinks;
}
