export interface HeroStat {
  label: string;
  /** One or more SVG <path> d-attribute strings (stroke-based, 24×24 viewBox) */
  paths: string[];
}

export interface HeroData {
  name: string;
  title: string;
  tagline: string;
  resumeUrl: string | null;
  openToWork: boolean;
  location: string;
}

/** Live data fetched from the GitHub API. */
export interface GitHubStats {
  publicRepos: number;
  languageCount: number;
  languages: string[];
  followers: number;
  memberSince: string;   // e.g. "Sep 2024"
  avatarUrl: string;
  totalStars: number;
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
