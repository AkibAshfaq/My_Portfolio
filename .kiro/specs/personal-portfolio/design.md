# Design Document: Personal Portfolio

## Overview

The personal portfolio is a single-page Angular 21 application with server-side rendering (SSR) via `@angular/ssr` and Express 5. All content lives on a single route (`/`), divided into named sections that are navigated via smooth-scroll anchor links. Tailwind CSS v4 (imported via `@import 'tailwindcss'` in `styles.css`) handles all styling. The app supports light/dark theming driven by `prefers-color-scheme` and `localStorage`, and exposes an SEO service that sets `<title>`, `<meta>` description, and Open Graph tags on every route.

The scaffold already provides:
- Angular 21 with standalone components and signals
- `@angular/ssr` with `RenderMode.Prerender` for the `**` route
- `provideClientHydration(withEventReplay())` for hydration
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Vitest as the test runner

---

## Architecture

### High-Level Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces and data constants
│   │   ├── services/        # ThemeService, SeoService, ScrollService
│   │   └── tokens/          # Injection tokens (DOCUMENT, WINDOW)
│   ├── layout/
│   │   ├── navbar/          # NavigationBarComponent
│   │   └── footer/          # FooterComponent
│   ├── sections/
│   │   ├── hero/            # HeroSectionComponent
│   │   ├── about/           # AboutSectionComponent
│   │   ├── skills/          # SkillsSectionComponent
│   │   ├── experience/      # ExperienceSectionComponent
│   │   ├── projects/        # ProjectsSectionComponent
│   │   └── contact/         # ContactSectionComponent
│   ├── shared/
│   │   └── components/      # SkillBadgeComponent, ProjectCardComponent, TimelineEntryComponent
│   ├── app.ts               # Root AppComponent
│   ├── app.html             # Root template (shell + router-outlet)
│   ├── app.css              # Component-scoped root styles
│   ├── app.routes.ts        # Client routes
│   ├── app.routes.server.ts # Server routes (Prerender)
│   ├── app.config.ts        # Client ApplicationConfig
│   └── app.config.server.ts # Server ApplicationConfig
├── index.html               # HTML shell
├── styles.css               # Global styles (@import 'tailwindcss')
├── main.ts                  # Browser bootstrap
├── main.server.ts           # Server bootstrap
└── server.ts                # Express server
```

### Component Tree

```
AppComponent
├── NavigationBarComponent
│   └── ThemeToggleComponent (inline or child)
├── main[role="main"]
│   ├── HeroSectionComponent
│   ├── AboutSectionComponent
│   ├── SkillsSectionComponent
│   ├── ExperienceSectionComponent
│   │   └── TimelineEntryComponent (×N)
│   ├── ProjectsSectionComponent
│   │   └── ProjectCardComponent (×N)
│   └── ContactSectionComponent
│       └── ContactFormComponent
└── FooterComponent
```

### Routing Strategy

The portfolio is a single-page application with one client route (`/`). All sections are anchor-navigated within that page. The server route uses `RenderMode.Prerender` (already configured), which pre-renders the page at build time and serves static HTML — ideal for a portfolio with no dynamic server-side data.

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: '' }
];
```

A `HomePageComponent` acts as the page container, composing all section components. This keeps `AppComponent` as a pure shell (nav + footer + router-outlet).

---

## Components and Interfaces

### NavigationBarComponent (`layout/navbar/`)

**Responsibilities:**
- Renders fixed top navigation with anchor links to all six sections
- Contains the `ThemeToggleComponent`
- Tracks the active section via `IntersectionObserver` and updates an `activeSection` signal
- Collapses to a hamburger menu below 768px

**Inputs/Outputs:** None (reads from `ThemeService`, `ScrollService`)

**Template structure:**
```html
<nav role="nav" aria-label="Main navigation" class="fixed top-0 ...">
  <div class="nav-links">
    <a *ngFor="each section" [class.active]="activeSection() === id"
       (click)="scrollTo(id)" [attr.aria-label]="...">...</a>
  </div>
  <app-theme-toggle />
  <button class="hamburger md:hidden" (click)="toggleMenu()" aria-label="Open menu">...</button>
</nav>
```

**Signals:**
- `activeSection = signal<SectionId>('hero')`
- `menuOpen = signal<boolean>(false)`

**Active section detection:** Uses `IntersectionObserver` (with a `PLATFORM_ID` guard for SSR) to observe each section element. When a section's intersection ratio crosses the threshold, `activeSection` is updated.

---

### ThemeToggleComponent (inline in navbar or `layout/navbar/theme-toggle/`)

