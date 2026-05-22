# Implementation Plan: Personal Portfolio

## Overview

Implement the Angular 21 SSR personal portfolio by building from the inside out: data models and services first, then shared components, then section components, then the layout shell, and finally wiring everything together. Each task builds directly on the previous one. All code is TypeScript with Angular 21 standalone components and Tailwind CSS v4.

## Tasks

- [x] 1. Install fast-check and set up the data model layer
  - Run `npm install --save-dev fast-check@3` to add the property-based testing library
  - Create `src/app/core/models/portfolio.models.ts` with all TypeScript interfaces: `HeroData`, `AboutData`, `SkillCategory`, `WorkEntry`, `Project`, `SocialLink`, `ContactData`, `SeoConfig`, `Theme`, `SectionId`
  - Create `src/app/core/models/portfolio.data.ts` with exported constants: `HERO_DATA`, `ABOUT_DATA`, `SKILLS_DATA` (≥3 categories), `EXPERIENCE_DATA` (≥2 entries), `PROJECTS_DATA` (≥2 projects), `CONTACT_DATA` (GitHub, LinkedIn, + 1 other), `HOME_SEO`
  - Create `src/app/core/models/index.ts` barrel export
  - _Requirements: 2.1, 2.3, 3.1, 3.2, 4.1, 4.3, 5.1, 5.2, 6.2, 7.5, 9.2_

- [x] 2. Implement utility functions and core services
  - [x] 2.1 Create `src/app/core/utils/experience.utils.ts` with `sortExperienceEntries(entries: WorkEntry[]): WorkEntry[]` (sort by `startDate` descending) and `formatEndDate(endDate: string | null): string` (returns `"Present"` when null)
    - _Requirements: 5.1, 5.5_

  - [ ]* 2.2 Write property tests for experience utilities
    - **Property 1: Experience entries are always in reverse chronological order**
    - **Validates: Requirements 5.1**
    - **Property 2: "Present" is displayed for any entry with a null end date**
    - **Validates: Requirements 5.5**
    - Use `fc.array(fc.record(...))` arbitraries; minimum 100 iterations each

  - [x] 2.3 Implement `ThemeService` at `src/app/core/services/theme.service.ts`
    - Expose `theme = signal<Theme>('light')`
    - On init (browser only via `isPlatformBrowser`): read `localStorage.getItem('theme')`, fall back to `window.matchMedia('(prefers-color-scheme: dark)')`, set initial theme
    - `toggle()`: flip theme, persist to `localStorage`, add/remove `dark` class on `document.documentElement`
    - All `window`/`localStorage`/`document` access guarded with `isPlatformBrowser(platformId)`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.5_

  - [ ]* 2.4 Write unit and property tests for ThemeService
    - Unit: initial theme from localStorage, initial theme from prefers-dark, initial theme defaults to light
    - Unit: toggle flips theme and persists to localStorage
    - **Property 5: Theme toggle is an involution (toggling twice returns to original state)**
    - **Validates: Requirements 8.2**
    - **Property 6: Theme toggle aria-label always reflects the opposite of the current theme**
    - **Validates: Requirements 8.5**

  - [x] 2.5 Implement `SeoService` at `src/app/core/services/seo.service.ts`
    - Inject Angular `Title` and `Meta` services
    - `updateSeo(config: SeoConfig)`: call `Title.setTitle(config.title)`, set `<meta name="description">`, set `og:title`, `og:description`, `og:image`, `og:url`
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]* 2.6 Write unit and property tests for SeoService
    - Unit: correct title set for a given config
    - Unit: correct description meta tag set
    - **Property 7: SEO service sets all required Open Graph tags for any SeoConfig**
    - **Validates: Requirements 9.4**

  - [x] 2.7 Implement `ScrollService` at `src/app/core/services/scroll.service.ts`
    - `scrollTo(sectionId: SectionId)`: call `document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })`
    - Guard with `isPlatformBrowser(platformId)`; no-op on server
    - _Requirements: 1.3, 2.2, 9.5_

  - [ ]* 2.8 Write unit tests for ScrollService
    - Test that `scrollTo` calls `scrollIntoView` on the correct element in browser context
    - Test that `scrollTo` is a no-op in server context

