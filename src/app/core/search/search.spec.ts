import { describe, it, expect } from 'vitest';
import { SEARCH_INDEX, search } from './search';

describe('search', () => {
  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([]);
  });

  it('ranks an exact title match first', () => {
    expect(search('redis')[0].title).toBe('Redis');
    expect(search('cv')[0].target).toEqual({ kind: 'route', path: '/cv' });
  });

  it('requires every word to match', () => {
    const results = search('arduino paddle');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => `${r.title} ${r.subtitle} ${r.keywords}`.toLowerCase().includes('arduino'))).toBe(true);
  });

  it('links projects without a detail page to where they live', () => {
    const snake = search('snake').find(r => r.title === 'Snake');
    expect(snake?.target).toEqual({ kind: 'route', path: '/games' });
    const cf = search('codeforces').find(r => r.title === 'Codeforces');
    expect(cf?.target.kind).toBe('url');
  });

  it('indexes CV education', () => {
    expect(search('american international')[0].group).toBe('CV');
    expect(search('cgpa')).toEqual([]);
  });

  it('does not list a skill twice', () => {
    const titles = SEARCH_INDEX.filter(i => i.group === 'Skills').map(i => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('does not duplicate projects that also appear in the CV', () => {
    expect(search('paddle').map(r => r.title)).toEqual(['TUI Table Tennis Paddle']);
  });
});
