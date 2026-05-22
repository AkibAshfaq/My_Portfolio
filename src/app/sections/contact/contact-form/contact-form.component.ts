import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (success()) {
      <div
        class="rounded-lg bg-green-100 px-4 py-3 text-green-800"
        role="alert"
        aria-live="polite"
      >
        Message sent! I'll get back to you soon.
      </div>
    }

    @if (!success()) {
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        novalidate
        class="flex flex-col gap-5"
      >
        <!-- Name -->
        <div>
          <label
            for="contact-name"
            class="mb-1 block text-sm font-medium text-(--color-text)"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            formControlName="name"
            autocomplete="name"
            class="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            [attr.aria-invalid]="form.get('name')?.invalid && submitted() ? true : null"
            aria-describedby="contact-name-error"
          />
          @if (form.get('name')?.invalid && submitted()) {
            <p id="contact-name-error" class="mt-1 text-sm text-red-500">
              Name is required
            </p>
          }
        </div>

        <!-- Email -->
        <div>
          <label
            for="contact-email"
            class="mb-1 block text-sm font-medium text-(--color-text)"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            [attr.aria-invalid]="form.get('email')?.invalid && submitted() ? true : null"
            aria-describedby="contact-email-error"
          />
          @if (form.get('email')?.invalid && submitted()) {
            <p id="contact-email-error" class="mt-1 text-sm text-red-500">
              @if (form.get('email')?.hasError('required')) {
                Email is required
              } @else {
                Please enter a valid email address
              }
            </p>
          }
        </div>

        <!-- Message -->
        <div>
          <label
            for="contact-message"
            class="mb-1 block text-sm font-medium text-(--color-text)"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            formControlName="message"
            rows="5"
            class="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            [attr.aria-invalid]="form.get('message')?.invalid && submitted() ? true : null"
            aria-describedby="contact-message-error"
          ></textarea>
          @if (form.get('message')?.invalid && submitted()) {
            <p id="contact-message-error" class="mt-1 text-sm text-red-500">
              Message is required
            </p>
          }
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="rounded-lg bg-(--color-primary) px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2"
        >
          Send Message
        </button>
      </form>
    }
  `,
})
export class ContactFormComponent {
  form: FormGroup;
  submitted = signal(false);
  success = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.success.set(true);
      this.form.reset();
      this.submitted.set(false);
    }
  }
}
