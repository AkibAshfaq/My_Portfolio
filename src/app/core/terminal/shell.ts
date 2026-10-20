import {
  ABOUT_DATA,
  CONTACT_DATA,
  EXPERIENCE_DATA,
  HERO_DATA,
  PROJECTS_DATA,
  SKILLS_DATA,
} from '../models/portfolio.data';
import type { GitHubStats, SectionId, Theme } from '../models/portfolio.models';
import { formatEndDate, sortExperienceEntries } from '../utils/experience.utils';

/** One rendered line of terminal output. */
export interface ShellLine {
  text: string;
  tone?: 'muted' | 'accent' | 'info' | 'warn' | 'error' | 'command';
  /** External link opened in a new tab when the line is clicked. */
  href?: string;
  /** Command executed when the line is clicked. */
  run?: string;
}

export interface ShellResult {
  lines: ShellLine[];
  /** Clear the screen before printing. */
  clear?: boolean;
}

/** Side effects a command may trigger. Implemented by the terminal component. */
export interface ShellContext {
  scrollTo(section: SectionId): void;
  navigate(path: string): void;
  openUrl(url: string): void;
  setTheme(theme: Theme): void;
  theme(): Theme;
  close(): void;
  history(): readonly string[];
  github(): GitHubStats | undefined;
  now(): Date;
}

export const EMAIL = 'akibash.dev@gmail.com';
export const GITHUB_URL = CONTACT_DATA.socialLinks.find(l => l.platform === 'GitHub')!.url;
export const LINKEDIN_URL = CONTACT_DATA.socialLinks.find(l => l.platform === 'LinkedIn')!.url;
export const CODEFORCES_URL = 'https://codeforces.com/profile/AkibAshfaq';
export const LEETCODE_URL = 'https://leetcode.com/u/AkibAshfaq';
export const PROMPT = 'akib@portfolio:~$';

const SECTIONS: Record<string, SectionId> = {
  '~': 'hero',
  home: 'hero',
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  journey: 'experience',
  projects: 'projects',
  contact: 'contact',
};

const LINKS: Record<string, string> = {
  github: GITHUB_URL,
  linkedin: LINKEDIN_URL,
  codeforces: CODEFORCES_URL,
  leetcode: LEETCODE_URL,
};

interface CommandDef {
  usage: string;
  summary: string;
  run(args: string[], ctx: ShellContext): ShellResult;
}

const out = (...lines: (string | ShellLine)[]): ShellResult => ({
  lines: lines.map(l => (typeof l === 'string' ? { text: l } : l)),
});
const err = (text: string): ShellResult => out({ text, tone: 'error' });
const pad = (s: string, n: number) => s.padEnd(n, ' ');

function findProject(query: string) {
  const q = query.toLowerCase();
  const n = Number(q);
  if (Number.isInteger(n) && n >= 1 && n <= PROJECTS_DATA.length) {
    return PROJECTS_DATA[n - 1];
  }
  return PROJECTS_DATA.find(p => p.slug === q || p.name.toLowerCase() === q);
}

function openTarget(target: string, ctx: ShellContext): ShellResult {
  const t = target.toLowerCase();
  if (LINKS[t]) {
    ctx.openUrl(LINKS[t]);
    return out({ text: `Opening ${LINKS[t]} …`, tone: 'muted' });
  }
  if (t === 'email' || t === 'mail') {
    return COMMANDS['mail'].run([], ctx);
  }
  if (t === 'cv' || t === 'resume') {
    return COMMANDS['cv'].run([], ctx);
  }
  if (t === 'games') {
    return COMMANDS['games'].run([], ctx);
  }
  const project = findProject(t);
  if (project) {
    ctx.navigate(`/projects/${project.slug}`);
    ctx.close();
    return out({ text: `Opening ~/projects/${project.slug} …`, tone: 'muted' });
  }
  return err(`open: no such target '${target}'. Try 'projects' or 'open github'.`);
}

