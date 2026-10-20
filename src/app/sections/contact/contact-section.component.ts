import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HERO_DATA } from '../../core/models/portfolio.data';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../core/terminal/shell';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

/**
 * Contact details plus a terminal-style mail composer. Nothing is sent from the
 * site itself: the composer hands the message to the visitor's mail app or Gmail.
 */
@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [SectionHeadingComponent, RouterLink],
  template: `
    <section id="contact" aria-labelledby="contact-title" class="py-20 lg:py-24">
      <div class="container-page">
        <app-section-heading headingId="contact-title" command="contact --compose" title="Contact"
          subtitle="Happy to talk about .NET, software architecture or collaboration. I reply within 24 hours." />

        <div class="grid gap-6 lg:grid-cols-[22rem_1fr] xl:grid-cols-[26rem_1fr] xl:gap-8">
          <div class="term-window self-start">
            <div class="term-titlebar">contact.yml</div>
            <dl class="divide-y divide-(--color-border) font-mono text-sm">
              <div class="px-4 py-3">
                <dt class="label">email</dt>
                <dd class="mt-1 flex items-center justify-between gap-2">
                  <a [href]="'mailto:' + email" class="link break-all">{{ email }}</a>
                  <button type="button" class="btn btn-sm min-h-7 shrink-0 px-2" (click)="copyEmail()"
                          [attr.aria-label]="copied() ? 'Email copied' : 'Copy email address'">
                    {{ copied() ? 'copied' : 'copy' }}
                  </button>
                </dd>
              </div>
              <div class="px-4 py-3">
                <dt class="label">location</dt>
                <dd class="mt-1 text-(--color-text)">{{ location }}</dd>
              </div>
              <div class="px-4 py-3">
                <dt class="label">links</dt>
                <dd class="mt-1 flex gap-4">
                  <a [href]="github" target="_blank" rel="noopener noreferrer" class="link">github</a>
                  <a [href]="linkedin" target="_blank" rel="noopener noreferrer" class="link">linkedin</a>
                  <a routerLink="/cv" class="link">cv</a>
                </dd>
              </div>
            </dl>
          </div>

          <form class="term-window" (submit)="send($event, 'app')" aria-labelledby="compose-title">
            <div class="term-titlebar justify-between">
              <span class="flex items-center gap-3">
                <span class="term-dots" aria-hidden="true"><span></span><span></span><span></span></span>
                <span id="compose-title">mail --to {{ email }}</span>
              </span>
            </div>

            <div class="space-y-1 p-4 font-mono text-sm sm:p-5">
              <div class="flex items-center gap-3 border-b border-(--color-border) py-2">
                <label for="c-name" class="w-20 shrink-0 text-(--color-primary)">from:</label>
                <input id="c-name" name="name" type="text" autocomplete="name" placeholder="Your name"
                       class="min-w-0 flex-1 bg-transparent text-(--color-text) outline-none placeholder:text-(--color-text-muted)/70"
                       [value]="name()" (input)="name.set($any($event.target).value)" />
              </div>
              <div class="flex items-center gap-3 border-b border-(--color-border) py-2">
                <label for="c-subject" class="w-20 shrink-0 text-(--color-primary)">subject:</label>
                <input id="c-subject" name="subject" type="text" placeholder="Internship opportunity"
                       class="min-w-0 flex-1 bg-transparent text-(--color-text) outline-none placeholder:text-(--color-text-muted)/70"
                       [value]="subject()" (input)="subject.set($any($event.target).value)" />
              </div>
              <div class="pt-3">
                <label for="c-body" class="text-(--color-primary)">message:</label>
                <textarea id="c-body" name="message" rows="6" required placeholder="Hi Akib, …"
                          class="mt-2 w-full resize-y rounded border border-(--color-border) bg-(--color-bg) p-3 font-sans text-[0.9375rem] leading-relaxed text-(--color-text) outline-none placeholder:text-(--color-text-muted)/70 focus:border-(--color-primary)"
                          [value]="body()" (input)="body.set($any($event.target).value)"></textarea>
              </div>

              @if (error()) {
                <p class="text-(--color-error)" role="alert">error: {{ error() }}</p>
              }
              @if (status()) {
                <p class="text-(--color-text-muted)" role="status">{{ status() }}</p>
              }

              <div class="flex flex-wrap gap-2 pt-3">
                <button type="submit" class="btn btn-primary">send via mail app</button>
                <button type="button" class="btn" (click)="send($event, 'gmail')">open in gmail ↗</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly email = EMAIL;
  readonly github = GITHUB_URL;
  readonly linkedin = LINKEDIN_URL;
  readonly location = HERO_DATA.location;

  readonly name = signal('');
  readonly subject = signal('');
  readonly body = signal('');
  readonly error = signal('');
  readonly status = signal('');
  readonly copied = signal(false);

  send(event: Event, via: 'app' | 'gmail'): void {
    event.preventDefault();
    if (!this.body().trim()) {
      this.error.set('message is empty');
      this.status.set('');
      return;
    }
    this.error.set('');
    const subject = encodeURIComponent(this.subject().trim() || 'Hello Akib — from your portfolio');
    const body = encodeURIComponent(this.body().trim() + (this.name().trim() ? `\n\n— ${this.name().trim()}` : ''));
    if (via === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=${subject}&body=${body}`, '_blank', 'noopener');
      this.status.set('opened Gmail in a new tab');
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      this.status.set('handed off to your mail app');
    }
  }

  async copyEmail(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      await navigator.clipboard.writeText(EMAIL);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.status.set(`copy failed — the address is ${EMAIL}`);
    }
  }
}
