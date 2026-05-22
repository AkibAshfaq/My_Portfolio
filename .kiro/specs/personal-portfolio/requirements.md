# Requirements Document

## Introduction

This document defines the requirements for a personal portfolio website built with Angular 21 and SSR (Angular Universal via `@angular/ssr`). The portfolio showcases the developer's identity, skills, work experience, projects, and contact information. It is a single-page application with smooth in-page navigation, server-side rendering for SEO and performance, and a responsive design powered by Tailwind CSS v4.

## Glossary

- **Portfolio_App**: The Angular 21 SSR application that serves the personal portfolio website.
- **Hero_Section**: The top-most section of the page displaying the developer's name, title, and a call-to-action.
- **About_Section**: The section presenting a short biography and a profile photo.
- **Skills_Section**: The section listing the developer's technical skills grouped by category.
- **Experience_Section**: The section displaying the developer's work history in chronological order.
- **Projects_Section**: The section showcasing selected projects with descriptions and links.
- **Contact_Section**: The section providing a contact form and social/professional links.
- **Navigation_Bar**: The fixed top navigation component that links to each section.
- **Theme_Toggle**: The UI control that switches between light and dark color themes.
- **SSR_Renderer**: The Angular Universal server-side rendering engine powered by `@angular/ssr` and Express.
- **SEO_Service**: The Angular service responsible for setting page metadata (title, description, Open Graph tags).
- **Contact_Form**: The reactive form in the Contact_Section used to send messages.
- **Smooth_Scroll**: The browser behavior of animating the viewport to a target section anchor.
- **Visitor**: Any person accessing the portfolio website via a browser.

---

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a Visitor, I want a persistent navigation bar with links to each section, so that I can jump to any part of the portfolio without scrolling manually.

#### Acceptance Criteria

1. THE Portfolio_App SHALL render a Navigation_Bar that is fixed to the top of the viewport at all times.
2. THE Navigation_Bar SHALL contain anchor links for Hero, About, Skills, Experience, Projects, and Contact sections.
3. WHEN a Visitor clicks a Navigation_Bar anchor link, THE Portfolio_App SHALL trigger Smooth_Scroll to the corresponding section.
4. WHILE the Visitor scrolls past a section boundary, THE Navigation_Bar SHALL highlight the anchor link corresponding to the currently visible section.
5. THE Navigation_Bar SHALL be fully accessible, with each link having a descriptive `aria-label` and keyboard focus support.
6. WHEN the viewport width is less than 768px, THE Navigation_Bar SHALL collapse into a hamburger menu that expands on activation.

---

### Requirement 2: Hero Section

**User Story:** As a Visitor, I want to see the developer's name, professional title, and a brief tagline immediately on page load, so that I understand who this portfolio belongs to and what they do.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the developer's full name, professional title, and a one-sentence tagline.
2. THE Hero_Section SHALL include a call-to-action button that, when activated, triggers Smooth_Scroll to the Projects_Section.
3. THE Hero_Section SHALL include a secondary button that links to a downloadable résumé file.
4. WHEN the résumé file is not available, THE Hero_Section SHALL hide the résumé download button.
5. THE Hero_Section SHALL occupy at least the full viewport height on initial load.

---

### Requirement 3: About Section

**User Story:** As a Visitor, I want to read a short biography and see a profile photo, so that I can learn about the developer's background and personality.

#### Acceptance Criteria

1. THE About_Section SHALL display a profile photo with a descriptive `alt` attribute.
2. THE About_Section SHALL display a biography of no more than 300 words.
3. WHEN the profile photo fails to load, THE About_Section SHALL display a fallback avatar placeholder.
4. THE About_Section SHALL be laid out in a two-column grid on viewports wider than 768px and a single column on narrower viewports.

---

### Requirement 4: Skills Section

**User Story:** As a Visitor, I want to see the developer's technical skills organized by category, so that I can quickly assess their expertise.

#### Acceptance Criteria

1. THE Skills_Section SHALL display skills grouped into named categories (e.g., Frontend, Backend, Tools).
2. THE Skills_Section SHALL render each skill as a labeled badge or chip element.
3. THE Skills_Section SHALL display at least three skill categories.
4. THE Skills_Section SHALL be driven by a data structure defined in a TypeScript model, not hardcoded in the template.

---

### Requirement 5: Experience Section

**User Story:** As a Visitor, I want to see the developer's work history in reverse chronological order, so that I can evaluate their professional background.

#### Acceptance Criteria

1. THE Experience_Section SHALL display work entries in reverse chronological order (most recent first).
2. EACH work entry SHALL include the company name, job title, employment period (start and end dates or "Present"), and a list of responsibilities or achievements.
3. THE Experience_Section SHALL render entries using a vertical timeline layout.
4. THE Experience_Section SHALL be driven by a typed TypeScript data model, not hardcoded in the template.
5. WHEN the employment end date is absent, THE Experience_Section SHALL display "Present" as the end date.

---

### Requirement 6: Projects Section