**Responsibilities:**
- Renders a button that calls `ThemeService.toggle()`
- Reads `ThemeService.theme()` signal to set `aria-label`

**Template:**
```html
<button (click)="themeService.toggle()"
        [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
  <!-- sun/moon SVG icon -->
</button>
```

---

### HeroSectionComponent (`sections/hero/`)

**Responsibilities:**
- Displays developer name, title, tagline
- CTA button → smooth scroll to `#projects`
- Resume download button (conditionally rendered)

**Data source:** `HERO_DATA` constant from `core/models/portfolio.data.ts`

**Template structure:**
```html
<section id="hero" aria-label="Hero" class="min-h-screen flex items-center ...">
  <h1>{{ hero.name }}</h1>
  <p>{{ hero.title }}</p>
  <p>{{ hero.tagline }}</p>
  <button (click)="scrollService.scrollTo('projects')">View My Work</button>
  @if (hero.resumeUrl) {
    <a [href]="hero.resumeUrl" download>Download Résumé</a>
  }
</section>
```

---

### AboutSectionComponent (`sections/about/`)

**Responsibilities:**
- Displays profile photo with alt text and onerror fallback
- Displays biography text
- Two-column layout on ≥768px, single column below

**Data source:** `ABOUT_DATA` constant

**Template:**
```html
<section id="about" aria-label="About" role="region">
  <div class="grid md:grid-cols-2 gap-8">
    <img [src]="about.photoUrl" [alt]="about.photoAlt"
         (error)="onImgError($event)" loading="lazy" />
    <p>{{ about.biography }}</p>
  </div>
</section>
```

---

### SkillsSectionComponent (`sections/skills/`)

**Responsibilities:**
- Renders skill categories from `SKILLS_DATA`
- Each skill rendered as a `SkillBadgeComponent`

**Template:**
```html
<section id="skills" aria-label="Skills" role="region">
  @for (category of skills; track category.name) {
    <h3>{{ category.name }}</h3>
    <div class="flex flex-wrap gap-2">
      @for (skill of category.skills; track skill) {
        <app-skill-badge [label]="skill" />
      }
    </div>
  }
</section>
```

---

### ExperienceSectionComponent (`sections/experience/`)

**Responsibilities:**
- Renders work entries sorted in reverse chronological order
- Each entry rendered as a `TimelineEntryComponent`
- Displays "Present" when `endDate` is absent

**Data source:** `EXPERIENCE_DATA` constant (sorted by `startDate` descending in the component)

---

### ProjectsSectionComponent (`sections/projects/`)

**Responsibilities:**
- Renders project cards in a responsive grid
- Each card rendered as a `ProjectCardComponent`

**Data source:** `PROJECTS_DATA` constant

---

### ContactSectionComponent (`sections/contact/`)

**Responsibilities:**
- Renders `ContactFormComponent`
- Renders social links

**Data source:** `CONTACT_DATA` constant (social links array)

---

### ContactFormComponent (`sections/contact/contact-form/`)

**Responsibilities:**
- Angular reactive form with `name`, `email`, `message` controls
- Inline validation errors on submit attempt
- Success state after valid submission (resets form)

**Form definition:**
```typescript
form = this.fb.group({
  name:    ['', [Validators.required]],
  email:   ['', [Validators.required, Validators.email]],
  message: ['', [Validators.required]]
});
submitted = signal(false);
success   = signal(false);
```

---

### Shared Components

**SkillBadgeComponent** (`shared/components/skill-badge/`)
- Input: `label: string`
- Renders a styled `<span>` chip

**ProjectCardComponent** (`shared/components/project-card/`)
- Input: `project: Project`
- Renders card with name, description, tech tags, demo/repo links
- All external links: `target="_blank" rel="noopener noreferrer"`

**TimelineEntryComponent** (`shared/components/timeline-entry/`)
- Input: `entry: WorkEntry`
- Renders a single timeline item with company, title, period, responsibilities

---

## Data Models

All data models live in `src/app/core/models/`.

### `portfolio.models.ts` — TypeScript interfaces

```typescript
export interface HeroData {
  name: string;
  title: string;
  tagline: string;
  resumeUrl: string | null;
}

export interface AboutData {
  photoUrl: string;
  photoAlt: string;
  biography: string; // max 300 words
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface WorkEntry {
  company: string;
  jobTitle: string;
  startDate: string;   // ISO date string, e.g. "2021-03"
  endDate: string | null; // null means "Present"
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string; // max 100 words
  technologies: string[];
  demoUrl: string | null;
  repoUrl: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
}

export interface ContactData {
  socialLinks: SocialLink[];
}

export interface SeoConfig {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

export type Theme = 'light' | 'dark';
export type SectionId = 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';
```

