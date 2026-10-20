import { EXPERIENCE_DATA, PROJECTS_DATA, PROJECT_CATEGORIES, SKILLS_DATA } from '../models/portfolio.data';
import { CV_COURSES, CV_EDUCATION, CV_PROJECTS } from '../models/cv.data';
import type { SectionId } from '../models/portfolio.models';
import { hasDetailPage } from '../utils/project.utils';

export type SearchTarget =
  | { kind: 'section'; id: SectionId }
  | { kind: 'route'; path: string }
  | { kind: 'url'; url: string };

export interface SearchItem {
  title: string;
  subtitle: string;
  group: 'Sections' | 'Pages' | 'Projects' | 'Skills' | 'Experience' | 'CV' | 'Contact';
  keywords: string;
  target: SearchTarget;
}

const section = (id: SectionId): SearchTarget => ({ kind: 'section', id });
const route = (path: string): SearchTarget => ({ kind: 'route', path });
const url = (u: string): SearchTarget => ({ kind: 'url', url: u });

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [
    { title: 'Home', subtitle: 'Summary, role and interactive terminal', group: 'Sections', keywords: 'hero top intro bio about me summary', target: section('hero') },
    { title: 'Skills', subtitle: 'Languages, frameworks and tools', group: 'Sections', keywords: 'stack technologies tech', target: section('skills') },
    { title: 'Experience', subtitle: 'Work history', group: 'Sections', keywords: 'job work career employment bdjobs', target: section('experience') },
    { title: 'Projects', subtitle: 'All projects by category', group: 'Sections', keywords: 'portfolio work side projects beyond the code', target: section('projects') },
    { title: 'Contact', subtitle: 'Email, links and message composer', group: 'Sections', keywords: 'email mail hire reach message', target: section('contact') },
    { title: 'CV', subtitle: 'Full CV with PDF download', group: 'Pages', keywords: 'resume curriculum vitae pdf download education', target: route('/cv') },
    { title: 'Games', subtitle: 'Snake, Mario Run and Road Rush', group: 'Pages', keywords: 'play canvas fun', target: route('/games') },
    { title: 'Email', subtitle: 'akibash.dev@gmail.com', group: 'Contact', keywords: 'mail contact', target: section('contact') },
    { title: 'GitHub', subtitle: 'github.com/AkibAshfaq', group: 'Contact', keywords: 'code repos source', target: url('https://github.com/AkibAshfaq') },
    { title: 'LinkedIn', subtitle: 'linkedin.com/in/akib-ashfaq-dev', group: 'Contact', keywords: 'profile network', target: url('https://www.linkedin.com/in/akib-ashfaq-dev') },
  ];

  for (const p of PROJECTS_DATA) {
    const category = PROJECT_CATEGORIES.find(c => c.value === p.projectType)?.label ?? '';
    const target = hasDetailPage(p)
      ? route(`/projects/${p.slug}`)
      : p.playRoute
        ? route(p.playRoute)
        : url((p.profileUrl ?? p.repoUrl ?? p.demoUrl)!);
    items.push({
      title: p.name,
      subtitle: `${category} · ${p.technologies.slice(0, 3).join(', ')}`,
      group: 'Projects',
      keywords: `${p.slug} ${p.role} ${p.technologies.join(' ')} ${p.description} ${category}`,
      target,
    });
  }

  const seen = new Set<string>();
  for (const cat of SKILLS_DATA) {
    for (const skill of cat.skills) {
      if (seen.has(skill)) continue;
      seen.add(skill);
      items.push({ title: skill, subtitle: cat.name, group: 'Skills', keywords: cat.name, target: section('skills') });
    }
  }

  for (const e of EXPERIENCE_DATA) {
    items.push({
      title: `${e.jobTitle} — ${e.company}`,
      subtitle: `${e.startDate} → ${e.endDate ?? 'Present'}`,
      group: 'Experience',
      keywords: e.responsibilities.join(' '),
      target: section('experience'),
    });
  }

  for (const edu of CV_EDUCATION) {
    items.push({
      title: edu.institution,
      subtitle: edu.degree,
      group: 'CV',
      keywords: 'education university degree studied aiub computer science',
      target: route('/cv'),
    });
  }
  for (const c of CV_COURSES) {
    items.push({ title: c.name, subtitle: 'Additional course', group: 'CV', keywords: 'course certificate', target: route('/cv') });
  }
  for (const p of CV_PROJECTS) {
    if (PROJECTS_DATA.some(sp => sp.repoUrl === p.url || sp.name.toLowerCase() === p.name.toLowerCase())) continue;
    items.push({ title: p.name, subtitle: `CV project · ${p.stack}`, group: 'CV', keywords: p.points.join(' '), target: route('/cv') });
  }

  return items;
}

export const SEARCH_INDEX: readonly SearchItem[] = buildIndex();

/**
 * Every query word must appear somewhere in the item. Title matches rank above
 * subtitle/keyword matches; a title that starts with the query ranks highest.
 */
export function search(query: string, limit = 12, index: readonly SearchItem[] = SEARCH_INDEX): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);

  return index
    .map(item => {
      const title = item.title.toLowerCase();
      const hay = `${title} ${item.subtitle} ${item.keywords}`.toLowerCase();
      if (!words.every(w => hay.includes(w))) return null;
      let score = 0;
      if (title === q) score += 100;
      if (title.startsWith(q)) score += 50;
      score += words.filter(w => title.includes(w)).length * 10;
      if (item.group === 'Sections' || item.group === 'Pages') score += 5;
      return { item, score };
    })
    .filter((r): r is { item: SearchItem; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);
}