- [x] 3. Checkpoint — Ensure all tests pass
  - Run `npx vitest --run` and confirm all tests pass. Ask the user if any questions arise.

- [x] 4. Configure Tailwind CSS v4 theming and global styles
  - Update `src/styles.css` to define CSS custom properties for light and dark themes inside `@layer base`: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-primary-hover`, `--color-border`
  - Add `.dark { ... }` overrides for all custom properties
  - Set `background-color` and `color` on `body` using the custom properties
  - Update `src/index.html`: add `lang="en"` (already present), ensure `<body>` has no conflicting styles
  - _Requirements: 8.2, 10.2_

- [x] 5. Implement shared components
  - [x] 5.1 Create `SkillBadgeComponent` at `src/app/shared/components/skill-badge/`
    - Input: `label = input.required<string>()`
    - Template: `<span role="listitem" class="...">{{ label() }}</span>`
    - Tailwind classes for pill/chip styling using CSS custom properties
    - _Requirements: 4.2_

  - [x] 5.2 Create `TimelineEntryComponent` at `src/app/shared/components/timeline-entry/`
    - Input: `entry = input.required<WorkEntry>()`
    - Template: renders company, jobTitle, formatted date range (using `formatEndDate`), and responsibilities list
    - Vertical timeline visual treatment via Tailwind (left border, dot marker)
    - _Requirements: 5.2, 5.3, 5.5_

  - [x] 5.3 Create `ProjectCardComponent` at `src/app/shared/components/project-card/`
    - Input: `project = input.required<Project>()`
    - Template: renders name, description, technology tags, demo link (if `demoUrl` non-null), repo link (if `repoUrl` non-null)
    - All links: `target="_blank" rel="noopener noreferrer"`
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 5.4 Write property tests for ProjectCardComponent
    - **Property 8: All external links have target="_blank" and rel="noopener noreferrer"**
    - **Validates: Requirements 6.4, 7.6**
    - Use `fc.record({ demoUrl: fc.webUrl(), repoUrl: fc.webUrl() })` arbitraries

- [ ] 6. Implement section components
  - [-] 6.1 Create `HeroSectionComponent` at `src/app/sections/hero/`
    - Inject `ScrollService`; CTA button calls `scrollService.scrollTo('projects')`
    - Render `HERO_DATA.name`, `title`, `tagline`
    - Conditionally render resume download button: `@if (hero.resumeUrl) { <a [href]="hero.resumeUrl" download>...</a> }`
    - Section: `id="hero"`, `aria-label="Hero"`, `role="region"`, `class="min-h-screen ..."`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 6.2 Write unit tests for HeroSectionComponent
    - Test resume button is rendered when `resumeUrl` is non-null
    - Test resume button is hidden when `resumeUrl` is null
    - Test CTA button click calls `scrollService.scrollTo('projects')`

  - [-] 6.3 Create `AboutSectionComponent` at `src/app/sections/about/`
    - Render `ABOUT_DATA.photoUrl` in `<img>` with `[alt]="about.photoAlt"` and `loading="lazy"`
    - Add `(error)` handler that sets `src` to a local fallback SVG path
    - Render `ABOUT_DATA.biography` in a `<p>`
    - Layout: `class="grid md:grid-cols-2 gap-8"` for two-column on ≥768px
    - Section: `id="about"`, `aria-label="About"`, `role="region"`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 6.4 Write unit tests for AboutSectionComponent
    - Test profile photo renders with correct alt attribute
    - Test fallback avatar is shown when image `error` event fires

  - [-] 6.5 Create `SkillsSectionComponent` at `src/app/sections/skills/`
    - Iterate `SKILLS_DATA` with `@for (category of skills; track category.name)`
    - Render category name as `<h3>` and skills as `<app-skill-badge>` chips
    - Section: `id="skills"`, `aria-label="Skills"`, `role="region"`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [-] 6.6 Create `ExperienceSectionComponent` at `src/app/sections/experience/`
    - Sort `EXPERIENCE_DATA` using `sortExperienceEntries()` in the component
    - Render each entry as `<app-timeline-entry [entry]="entry">`
    - Section: `id="experience"`, `aria-label="Experience"`, `role="region"`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [-] 6.7 Create `ProjectsSectionComponent` at `src/app/sections/projects/`
    - Render `PROJECTS_DATA` in a `class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"` grid
    - Each project rendered as `<app-project-card [project]="project">`
    - Section: `id="projects"`, `aria-label="Projects"`, `role="region"`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 6.8 Create `ContactFormComponent` at `src/app/sections/contact/contact-form/`
    - Inject `FormBuilder`; define reactive form with `name` (required), `email` (required + email validator), `message` (required)
    - `submitted = signal(false)`, `success = signal(false)`
    - On submit: mark all controls touched, check `form.valid`; if valid set `success(true)` and `form.reset()`
    - Template: show inline error messages using `@if (form.get('field')?.invalid && submitted())`
    - Show success confirmation block when `success()` is true
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7_

  - [ ]* 6.9 Write unit and property tests for ContactFormComponent
    - Unit: success state shown and form reset after valid submission
    - Unit: form is invalid when all fields are empty
    - **Property 3: Contact form rejects any combination of empty required fields**
    - **Validates: Requirements 7.2**
    - **Property 4: Contact form rejects any invalid email string**
    - **Validates: Requirements 7.3**

  - [~] 6.10 Create `ContactSectionComponent` at `src/app/sections/contact/`
    - Render `<app-contact-form />`
    - Render social links from `CONTACT_DATA.socialLinks` with `target="_blank" rel="noopener noreferrer"`
    - Section: `id="contact"`, `aria-label="Contact"`, `role="region"`
    - _Requirements: 7.1, 7.5, 7.6_

