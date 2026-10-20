import { describe, it, expect, vi } from 'vitest';
import { commonPrefix, complete, runCommand, tokenize, type ShellContext } from './shell';

function fakeCtx(overrides: Partial<ShellContext> = {}): ShellContext {
  return {
    scrollTo: vi.fn(),
    navigate: vi.fn(),
    openUrl: vi.fn(),
    setTheme: vi.fn(),
    theme: () => 'dark',
    close: vi.fn(),
    history: () => ['help', 'whoami'],
    github: () => undefined,
    now: () => new Date('2026-10-20T10:00:00Z'),
    ...overrides,
  };
}

describe('shell', () => {
  it('tokenizes quoted arguments', () => {
    expect(tokenize(`mail "hi there" ok`)).toEqual(['mail', 'hi there', 'ok']);
  });

  it('reports unknown commands', () => {
    const res = runCommand('rm -rf /', fakeCtx());
    expect(res.lines[0].tone).toBe('error');
    expect(res.lines[0].text).toContain('command not found: rm');
  });

  it('is case-insensitive for command names', () => {
    expect(runCommand('WHOAMI', fakeCtx()).lines[0].text).toBe('Akib Ashfaq');
  });

  it('scrolls to a section with cd', () => {
    const ctx = fakeCtx();
    runCommand('cd projects/', ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('projects');
  });

  it('opens a project by number and by slug', () => {
    const ctx = fakeCtx();
    runCommand('open 1', ctx);
    runCommand('open deskshop', ctx);
    expect(ctx.navigate).toHaveBeenNthCalledWith(1, '/projects/my-portfolio');
    expect(ctx.navigate).toHaveBeenNthCalledWith(2, '/projects/deskshop');
  });

  it('builds a mailto link with an encoded body', () => {
    const ctx = fakeCtx();
    runCommand('mail Hello & welcome', ctx);
    const url = (ctx.openUrl as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url.startsWith('mailto:akibash.dev@gmail.com?subject=')).toBe(true);
    expect(url).toContain('body=Hello%20%26%20welcome');
  });

  it('toggles theme when no argument is given', () => {
    const ctx = fakeCtx();
    runCommand('theme', ctx);
    expect(ctx.setTheme).toHaveBeenCalledWith('light');
  });

  it('clear returns the clear flag', () => {
    expect(runCommand('clear', fakeCtx()).clear).toBe(true);
  });

  it('completes commands and arguments', () => {
    expect(complete('pro')).toEqual(['projects']);
    expect(complete('open desk')).toEqual(['open deskshop']);
    expect(complete('cd sk')).toEqual(['cd skills']);
    expect(commonPrefix(['contact', 'cv', 'cd'])).toBe('c');
  });

  it('cv opens the CV page and cv --download opens the PDF', () => {
    const ctx = fakeCtx();
    runCommand('cv', ctx);
    runCommand('cv --download', ctx);
    expect(ctx.navigate).toHaveBeenCalledWith('/cv');
    expect(ctx.openUrl).toHaveBeenCalledWith('/AkibAshfaq_CV.pdf');
  });

  it('opens projects without a detail page where they live', () => {
    const ctx = fakeCtx();
    runCommand('open snake', ctx);
    runCommand('open codeforces', ctx);
    expect(ctx.navigate).toHaveBeenCalledWith('/games?play=snake#snake');
    expect(ctx.openUrl).toHaveBeenCalledWith('https://codeforces.com/profile/AkibAshfaq');
  });

  it('search lists results and opens one by number', () => {
    const ctx = fakeCtx();
    const res = runCommand('search mongodb', ctx);
    expect(res.lines[0].text).toContain('MongoDB');
    runCommand('search 1', ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('skills');
  });

  it('play launches a game by id or bin name and lists games otherwise', () => {
    const ctx = fakeCtx();
    runCommand('play mario-run', ctx);
    expect(ctx.navigate).toHaveBeenCalledWith('/games?play=mario#mario');
    const list = runCommand('play', ctx);
    expect(list.lines.some(l => l.run === 'play road')).toBe(true);
    expect(complete('play sn')).toEqual(['play snake']);
  });
});