### `portfolio.data.ts` — Data constants

```typescript
export const HERO_DATA: HeroData = { ... };
export const ABOUT_DATA: AboutData = { ... };
export const SKILLS_DATA: SkillCategory[] = [ /* ≥3 categories */ ];
export const EXPERIENCE_DATA: WorkEntry[] = [ /* reverse-chron sorted */ ];
export const PROJECTS_DATA: Project[] = [ ... ];
export const CONTACT_DATA: ContactData = { socialLinks: [ /* GitHub, LinkedIn, + 1 */ ] };
export const HOME_SEO: SeoConfig = { ... };
```

---

## Services

### `ThemeService` (`core/services/theme.service.ts`)

**Responsibilities:**
- Exposes `theme = signal<Theme>('light')`
- On init (browser only): reads `localStorage.getItem('theme')`, falls back to `window.matchMedia('(prefers-color-scheme: dark)')`, sets initial theme
- `toggle()`: flips theme, persists to `localStorage`, applies/removes `dark` class on `<html>`
- SSR guard: all `window`/`localStorage` access wrapped in `isPlatformBrowser(platformId)` check

**Tailwind dark mode:** Configured via `darkMode: 'class'` in Tailwind config (v4 uses CSS `@variant dark (.dark &)` or the `dark` class on `<html>`).

### `SeoService` (`core/services/seo.service.ts`)

**Responsibilities:**
- Injects Angular `Title` and `Meta` services
- `updateSeo(config: SeoConfig)`: sets `<title>`, `<meta name="description">`, and all four OG tags
- Called from `HomePageComponent.ngOnInit()`

### `ScrollService` (`core/services/scroll.service.ts`)

**Responsibilities:**
- `scrollTo(sectionId: SectionId)`: calls `document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })`
- SSR guard: wrapped in `isPlatformBrowser(platformId)` check

---

## Theming Strategy

Tailwind CSS v4 uses CSS custom properties for theming. The approach:

1. Define a CSS layer in `styles.css` with light-mode custom properties as defaults.
2. Use the `.dark` class on `<html>` to override with dark-mode values.
3. `ThemeService` adds/removes the `dark` class on `document.documentElement`.

```css
/* styles.css */
@import 'tailwindcss';

@layer base {
  :root {
    --color-bg: oklch(98% 0 0);
    --color-text: oklch(15% 0 0);
    --color-primary: oklch(55% 0.2 260);
    /* ... */
  }
  .dark {
    --color-bg: oklch(12% 0 0);
    --color-text: oklch(95% 0 0);
    --color-primary: oklch(70% 0.2 260);
    /* ... */
  }
}
```

Tailwind v4 CSS variable theme tokens are referenced in component classes via `bg-(--color-bg)`, `text-(--color-text)`, etc.

---

## SSR Strategy

The scaffold already configures `RenderMode.Prerender` for `**`. Since the portfolio has a single route (`/`) with no dynamic data, full prerendering at build time is the correct strategy.

**Key SSR rules enforced in code:**
- `ThemeService`, `ScrollService`, and `IntersectionObserver` usage are all guarded with `isPlatformBrowser(this.platformId)`.
- `DOCUMENT` injection token is used instead of direct `document` access where needed.
- No `window` access outside platform checks.
- `ContactFormComponent` submission handler is browser-only (form submission has no server-side effect in this static portfolio).

**Hydration:** `provideClientHydration(withEventReplay())` is already configured, ensuring smooth transition from server-rendered HTML to interactive Angular app.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The portfolio has several areas where property-based testing adds value: data transformation (sorting, conditional rendering), form validation logic, theme state management, and SEO tag generation. The test runner is Vitest (already in `devDependencies`). The property-based testing library used is **fast-check** (to be added as a dev dependency).

### Property 1: Experience entries are always in reverse chronological order

*For any* array of `WorkEntry` objects with varying `startDate` values, the `sortExperienceEntries` utility function SHALL return them sorted with the most recent `startDate` first.

**Validates: Requirements 5.1**

---

### Property 2: "Present" is displayed for any entry with a null end date

*For any* `WorkEntry` where `endDate` is `null`, the `formatEndDate` utility function SHALL return the string `"Present"`.

**Validates: Requirements 5.5**

---

### Property 3: Contact form rejects any combination of empty required fields

*For any* combination of empty/whitespace-only values for `name`, `email`, and `message`, submitting the `ContactFormComponent` SHALL leave `form.valid` as `false` and SHALL not emit a success state.