**User Story:** As a Visitor, I want to browse the developer's selected projects with descriptions and links, so that I can evaluate the quality and breadth of their work.

#### Acceptance Criteria

1. THE Projects_Section SHALL display a grid of project cards, with at least two columns on viewports wider than 768px.
2. EACH project card SHALL include the project name, a short description (no more than 100 words), a technology tag list, and at least one link (live demo or source repository).
3. WHEN a project has both a live demo link and a source repository link, THE Projects_Section SHALL display both links on the project card.
4. WHEN a project link is external, THE Portfolio_App SHALL open it in a new browser tab with `rel="noopener noreferrer"`.
5. THE Projects_Section SHALL be driven by a typed TypeScript data model, not hardcoded in the template.

---

### Requirement 7: Contact Section

**User Story:** As a Visitor, I want to send a message to the developer and find their social/professional links, so that I can get in touch.

#### Acceptance Criteria

1. THE Contact_Section SHALL render a Contact_Form with fields for the sender's name, email address, and message body.
2. WHEN the Visitor submits the Contact_Form with an empty required field, THE Contact_Form SHALL display an inline validation error message for each empty field without submitting.
3. WHEN the Visitor submits the Contact_Form with an invalid email address format, THE Contact_Form SHALL display an inline validation error message for the email field without submitting.
4. WHEN the Visitor submits a valid Contact_Form, THE Contact_Form SHALL display a success confirmation message and reset all fields.
5. THE Contact_Section SHALL display links to the developer's GitHub, LinkedIn, and at least one other professional profile.
6. EACH social link SHALL open in a new browser tab with `rel="noopener noreferrer"`.
7. THE Contact_Form SHALL be implemented as an Angular reactive form.

---

### Requirement 8: Theme Toggle (Light / Dark Mode)

**User Story:** As a Visitor, I want to switch between light and dark color themes, so that I can view the portfolio in my preferred visual mode.

#### Acceptance Criteria

1. THE Portfolio_App SHALL provide a Theme_Toggle control accessible from the Navigation_Bar.
2. WHEN the Visitor activates the Theme_Toggle, THE Portfolio_App SHALL switch the active color theme between light and dark.
3. WHEN the Portfolio_App first loads, THE Portfolio_App SHALL apply the color theme that matches the Visitor's OS-level `prefers-color-scheme` setting.
4. WHEN the Visitor has previously selected a theme, THE Portfolio_App SHALL restore that theme preference on subsequent visits using `localStorage`.
5. THE Theme_Toggle SHALL have an accessible `aria-label` that reflects the current state (e.g., "Switch to dark mode").

---

### Requirement 9: Server-Side Rendering and SEO

**User Story:** As a developer, I want the portfolio to be server-side rendered and properly tagged for search engines, so that it ranks well and previews correctly when shared on social media.

#### Acceptance Criteria

1. THE SSR_Renderer SHALL pre-render the full HTML of each route on the server before sending it to the browser.
2. THE SEO_Service SHALL set a unique `<title>` tag for each route.
3. THE SEO_Service SHALL set `<meta name="description">` with a relevant description for each route.
4. THE SEO_Service SHALL set Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) for each route.
5. WHEN the Portfolio_App is rendered on the server, THE SSR_Renderer SHALL not access browser-only APIs (e.g., `window`, `document`) without a platform check.
6. THE Portfolio_App SHALL achieve a Lighthouse SEO score of 90 or above when measured against the production build.

---

### Requirement 10: Responsive Design and Accessibility

**User Story:** As a Visitor, I want the portfolio to look and work correctly on any device and be usable with assistive technologies, so that I have a good experience regardless of how I access it.

#### Acceptance Criteria

1. THE Portfolio_App SHALL be fully responsive across viewport widths from 320px to 2560px.
2. THE Portfolio_App SHALL pass WCAG 2.1 Level AA color contrast requirements for all text and interactive elements.
3. THE Portfolio_App SHALL be fully navigable using only a keyboard, with a visible focus indicator on all interactive elements.
4. THE Portfolio_App SHALL include appropriate ARIA landmark roles (`main`, `nav`, `section`, `footer`) on all major layout regions.
5. THE Portfolio_App SHALL render all images with non-empty `alt` attributes.
6. WHEN a Visitor uses a screen reader, THE Portfolio_App SHALL announce section headings and interactive element labels correctly.

---

### Requirement 11: Performance

**User Story:** As a Visitor, I want the portfolio to load quickly, so that I am not kept waiting and have a smooth browsing experience.

#### Acceptance Criteria

1. THE Portfolio_App SHALL achieve a Lighthouse Performance score of 90 or above on the production build.
2. THE Portfolio_App SHALL lazy-load images that are below the initial viewport fold using the `loading="lazy"` attribute.
3. THE Portfolio_App SHALL use Angular's built-in lazy loading for any feature routes added in the future.
4. THE Portfolio_App SHALL serve static assets with appropriate cache-control headers via the Express SSR server.
