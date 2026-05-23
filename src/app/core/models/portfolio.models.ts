export interface HeroData {
  name: string;
  title: string;
  tagline: string;
  resumeUrl: string | null;
  openToWork: boolean;
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
  startDate: string; // ISO date string, e.g. "2021-03"
  endDate: string | null; // null means "Present"
  responsibilities: string[];
}

export interface Project {
  name: string;
  slug: string;
  description: string;
  technologies: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  role: string;
  architecture: string;
  features: string[];
  projectType: 'web' | 'mobile' | 'desktop' | 'backend' | 'competitive';
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
export type SectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'contact';
