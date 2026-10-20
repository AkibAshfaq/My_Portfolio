/**
 * Structured CV content for the /cv page. Education, projects, skills and courses
 * mirror public/AkibAshfaq_CV.pdf; summary and experience come from the site's
 * current profile (HERO_DATA / EXPERIENCE_DATA).
 */

export interface CvEducation {
  institution: string;
  degree: string;
  period: string;
  details: { label: string; value: string }[];
}

export interface CvProject {
  name: string;
  url: string;
  stack: string;
  period: string;
  points: string[];
}

export interface CvSkillGroup {
  label: string;
  items: string[];
}

export interface CvCourse {
  name: string;
  period?: string;
}

export const CV_PDF_URL = '/AkibAshfaq_CV.pdf';
export const CV_PDF_FILENAME = 'AkibAshfaq_CV.pdf';
export const CV_WEBSITE = 'https://www.akibashfaq.com';

export const CV_EDUCATION: CvEducation[] = [
  {
    institution: 'American International University-Bangladesh (AIUB)',
    degree: 'Bachelor of Computer Science and Engineering',
    period: 'Expected January 2027',
    details: [
      { label: 'CGPA', value: '3.82 out of 4.00' },
      {
        label: 'Concentration',
        value: 'Software Technologies — backend focus: database design and web API development',
      },
      {
        label: 'Related courses',
        value:
          'Object Oriented Programming with C#, Advanced Programming in .NET, Advanced Database Management System, Web Technologies, Mobile Application Development',
      },
    ],
  },
];

export const CV_PROJECTS: CvProject[] = [
  {
    name: 'ShopingAPI',
    url: 'https://github.com/AkibAshfaq/ShopingAPI',
    stack: 'ASP.NET Core · MySQL · RESTful API',
    period: '18/01/26 – 20/01/26',
    points: [
      'Developed a RESTful API for e-commerce systems including add to cart, remove from cart, checkout, payment and delivery status tracking.',
      'Implemented inventory management features for employees to add and manage products.',
      'Followed a 3-tier architecture for a clean, maintainable and scalable code structure.',
    ],
  },
  {
    name: 'My_Portfolio',
    url: 'https://github.com/AkibAshfaq/My_Portfolio',
    stack: 'Angular 21 · Tailwind CSS · Vite',
    period: '23/05/26 – 28/05/26',
    points: [
      'Built a server-side rendered personal portfolio with Angular 21, TypeScript and Tailwind CSS; Lighthouse SEO/Performance ≥ 90 and WCAG 2.1 AA accessible across screen sizes.',
      'Designed a typed, data-driven architecture with reusable services and an automated test suite.',
      'Built canvas-based browser games in TypeScript, plus a contact form and persistent dark/light theming.',
      'Used Claude AI to assist development and rapidly learn Angular and Tailwind CSS.',
      'Deployed through Vercel at www.akibashfaq.com.',
    ],
  },
  {
    name: 'TUI based tennis paddle',
    url: 'https://github.com/AkibAshfaq/TUI-Based-Table-Tennis-Paddle',
    stack: 'C++ · Arduino',
    period: '16/05/26 – 18/05/26',
    points: [
      'Built a motion-controlled input device by mounting an MPU6050 gyroscope/accelerometer onto a table tennis paddle, mapping real-time motion to mouse cursor movement via the Arduino Mouse library.',
      'Implemented a calibration routine averaging 500 gyroscope samples to cancel sensor drift, with deadzone filtering and exponential smoothing for jitter-free control.',
      'Designed gesture detection for distinct "flick" and "tilt" motions, triggering haptic feedback through a vibration motor with non-blocking timing.',
      'Programmed in embedded C++ with I2C sensor communication (I2Cdev/MPU6050 libraries).',
    ],
  },
  {
    name: 'ECommerce Management System',
    url: 'https://github.com/Akib43/E-Commerce-Managment-System-Web-',
    stack: 'HTML · CSS · JavaScript · PHP · MySQL',
    period: '26/09/25 – 19/10/25',
    points: [
      'Developed an e-commerce management system with Customer, HR, Accountant and Delivery Man roles in a team of 4.',
      'Designed and developed the accountant portal: product value, revenue, stock value, employee salary, expenses and invoice generation.',
      'Collaborated through a separate GitHub account: github.com/Akib43.',
    ],
  },
  {
    name: 'Snake Game',
    url: 'https://github.com/AkibAshfaq/Snake-Game-With-JS',
    stack: 'HTML · CSS · JavaScript',
    period: '28/09/25 – 29/09/25',
    points: ['Used the JS canvas to draw the 2D space, a constant-speed snake and random food spawn points.'],
  },
  {
    name: 'DeskShop',
    url: 'https://github.com/AkibAshfaq/DeskShop',
    stack: 'C# WinForms · MySQL',
    period: '13/01/25 – 23/02/25',
    points: [
      'Developed a full e-commerce desktop application with inventory management and an HR management system.',
      'Designed the UI with WinForms components and implemented functionality in C# using object-oriented programming.',
      'Integrated a MySQL database using Visual Studio 2022 for data storage and management.',
    ],
  },
];

export const CV_SKILLS: CvSkillGroup[] = [
  { label: 'Languages', items: ['C', 'C++', 'C#', 'Java', 'Kotlin', 'Python', 'PHP', 'SQL', 'PL/SQL', 'HTML', 'CSS', 'JavaScript'] },
  { label: 'Architecture', items: ['Modular Monolith', 'Domain-Driven Design', '3-Tier Architecture', 'RESTful APIs'] },
  { label: 'Data & caching', items: ['MongoDB', 'Redis', 'SQL Server', 'MySQL', 'Oracle', 'Firebase'] },
  { label: 'Frameworks', items: ['.NET', 'ASP.NET Core', 'Angular', 'Java Swing', 'OpenGL (GLUT)'] },
  { label: 'Developer tools', items: ['Git', 'Git Flow', 'Visual Studio', 'Android Studio', 'Postman', 'SSMS', 'Google Cloud Console', 'XAMPP'] },
  { label: 'Operating systems', items: ['Windows', 'Ubuntu', 'Debian', 'Fedora'] },
];

export const CV_COURSES: CvCourse[] = [
  { name: 'IT Essentials: PC Hardware and Software', period: 'Fall 2022' },
  { name: 'CS50: Introduction to Computer Science — Harvard University (edX)' },
];
