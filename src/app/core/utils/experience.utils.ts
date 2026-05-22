import { WorkEntry } from '../models/portfolio.models';

/**
 * Sorts an array of WorkEntry objects by startDate descending (most recent first).
 * startDate is an ISO date string like "2021-03".
 */
export function sortExperienceEntries(entries: WorkEntry[]): WorkEntry[] {
  return [...entries].sort((a, b) => {
    if (a.startDate > b.startDate) return -1;
    if (a.startDate < b.startDate) return 1;
    return 0;
  });
}

/**
 * Returns "Present" when endDate is null, otherwise returns the endDate string as-is.
 */
export function formatEndDate(endDate: string | null): string {
  return endDate === null ? 'Present' : endDate;
}
