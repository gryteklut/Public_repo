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
    .sort(
      (a, b) =>
        (a.data.session ?? a.data.day ?? 0) - (b.data.session ?? b.data.day ?? 0),
    );
}

export async function getCourseDay(slug: string, sessionNumber: number) {
  const days = await getCourseDays(slug);
  return days.find(
    (d) => (d.data.session ?? d.data.day) === sessionNumber,
  );
}

export function sessionPath(courseSlug: string, sessionNumber: number): string {
  return `/courses/${courseSlug}/session-${sessionNumber}/`;
}

export function weeksIn(sessions: { data: { week: number } }[]): number {
  return sessions.reduce((max, session) => Math.max(max, session.data.week), 1);
}

export async function getCourseNav(): Promise<{ label: string; href: string }[]> {
  const courses = await getCourses();
  return [
    { label: "Hub", href: "/" },
    { label: "Courses", href: "/courses/" },
    ...courses
      .filter((course) => course.data.status === "live")
      .map((course) => ({
        label: course.data.code,
        href: `/courses/${courseSlugFromId(course.id)}/`,
      })),
  ];
}