**Validates: Requirements 7.2**

---

### Property 4: Contact form rejects any invalid email string

*For any* string that does not conform to a valid email address format, the `email` form control SHALL be in an invalid state when that string is set as its value.

**Validates: Requirements 7.3**

---

### Property 5: Theme toggle is an involution (toggling twice returns to original state)

*For any* initial theme value (`'light'` or `'dark'`), calling `ThemeService.toggle()` twice SHALL return the theme to its original value.

**Validates: Requirements 8.2**

---

### Property 6: Theme toggle aria-label always reflects the opposite of the current theme

*For any* current theme state, the `aria-label` on the theme toggle button SHALL describe switching to the *other* theme (not the current one).

**Validates: Requirements 8.5**

---

### Property 7: SEO service sets all required Open Graph tags for any SeoConfig

*For any* valid `SeoConfig` object, calling `SeoService.updateSeo(config)` SHALL result in `og:title`, `og:description`, `og:image`, and `og:url` meta tags all being present in the document with values matching the config.

**Validates: Requirements 9.4**

---

### Property 8: All external links have target="_blank" and rel="noopener noreferrer"

*For any* `Project` or `SocialLink` with a non-null URL, the rendered anchor element SHALL have `target="_blank"` and `rel="noopener noreferrer"`.

**Validates: Requirements 6.4, 7.6**

---

### Property 9: Active section signal reflects the currently intersecting section

*For any* sequence of section IDs reported as intersecting by the `IntersectionObserver`, the `activeSection` signal in `NavigationBarComponent` SHALL always equal the most recently reported intersecting section ID.

**Validates: Requirements 1.4**

---

## Error Handling

| Scenario | Handling |
|---|---|
| Profile photo fails to load | `(error)` handler on `<img>` sets `src` to a local SVG fallback avatar |
| Resume URL is null/undefined | `@if (hero.resumeUrl)` hides the download button entirely |
| Contact form submission (no backend) | Form shows success state immediately (static portfolio — no real HTTP call); a `ContactService` stub can be swapped for a real endpoint later |
| SSR accessing browser APIs | All browser-only code guarded with `isPlatformBrowser(platformId)` |
| Unknown route | `app.routes.ts` redirects `**` to `''` |

---

## Testing Strategy

### Unit Tests (Vitest)

Unit tests cover specific examples, edge cases, and error conditions for:

- `ThemeService`: initial theme detection (localStorage present, localStorage absent + prefers-dark, localStorage absent + prefers-light), toggle behavior, localStorage persistence
- `SeoService`: correct title and meta tag values set for a given `SeoConfig`
- `ScrollService`: `scrollTo` calls `scrollIntoView` on the correct element (browser), is a no-op on server
- `sortExperienceEntries` utility: correct ordering with various date inputs
- `formatEndDate` utility: returns "Present" for null, returns formatted date string for non-null
- `ContactFormComponent`: valid/invalid form states, success state after submission, form reset
- `NavigationBarComponent`: hamburger toggle, active section signal update
- `HeroSectionComponent`: resume button visibility based on `resumeUrl`
- `AboutSectionComponent`: fallback avatar on image error

### Property-Based Tests (fast-check + Vitest)

Each property from the Correctness Properties section is implemented as a single property-based test with a minimum of 100 iterations.

| Test | Property | fast-check Arbitraries |
|---|---|---|
| Experience sort | Property 1 | `fc.array(fc.record({ startDate: fc.date(), ... }))` |
| Present end date | Property 2 | `fc.record({ endDate: fc.constant(null), ... })` |
| Form empty field rejection | Property 3 | `fc.record({ name: fc.string(), email: fc.string(), message: fc.string() })` filtered to invalid combos |
| Email validation | Property 4 | `fc.string()` filtered to non-email strings |
| Theme toggle involution | Property 5 | `fc.constantFrom('light', 'dark')` |
| Theme aria-label | Property 6 | `fc.constantFrom('light', 'dark')` |
| SEO OG tags | Property 7 | `fc.record({ title: fc.string(), description: fc.string(), ogImage: fc.webUrl(), ogUrl: fc.webUrl(), ... })` |
| External link attributes | Property 8 | `fc.record({ demoUrl: fc.webUrl(), repoUrl: fc.webUrl() })` |
| Active section signal | Property 9 | `fc.array(fc.constantFrom('hero','about','skills','experience','projects','contact'))` |

### Integration / Smoke Tests

- SSR pre-render: build the app and verify the output `index.html` contains section headings (smoke test)
- Lighthouse CI: run against production build in CI pipeline (SEO ≥ 90, Performance ≥ 90)
