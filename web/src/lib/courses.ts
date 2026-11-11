import { getCollection, type CollectionEntry } from "astro:content";

export type CourseEntry = CollectionEntry<"courses">;
export type DayEntry = CollectionEntry<"courseDays">;

export function courseSlugFromId(id: string): string {
  // ids look like "ab-650/course" or "ab-650/days/01-tenant-foundations"
  return id.split("/")[0] ?? id;
}

export function dayFileSlug(id: string): string {
  const parts = id.split("/");
  return parts[parts.length - 1] ?? id;
}

export async function getCourses() {
  const all = await getCollection("courses");
  return all
    .filter((c) => courseSlugFromId(c.id) !== "_template")
    .sort((a, b) => a.data.code.localeCompare(b.data.code));
}

export async function getCourse(slug: string) {
  const all = await getCollection("courses");
  return all.find((c) => courseSlugFromId(c.id) === slug);
}

export async function getCourseDays(slug: string) {
  const all = await getCollection("courseDays");
  return all
    .filter((d) => courseSlugFromId(d.id) === slug)
    .sort((a, b) => a.data.day - b.data.day);
}

export async function getCourseDay(slug: string, dayNumber: number) {
  const days = await getCourseDays(slug);
  return days.find((d) => d.data.day === dayNumber);
}

export function dayPath(courseSlug: string, dayNumber: number): string {
  return `/courses/${courseSlug}/day-${dayNumber}/`;
}
