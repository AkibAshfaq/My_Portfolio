import type {
  ProjectType,
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
  location: 'Dhaka, Bangladesh',
};

export const ABOUT_DATA: AboutData = {
  biography: `I am a Software Engineer based in Dhaka, contributing to a large-scale, high-traffic platform built on .NET. My work centres on backend engineering: designing APIs, implementing business logic and building data-access layers that perform reliably under production load.

I focus on architecture that stays maintainable as systems and teams grow. I apply modular monolith principles to keep clear module boundaries within a single deployable, and Domain-Driven Design to model complex business domains through bounded contexts, aggregates and a shared ubiquitous language.

My core stack is C# and ASP.NET Core, with MongoDB and SQL Server for persistence and Redis for caching, delivered through a disciplined Git Flow release process. I studied Computer Science and Engineering at American International University-Bangladesh (AIUB), and I continue to sharpen my problem-solving through competitive programming.`
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
  {
    name: 'ShopingAPI',
    slug: 'shoping-api',
    description:
      'A RESTful e-commerce API built with ASP.NET Core and MySQL: cart, checkout, payment and delivery-status tracking, plus inventory management for staff.',
    technologies: ['ASP.NET Core', 'C#', 'MySQL', 'REST API'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/ShopingAPI',
    role: 'Backend Developer',
    architecture:
      'ASP.NET Core Web API organised as a 3-tier application: controllers for the HTTP layer, a service layer for business rules, and a data access layer over MySQL.',
    features: [
      'Add to cart, remove from cart, checkout and payment endpoints',
      'Delivery status tracking for orders',
      'Inventory management so employees can add and manage products',
      '3-tier architecture for a clean, maintainable and scalable code structure',
    ],
    projectType: 'backend',
  },
  {
    name: 'Snake',
    slug: 'snake',
    description: 'Classic snake as a text-mode terminal game — every frame drawn in ASCII. Keyboard and swipe controls.',
    technologies: ['TypeScript', 'ASCII rendering', 'Angular'],
    demoUrl: null,
    repoUrl: null,
    role: 'Game Developer',
    projectType: 'game',
    playId: 'snake',
  },
  {
    name: 'Mario Run',
    slug: 'mario-run',
    description: 'Side-scrolling ASCII runner — jump pits and blocks, stomp enemies and collect coins. Simple grid physics, no engine.',
    technologies: ['TypeScript', 'ASCII rendering', 'Game physics'],
    demoUrl: null,
    repoUrl: null,
    role: 'Game Developer',
    projectType: 'game',
    playId: 'mario',
  },
  {
    name: 'Road Rush',
    slug: 'road-rush',
    description: 'Three-lane ASCII car dodger — traffic speeds up the longer you survive.',
    technologies: ['TypeScript', 'ASCII rendering'],
    demoUrl: null,
    repoUrl: null,
    role: 'Game Developer',
    projectType: 'game',
    playId: 'road',
  },
  {
    name: 'TUI Table Tennis Paddle',
    slug: 'tui-table-tennis-paddle',
    description:
      'A motion-controlled input device: an MPU6050 gyroscope/accelerometer on a table tennis paddle drives the mouse cursor in real time.',
    technologies: ['C++', 'Arduino', 'MPU6050', 'I2C'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/TUI-Based-Table-Tennis-Paddle',
    role: 'Embedded Developer',
    architecture:
      'Embedded C++ on Arduino reading the MPU6050 over I2C (I2Cdev/MPU6050 libraries) and mapping motion data to cursor movement through the Arduino Mouse library.',
    features: [
      'Real-time mapping of paddle motion to mouse cursor movement',
      'Calibration routine averaging 500 gyroscope samples to cancel sensor drift',
      'Deadzone filtering and exponential smoothing for stable, jitter-free control',
      'Gesture detection for distinct "flick" and "tilt" motions from accelerometer deltas',
      'Haptic feedback through a vibration motor with non-blocking timing',
    ],
    projectType: 'iot',
  },
  {
    name: 'ESP32 WiFi Board',
    slug: 'esp32-wifi-board',
    description: 'Wi-Fi connected ESP32 board for remote control and sensor experiments.',
    technologies: ['C++', 'ESP32', 'Wi-Fi'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/Esp32-WIFI-Board',
    role: 'Embedded Developer',
    projectType: 'iot',
  },
  {
    name: 'Smart Agricultural Automation',
    slug: 'smart-agri-automation',
    description: 'Automated soil, temperature and humidity monitoring system for agriculture.',
    technologies: ['C++', 'Arduino', 'Sensors'],
    demoUrl: null,
    repoUrl: 'https://github.com/AkibAshfaq/SMART-AGRICULTURAL-AUTOMATION-SYSTEM',
    role: 'Embedded Developer',
    projectType: 'iot',
  },
  {
    name: 'Codeforces',
    slug: 'codeforces',
    description: 'Rated contests and algorithmic problem sets in C++: sorting, binary search, dynamic programming and graphs.',
    technologies: ['C++', 'Algorithms', 'Data structures'],
    demoUrl: null,
    repoUrl: null,
    role: 'Competitive Programmer',
    projectType: 'competitive',
    profileUrl: 'https://codeforces.com/profile/AkibAshfaq',
  },
  {
    name: 'LeetCode',
    slug: 'leetcode',
    description: 'Data structures and algorithms practice and interview preparation.',
    technologies: ['C++', 'DSA'],
    demoUrl: null,
    repoUrl: null,
    role: 'Competitive Programmer',
    projectType: 'competitive',
    profileUrl: 'https://leetcode.com/u/AkibAshfaq',
  },
];

export const PROJECT_CATEGORIES: { value: ProjectType | 'all'; label: string }[] = [
  { value: 'all', label: 'All projects' },
  { value: 'backend', label: 'Backend & APIs' },
  { value: 'web', label: 'Web' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'game', label: 'Games' },
  { value: 'iot', label: 'IoT & hardware' },
  { value: 'competitive', label: 'Competitive programming' },
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
      url: 'https://www.linkedin.com/in/akib-ashfaq-dev',
      ariaLabel: 'Connect with Akib Ashfaq on LinkedIn',
    },
  ],
};

export const HOME_SEO: SeoConfig = {
  title: 'Akib Ashfaq',
  description:
    'Akib Ashfaq — Software Engineer in Dhaka. .NET, modular monolith and Domain-Driven Design, MongoDB, Redis, large-scale systems.',
  ogTitle: 'Akib Ashfaq — Software Engineer (.NET)',
  ogDescription:
    'Software Engineer building large-scale .NET systems with modular monolith architecture and Domain-Driven Design.',
  ogImage: 'https://avatars.githubusercontent.com/u/183318977?v=4',
  ogUrl: 'https://akibashfaq.dev',
};