- [~] 7. Checkpoint — Ensure all tests pass
  - Run `npx vitest --run` and confirm all tests pass. Ask the user if any questions arise.

- [ ] 8. Implement the NavigationBarComponent
  - [~] 8.1 Create `NavigationBarComponent` at `src/app/layout/navbar/`
    - Define `SECTION_LINKS` array: `[{ id: 'hero', label: 'Home' }, { id: 'about', label: 'About' }, ...]`
    - `activeSection = signal<SectionId>('hero')`, `menuOpen = signal<boolean>(false)`
    - In `ngAfterViewInit` (browser only): create `IntersectionObserver` observing each `section[id]` element; on intersection update `activeSection`
    - Render nav links with `[class.active]="activeSection() === link.id"`, `(click)="scrollService.scrollTo(link.id)"`, `[attr.aria-label]="link.label"`
    - Hamburger button: `class="md:hidden"`, `(click)="menuOpen.update(v => !v)"`, `aria-label="Open navigation menu"`
    - Mobile menu: `@if (menuOpen())` block with vertical link list
    - Include `<app-theme-toggle />` in the nav
    - `role="navigation"`, `aria-label="Main navigation"`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 8.2 Write unit and property tests for NavigationBarComponent
    - Unit: hamburger button toggles `menuOpen` signal
    - Unit: nav contains links for all six sections
    - Unit: each link has an `aria-label` attribute
    - **Property 9: Active section signal reflects the currently intersecting section**
    - **Validates: Requirements 1.4**

  - [~] 8.3 Create `ThemeToggleComponent` at `src/app/layout/navbar/theme-toggle/`
    - Inject `ThemeService`
    - Button: `(click)="themeService.toggle()"`, `[attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"`
    - Render sun icon when dark, moon icon when light (inline SVG or Tailwind icon)
    - _Requirements: 8.1, 8.2, 8.5_

- [ ] 9. Implement the FooterComponent and HomePageComponent
  - [~] 9.1 Create `FooterComponent` at `src/app/layout/footer/`
    - Render a `<footer role="contentinfo">` with copyright text and optionally a back-to-top link
    - _Requirements: 10.4_

  - [~] 9.2 Create `HomePageComponent` at `src/app/pages/home/`
    - Compose all six section components: `<app-hero-section>`, `<app-about-section>`, `<app-skills-section>`, `<app-experience-section>`, `<app-projects-section>`, `<app-contact-section>`
    - Inject `SeoService`; call `seoService.updateSeo(HOME_SEO)` in `ngOnInit`
    - Wrap sections in `<main role="main">`
    - _Requirements: 9.2, 9.3, 9.4, 10.4_

