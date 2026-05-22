import type {
  HeroData,
  AboutData,
  SkillCategory,
  WorkEntry,
  Project,
  ContactData,
  SeoConfig,
} from './portfolio.models';

export const HERO_DATA: HeroData = {
  name: 'Alex Rivera',
  title: 'Full-Stack Software Engineer',
  tagline:
    'I build fast, accessible web applications that solve real problems.',
  resumeUrl: '/assets/resume.pdf',
};

export const ABOUT_DATA: AboutData = {
  photoUrl: '/assets/profile.jpg',
  photoAlt: 'Profile photo of Alex Rivera',
  biography: `I'm a full-stack software engineer with over five years of experience designing and
shipping production-grade web applications. My work spans Angular, React, Node.js, and cloud
infrastructure on AWS and GCP. I care deeply about performance, accessibility, and developer
experience — and I believe the best software is built collaboratively, with empathy for both
users and teammates.

Before moving into software engineering I studied Computer Science at State University, where I
developed a passion for distributed systems and human-computer interaction. Outside of work I
contribute to open-source projects, mentor junior developers, and occasionally write about
front-end architecture on my blog.`,
};

export const SKILLS_DATA: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      'Angular',
      'React',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'RxJS',
    ],
  },
  {
    name: 'Backend',
    skills: [
      'Node.js',
      'Express',
      'NestJS',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'GraphQL',
      'REST APIs',
    ],
  },
  {
    name: 'DevOps & Tools',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'GCP',
      'GitHub Actions',
      'Terraform',
      'Vitest',
      'Jest',
    ],
  },
];

export const EXPERIENCE_DATA: WorkEntry[] = [
  {
    company: 'Acme Corp',
    jobTitle: 'Senior Software Engineer',
    startDate: '2022-06',
    endDate: null,
    responsibilities: [
      'Led migration of a legacy AngularJS application to Angular 17, reducing bundle size by 40%.',
      'Designed and implemented a real-time notification system using WebSockets and Redis Pub/Sub.',
      'Mentored a team of four junior engineers through code reviews and pair-programming sessions.',
      'Collaborated with product and design to define technical requirements for new features.',
    ],
  },
  {
    company: 'Bright Digital Agency',
    jobTitle: 'Software Engineer',
    startDate: '2020-03',
    endDate: '2022-05',
    responsibilities: [
      'Built and maintained client-facing Angular and React applications for e-commerce and SaaS clients.',
      'Developed RESTful APIs with Node.js and Express backed by PostgreSQL.',
      'Improved CI/CD pipelines with GitHub Actions, cutting deployment time from 20 minutes to 5.',
      'Implemented WCAG 2.1 AA accessibility improvements across three major client projects.',
    ],
  },
  {
    company: 'StartupXYZ',
    jobTitle: 'Junior Frontend Developer',
    startDate: '2019-01',
    endDate: '2020-02',
    responsibilities: [
      'Developed responsive UI components in React and TypeScript.',
      'Wrote unit and integration tests with Jest and React Testing Library.',
      'Participated in agile ceremonies and contributed to sprint planning.',
    ],
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    name: 'DevTrack',
    description:
      'A project management tool for small engineering teams featuring Kanban boards, sprint planning, and real-time collaboration. Built with Angular, NestJS, and PostgreSQL. Supports role-based access control and integrates with GitHub for automatic issue linking.',
    technologies: ['Angular', 'NestJS', 'PostgreSQL', 'WebSockets', 'Docker'],
    demoUrl: 'https://devtrack-demo.example.com',
    repoUrl: 'https://github.com/alexrivera/devtrack',
  },
  {
    name: 'OpenWeatherMap CLI',
    description:
      'A command-line tool that fetches and displays weather forecasts using the OpenWeatherMap API. Supports multiple locations, unit preferences, and a 7-day forecast view. Published to npm with full TypeScript typings.',
    technologies: ['Node.js', 'TypeScript', 'Commander.js', 'Axios'],
    demoUrl: null,
    repoUrl: 'https://github.com/alexrivera/weather-cli',
  },
  {
    name: 'AccessiCheck',
    description:
      'A browser extension that audits web pages for WCAG 2.1 AA accessibility violations and provides actionable fix suggestions. Uses axe-core under the hood and presents results in a clean, filterable panel.',
    technologies: ['TypeScript', 'axe-core', 'Chrome Extensions API', 'React'],
    demoUrl: 'https://chrome.google.com/webstore/detail/accessicheck',
    repoUrl: 'https://github.com/alexrivera/accessicheck',
  },
];

export const CONTACT_DATA: ContactData = {
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/alexrivera',
      ariaLabel: 'Visit Alex Rivera on GitHub',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/alexrivera',
      ariaLabel: 'Connect with Alex Rivera on LinkedIn',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/alexrivera_dev',
      ariaLabel: 'Follow Alex Rivera on Twitter',
    },
  ],
};

export const HOME_SEO: SeoConfig = {
  title: 'Alex Rivera — Full-Stack Software Engineer',
  description:
    'Personal portfolio of Alex Rivera, a full-stack software engineer specialising in Angular, Node.js, and cloud infrastructure.',
  ogTitle: 'Alex Rivera — Full-Stack Software Engineer',
  ogDescription:
    'Explore the projects, skills, and experience of Alex Rivera, a full-stack software engineer.',
  ogImage: 'https://alexrivera.dev/assets/og-image.png',
  ogUrl: 'https://alexrivera.dev',
};
