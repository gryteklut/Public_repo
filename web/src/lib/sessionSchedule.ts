/** Old 10-day plans → the session that now holds that topic. */
/** Sessions that were written over AB-650 days, mapped back to the original day. */
export const AB650_SESSION_TO_DAY: Record<string, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "6": "5",
  "7": "6",
  "8": "7",
  "9": "8",
  "11": "9",
  "15": "10",
};

export const LEGACY_DAY_TO_SESSION: Record<string, Record<string, string>> = {
  "AZ-140": {
    "1": "1",
    "2": "4",
    "3": "2",
    "4": "3",
    "5": "6",
    "6": "7",
    "7": "9",
    "8": "11",
    "9": "12",
    "10": "13",
  },
};

/** Finish date for `remaining` one-hour sessions, counting today when it is a weekday. */
export function estimateFinishDate(
  remaining: number,
  today = new Date(),
): Date | null {
  if (remaining <= 0) return null;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let left = remaining;
  while (left > 0) {
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) left -= 1;
    if (left === 0) return cursor;
    cursor.setDate(cursor.getDate() + 1);
  }
  return cursor;
}

export function formatFinishDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