- [ ] 10. Wire up AppComponent, routing, and SSR configuration
  - [~] 10.1 Update `src/app/app.routes.ts` to add the home route
    - `{ path: '', component: HomePageComponent }` and `{ path: '**', redirectTo: '' }`
    - _Requirements: 9.1_

  - [~] 10.2 Update `src/app/app.html` to replace the placeholder content
    - Remove all Angular default placeholder HTML
    - Replace with: `<app-navbar />`, `<router-outlet />`, `<app-footer />`
    - _Requirements: 1.1, 10.4_

  - [~] 10.3 Update `src/app/app.ts` to import `NavigationBarComponent`, `FooterComponent`, `RouterOutlet`
    - Remove the `title` signal and placeholder imports
    - _Requirements: 1.1_

  - [~] 10.4 Update `src/app/app.config.ts` to provide `ThemeService` and `SeoService` at root
    - Add `provideHttpClient()` if needed for future contact form backend
    - Confirm `provideClientHydration(withEventReplay())` is present
    - _Requirements: 8.3, 9.1_

  - [~] 10.5 Update `src/index.html` with SEO baseline
    - Add `<meta name="description" content="...">` placeholder (will be overridden by SeoService at runtime)
    - Add `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:url">` placeholder tags
    - Add `<link rel="preconnect">` for any external font if used
    - _Requirements: 9.2, 9.3, 9.4_

  - [~] 10.6 Add `loading="lazy"` to all below-the-fold images
    - Audit all `<img>` elements in section components; hero image (if any) gets `loading="eager"`, all others get `loading="lazy"`
    - _Requirements: 11.2_

  - [~] 10.7 Update `src/server.ts` to add cache-control headers for static assets
    - Add `res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')` for hashed asset routes
    - Add `res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')` for HTML routes
    - _Requirements: 11.4_

- [~] 11. Accessibility and ARIA audit pass
  - Verify every `<section>` has `id`, `aria-label`, and `role="region"`
  - Verify `<nav>` has `role="navigation"` and `aria-label`
  - Verify `<main>` has `role="main"`
  - Verify `<footer>` has `role="contentinfo"`
  - Verify all `<img>` elements have non-empty `alt` attributes
  - Verify all interactive elements have visible focus styles (add `focus-visible:ring-2` Tailwind classes where missing)
  - Verify skip-to-main-content link is present as the first focusable element in `app.html`
  - _Requirements: 10.3, 10.4, 10.5, 10.6_

- [~] 12. Final checkpoint — Ensure all tests pass and build succeeds
  - Run `npx vitest --run` and confirm all tests pass
  - Run `npm run build` and confirm the production build completes without errors
  - Verify `dist/My_Portfolio/browser/index.html` contains pre-rendered section headings (SSR smoke check)
  - Ask the user if any questions arise before considering the implementation complete

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests use **fast-check** with a minimum of 100 iterations per property
- Unit tests use **Vitest** (already configured in `devDependencies`)
- All browser-only APIs (`window`, `localStorage`, `document`, `IntersectionObserver`) must be guarded with `isPlatformBrowser(platformId)` to maintain SSR compatibility
- Tailwind CSS v4 dark mode is implemented via the `dark` class on `<html>`, toggled by `ThemeService`

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2.1", "2.3", "2.5", "2.7"] },
    { "wave": 3, "tasks": ["2.2", "2.4", "2.6", "2.8"] },
    { "wave": 4, "tasks": ["3"] },
    { "wave": 5, "tasks": ["4"] },
    { "wave": 6, "tasks": ["5.1", "5.2", "5.3"] },
    { "wave": 7, "tasks": ["5.4"] },
    { "wave": 8, "tasks": ["6.1", "6.3", "6.5", "6.6", "6.7", "6.8"] },
    { "wave": 9, "tasks": ["6.2", "6.4", "6.9", "6.10"] },
    { "wave": 10, "tasks": ["7"] },
    { "wave": 11, "tasks": ["8.1", "8.3"] },
    { "wave": 12, "tasks": ["8.2"] },
    { "wave": 13, "tasks": ["9.1", "9.2"] },
    { "wave": 14, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7"] },
    { "wave": 15, "tasks": ["11"] },
    { "wave": 16, "tasks": ["12"] }
  ]
}
```
