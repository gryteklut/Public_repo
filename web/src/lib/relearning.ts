/**
 * Successive relearning helpers (Rawson & Dunlosky):
 * retrieve to criterion now, then schedule equally spaced relearning sessions.
 * Intervals (days): 2 → 4 → 7 (then stay on 7).
 */

const INTERVAL_DAYS = [2, 4, 7] as const;

export function nextReviewDueAt(
  fromIso: string,
  relearnCount: number,
): string {
  const idx = Math.min(Math.max(relearnCount, 0), INTERVAL_DAYS.length - 1);
  const days = INTERVAL_DAYS[idx];
  const base = new Date(fromIso);
  const due = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  return due.toISOString();
}

export function isReviewDue(reviewDueAt?: string, now = new Date()): boolean {
  if (!reviewDueAt) return false;
  return new Date(reviewDueAt).getTime() <= now.getTime();
}

export function formatReviewDue(reviewDueAt?: string, now = new Date()): string {
  if (!reviewDueAt) return "";
  const due = new Date(reviewDueAt);
  const ms = due.getTime() - now.getTime();
  if (ms <= 0) return "Due now";
  const hours = Math.round(ms / (60 * 60 * 1000));
  if (hours < 48) return `Due in ~${Math.max(1, hours)}h`;
  const days = Math.round(hours / 24);
  return `Due in ~${days}d`;
}