export const COMMANDS: Record<string, CommandDef> = {
  help: {
    usage: 'help',
    summary: 'List available commands',
    run: () =>
      out(
        { text: 'Available commands', tone: 'accent' },
        ...Object.entries(COMMANDS)
          .filter(([name]) => !HIDDEN.has(name))
          .map(([, c]) => ({ text: `  ${pad(c.usage, 20)} ${c.summary}`, run: c.usage.split(' ')[0] })),
        { text: '' },
        { text: 'Tip: Tab completes, ↑/↓ browses history, Ctrl+L clears.', tone: 'muted' },
      ),
  },
  whoami: {
    usage: 'whoami',
    summary: 'Name, role and status',
    run: () =>
      out(
        { text: HERO_DATA.name, tone: 'accent' },
        `${HERO_DATA.title} · ${HERO_DATA.location}`,
        HERO_DATA.tagline,
        {
          text: HERO_DATA.openToWork
            ? 'status: open to internships and entry-level roles'
            : 'status: not currently looking',
          tone: 'info',
        },
      ),
  },
  about: {
    usage: 'about',
    summary: 'Short biography',
    run: (_args, ctx) => {
      ctx.scrollTo('about');
      return out(...ABOUT_DATA.biography.split('\n\n').flatMap((p, i) => (i ? ['', p] : [p])));
    },
  },
  skills: {
    usage: 'skills',
    summary: 'Technical skills by category',
    run: () =>
      out(
        ...SKILLS_DATA.flatMap(c => [
          { text: `# ${c.name}`, tone: 'warn' as const },
          `  ${c.skills.join(', ')}`,
        ]),
      ),
  },
  experience: {
    usage: 'experience',
    summary: 'Projects and milestones timeline',
    run: () =>
      out(
        ...sortExperienceEntries(EXPERIENCE_DATA).map(e => ({
          text: `${pad(`${e.startDate} → ${formatEndDate(e.endDate)}`, 22)} ${e.jobTitle} — ${e.company}`,
        })),
      ),
  },
  projects: {
    usage: 'projects',
    summary: 'List projects (click one to open)',
    run: () =>
      out(
        ...PROJECTS_DATA.map((p, i) => ({
          text: `  ${i + 1}. ${pad(p.slug, 24)} ${p.technologies.slice(0, 2).join(', ')}`,
          run: `open ${p.slug}`,
        })),
        { text: '' },
        { text: "Run 'open <number|name>' for details.", tone: 'muted' },
      ),
  },
  open: {
    usage: 'open <target>',
    summary: 'Open a project, cv, github, linkedin …',
    run: (args, ctx) =>
      args.length ? openTarget(args.join(' '), ctx) : err('usage: open <project|cv|github|linkedin|email>'),
  },
  cd: {
    usage: 'cd <section>',
    summary: 'Jump to a page section',
    run: (args, ctx) => {
      const target = (args[0] ?? '~').replace(/\/$/, '').toLowerCase();
      if (target === 'games') {
        return COMMANDS['games'].run([], ctx);
      }
      const id = SECTIONS[target];
      if (!id) {
        return err(`cd: no such section: ${args[0]}`);
      }
      ctx.scrollTo(id);
      return { lines: [] };
    },
  },
  ls: {
    usage: 'ls',
    summary: 'List sections and files',
    run: () =>
      out(
        ...['about/', 'skills/', 'experience/', 'projects/', 'contact/', 'games/'].map(d => ({
          text: d,
          tone: 'info' as const,
          run: `cd ${d}`,
        })),
        { text: 'cv.pdf', run: 'cv' },
      ),
  },
  cv: {
    usage: 'cv',
    summary: 'Download my CV (PDF)',
    run: (_args, ctx) => {
      if (!HERO_DATA.resumeUrl) {
        return err('cv: not available right now');
      }
      ctx.openUrl(HERO_DATA.resumeUrl);
      return out({ text: 'Opening AkibAshfaq_CV.pdf …', tone: 'muted' });
    },
  },
  contact: {
    usage: 'contact',
    summary: 'Email and social links',
    run: () =>
      out(
        { text: `email     ${EMAIL}`, href: `mailto:${EMAIL}` },
        { text: `github    ${GITHUB_URL}`, href: GITHUB_URL },
        { text: `linkedin  ${LINKEDIN_URL}`, href: LINKEDIN_URL },
        { text: '' },
        { text: "Run 'mail <message>' to write to me.", tone: 'muted' },
      ),
  },
  mail: {
    usage: 'mail [message]',
    summary: 'Compose an email to me',
    run: (args, ctx) => {
      const body = args.join(' ');
      const subject = encodeURIComponent('Hello Akib — from your portfolio');
      ctx.openUrl(`mailto:${EMAIL}?subject=${subject}${body ? `&body=${encodeURIComponent(body)}` : ''}`);
      return out({ text: `Opening your mail app → ${EMAIL}`, tone: 'muted' });
    },
  },
  github: {
    usage: 'github',
    summary: 'Live GitHub stats',
    run: (_args, ctx) => {
      const gh = ctx.github();
      if (!gh) {
        return out({ text: 'Fetching stats from api.github.com … try again in a moment.', tone: 'muted' });
      }
      return out(
        { text: GITHUB_URL, href: GITHUB_URL, tone: 'info' },
        `repos       ${gh.publicRepos}`,
        `languages   ${gh.languages.join(', ')}`,
        `stars       ${gh.totalStars}`,
        `followers   ${gh.followers}`,
        `since       ${gh.memberSince}`,
      );
    },
  },
  games: {
    usage: 'games',
    summary: 'Play the browser games I built',
    run: (_args, ctx) => {
      ctx.navigate('/games');
      ctx.close();
      return out({ text: 'Launching ~/games …', tone: 'muted' });
    },
  },
  theme: {
    usage: 'theme [light|dark]',
    summary: 'Switch colour theme',
    run: (args, ctx) => {
      const want = args[0]?.toLowerCase();
      if (want && want !== 'light' && want !== 'dark') {
        return err('usage: theme [light|dark]');
      }
      const next: Theme = (want as Theme) ?? (ctx.theme() === 'dark' ? 'light' : 'dark');
      ctx.setTheme(next);
      return out({ text: `theme set to ${next}`, tone: 'muted' });
    },
  },
  history: {
    usage: 'history',
    summary: 'Show command history',
    run: (_args, ctx) =>
      out(...ctx.history().map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}`, run: h }))),
  },
  clear: {
    usage: 'clear',
    summary: 'Clear the screen',
    run: () => ({ lines: [], clear: true }),
  },
  // ── Hidden conveniences ──────────────────────────────
  pwd: { usage: 'pwd', summary: '', run: () => out('/home/akib/portfolio') },
  date: { usage: 'date', summary: '', run: (_a, ctx) => out(ctx.now().toString()) },
  echo: { usage: 'echo', summary: '', run: args => out(args.join(' ')) },
  resume: { usage: 'resume', summary: '', run: (a, ctx) => COMMANDS['cv'].run(a, ctx) },
  exit: {
    usage: 'exit',
    summary: '',
    run: (_a, ctx) => {
      ctx.close();
      return { lines: [] };
    },
  },
  sudo: {
    usage: 'sudo',
    summary: '',
    run: () =>
      out({ text: "akib is not in the sudoers file. You can still hire him — try 'contact'.", tone: 'warn' }),
  },
};

const HIDDEN = new Set(['pwd', 'date', 'echo', 'resume', 'exit', 'sudo']);

/** Splits input on whitespace, respecting "double" or 'single' quotes. */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    tokens.push(m[1] ?? m[2] ?? m[3]);
  }
  return tokens;
}

export function runCommand(input: string, ctx: ShellContext): ShellResult {
  const [name, ...args] = tokenize(input.trim());
  if (!name) {
    return { lines: [] };
  }
  const cmd = COMMANDS[name.toLowerCase()];
  if (!cmd) {
    return err(`command not found: ${name}. Type 'help' to see what you can run.`);
  }
  return cmd.run(args, ctx);
}

/** Returns the possible completions for the current input. */
export function complete(input: string): string[] {
  const tokens = input.split(/\s+/);
  if (tokens.length <= 1) {
    const prefix = tokens[0].toLowerCase();
    return Object.keys(COMMANDS).filter(c => !HIDDEN.has(c) && c.startsWith(prefix));
  }
  const [cmd, partial] = [tokens[0].toLowerCase(), tokens[tokens.length - 1].toLowerCase()];
  const pool: Record<string, string[]> = {
    cd: [...Object.keys(SECTIONS).filter(s => s !== '~' && s !== 'hero'), 'games'],
    open: [...PROJECTS_DATA.map(p => p.slug), 'cv', 'email', ...Object.keys(LINKS)],
    theme: ['light', 'dark'],
  };
  const head = tokens.slice(0, -1).join(' ');
  return (pool[cmd] ?? []).filter(o => o.startsWith(partial)).map(o => `${head} ${o}`);
}

/** Longest common prefix — used to extend input when several completions match. */
export function commonPrefix(options: string[]): string {
  if (!options.length) return '';
  return options.reduce((acc, o) => {
    let i = 0;
    while (i < acc.length && i < o.length && acc[i] === o[i]) i++;
    return acc.slice(0, i);
  });
}
