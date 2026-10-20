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
  name: 'Akib Ashfaq',
  title: 'Software Engineer',
  tagline:
    'I build and maintain large-scale .NET systems, with a focus on clean architecture, performance and maintainable domain models.',
  resumeUrl: '/AkibAshfaq_CV.pdf',
  company: 'Bdjobs Ltd',
  location: 'Dhaka, Bangladesh',
};

export const ABOUT_DATA: AboutData = {
  biography: `I'm a Software Engineer at Bdjobs Ltd in Dhaka, Bangladesh, where I work on a large-scale, high-traffic platform built on .NET. My day-to-day work is backend engineering: designing APIs, server-side logic and data access that hold up under real production load.

I care about architecture that stays maintainable as a system grows. I work with modular monolith design, keeping clear module boundaries inside a single deployable, and with Domain-Driven Design to model the business with bounded contexts, aggregates and a shared ubiquitous language.

My toolbox centres on C# and .NET, with MongoDB and SQL Server for persistence, Redis for caching, and a Git Flow branching workflow for disciplined releases. Outside work I study at AIUB, solve algorithmic problems on Codeforces and experiment with IoT hardware like the ESP32.`
};

export const SKILLS_DATA: SkillCategory[] = [
  {
    name: '.NET & C#',
    skills: ['C#', '.NET', 'ASP.NET Core', 'Web API', 'Entity Framework Core', 'LINQ', 'WinForms'],
  },
  {
    name: 'Architecture & Design',
    skills: ['Modular Monolith', 'Domain-Driven Design', 'Bounded Contexts', 'Clean Architecture', 'REST APIs', 'Large-scale systems'],
  },
  {
    name: 'Databases & Caching',
    skills: ['MongoDB', 'Redis', 'SQL Server', 'MySQL'],
  },
  {
    name: 'Programming Languages',
    skills: ['C#', 'TypeScript', 'JavaScript', 'Java', 'Kotlin', 'PHP', 'C++'],
  },
  {
    name: 'Web & Frontend',
    skills: ['Angular', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    name: 'Tools & Workflow',
    skills: ['Git', 'Git Flow', 'GitHub', 'Google Cloud Console', 'Visual Studio', 'VS Code'],
  },
];

export const EXPERIENCE_DATA: WorkEntry[] = [
  {
    company: 'Bdjobs Ltd',
    jobTitle: 'Software Engineer',
    startDate: '2026-08',
    endDate: null,
    responsibilities: [
      'Develop and maintain features on a large-scale, high-traffic .NET platform.',
      'Build backend services and APIs in C# / ASP.NET Core following a modular monolith architecture.',
      'Apply Domain-Driven Design to model business logic with bounded contexts and aggregates.',
      'Work with MongoDB for persistence and Redis for caching to keep responses fast under load.',
      'Ship through a Git Flow branching and release workflow, and manage services in Google Cloud Console.',
    ],
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    name: 'My Portfolio',
    slug: 'my-portfolio',
    description:
      'A personal developer portfolio built with Angular 21, SSR, and Tailwind CSS. Features smooth scrolling, dark mode, accessible design, and server-side rendering for fast load and SEO.',
    technologies: ['Angular', 'TypeScript', 'Tailwind CSS', 'Angular SSR', 'Express'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/My_Portfolio',
    role: 'Full-Stack Developer',
    architecture:
      'Angular standalone components with SSR via Angular Universal and Express. Tailwind CSS 4 for styling with a custom CSS variable-based design system for theming. Data is centralized in a typed data layer and injected via service classes.',
    features: [
      'Dark/light theme toggle with localStorage persistence and system preference detection',
      'Server-side rendering (SSR) with Angular Universal for SEO and fast initial load',
      'Smooth scroll navigation with active section tracking via IntersectionObserver',
      'Fully responsive design with mobile-first Tailwind CSS utilities',
      'WCAG 2.1 AA accessible markup with semantic HTML and ARIA attributes',
      'Reactive contact form with validation using Angular Reactive Forms',
    ],
    projectType: 'web',
  },
  {
    name: 'AIUB App',
    slug: 'aiub-app',
    description:
      'An Android application for AIUB (American International University — Bangladesh) student portal management. Built in Kotlin with Material Design 3 offering a seamless mobile university experience.',
    technologies: ['Kotlin', 'Android', 'Material Design 3', 'Jetpack Navigation', 'Android Studio'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/AIUB-App',
    role: 'Android Developer',
    architecture:
      'Native Android application built in Kotlin using the single-activity pattern with Jetpack Navigation Component. Material Design 3 components provide the UI layer. ViewModels manage UI state and Retrofit handles API communication with the university backend.',
    features: [
      'Multi-screen navigation with Android Jetpack Navigation Component',
      'Material Design 3 UI with consistent theming and components',
      'Student portal features for course and university management',
      'Clean, maintainable Kotlin codebase following Android best practices',
    ],
    projectType: 'mobile',
  },
  {
    name: 'DeskShop',
    slug: 'deskshop',
    description:
      'A Windows desktop e-commerce application built as a C# university course project. Features product catalog, shopping cart, and order management with a SQL Server database backend.',
    technologies: ['C#', 'WinForms', '.NET', 'SQL Server', 'LINQ'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/DeskShop',
    role: 'Desktop Developer',
    architecture:
      'Windows Forms application built with C# .NET. The UI layer consists of WinForms controls with a data access layer using ADO.NET and LINQ to SQL for database operations. SQL Server is the backend database storing products, users, and order data.',
    features: [
      'Product catalog browsing with search and category filters',
      'Shopping cart with item management and quantity control',
      'Checkout flow and order history for users',
      'SQL Server database with normalized schema for products, orders, and users',
      'LINQ queries for efficient data retrieval and filtering',
      'Event-driven UI with WinForms controls and custom validators',
    ],
    projectType: 'desktop',
  },
  {
    name: 'E-Commerce Management Portal',
    slug: 'ecommerce-portal',
    description:
      'A web-based e-commerce management and accountant portal built with PHP and MySQL. Includes product inventory, sales tracking, and financial reporting for business administrators.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'HTML5', 'CSS3'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/E-Commarce-Managment-Accountant-Portal',
    role: 'Web Developer',
    architecture:
      'Server-side PHP application with a MySQL database. Uses a simple MVC-like structure with PHP controllers handling requests, MySQL for data persistence, and a Bootstrap-powered HTML/CSS/JS frontend. Sessions manage authentication.',
    features: [
      'Product inventory management with add, edit, and delete operations',
      'Sales tracking dashboard with transaction history',
      'Financial reporting and accountant portal for revenue summaries',
      'User authentication with session management',
      'Responsive admin dashboard built with Bootstrap',
      'MySQL relational schema for products, orders, and transactions',
    ],
    projectType: 'web',
  },
  {
    name: 'Java Streaming Platform',
    slug: 'java-streaming-platform',
    description:
      'A backend media streaming platform developed in Java. Implements content management and streaming logic using object-oriented design principles and the Java Collections API.',
    technologies: ['Java', 'OOP', 'Java I/O', 'Collections API'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/JAVA-STREAMING-PLATFORM',
    role: 'Backend Developer',
    architecture:
      'Pure Java application following object-oriented design principles. Classes are organized into domain models (content, users, playlists) and service layers for business logic. Java Collections handle in-memory data management.',
    features: [
      'Media content management and streaming logic',
      'User playlist and library management',
      'Object-oriented domain model with clean separation of concerns',
      'Java Collections API for efficient in-memory data handling',
    ],
    projectType: 'backend',
  },
  {
    name: 'Advanced .NET Programming',
    slug: 'advanced-dotnet',
    description:
      'A collection of advanced C# and .NET programming exercises covering LINQ, multithreading, generics, delegates, and design patterns from an AIUB university course.',
    technologies: ['C#', '.NET', 'LINQ', 'WinForms', 'ADO.NET', 'JavaScript'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/Advanced-Programming-in-.NET',
    role: '.NET Developer',
    architecture:
      'A set of standalone C# projects each demonstrating a specific .NET concept. WinForms projects illustrate UI patterns while console projects explore language features like delegates, generics, and LINQ.',
    features: [
      'LINQ queries for data transformation and filtering',
      'Multithreading and async programming exercises',
      'Generic classes and delegate patterns',
      'Design pattern implementations (factory, observer, etc.)',
      'ADO.NET database access examples',
    ],
    projectType: 'desktop',
  },
  {
    name: 'HTML Calculator',
    slug: 'html-calculator',
    description:
      'An interactive browser-based calculator built with pure HTML, CSS, and JavaScript. Supports basic arithmetic with a clean, keyboard-friendly UI. Deployed to GitHub Pages.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    demoUrl: 'https://akibashfaq.github.io/HTML-Calculator-With-JS/',
    repoUrl: 'https://github.com/AkibAshfaq/HTML-Calculator-With-JS',
    role: 'Frontend Developer',
    architecture:
      'Single-page vanilla JavaScript application. Calculator state is managed in JS with the DOM updated on each button press. CSS Grid is used for the button layout.',
    features: [
      'Basic arithmetic: addition, subtraction, multiplication, division',
      'Decimal number support and clear/reset functionality',
      'Keyboard input support for faster usage',
      'Deployed to GitHub Pages for live access',
    ],
    projectType: 'web',
  },
];

export const CONTACT_DATA: ContactData = {
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/AkibAshfaq',
      ariaLabel: 'Visit Akib Ashfaq on GitHub',
    },
    {
      platform: 'Email',
      url: 'mailto:akibash.dev@gmail.com',
      ariaLabel: 'Send an email to Akib Ashfaq',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/AkibAshfaq',
      ariaLabel: 'Connect with Akib Ashfaq on LinkedIn',
    },
  ],
};

export const HOME_SEO: SeoConfig = {
  title: 'Akib Ashfaq',
  description:
    'Akib Ashfaq — Software Engineer at Bdjobs Ltd, Dhaka. .NET, modular monolith and Domain-Driven Design, MongoDB, Redis, large-scale systems.',
  ogTitle: 'Akib Ashfaq — Software Engineer (.NET)',
  ogDescription:
    'Software Engineer at Bdjobs Ltd building large-scale .NET systems with modular monolith architecture and Domain-Driven Design.',
  ogImage: 'https://avatars.githubusercontent.com/u/183318977?v=4',
  ogUrl: 'https://akibashfaq.dev',
};
