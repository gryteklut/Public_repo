import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const resourceSchema = z.object({
  label: z.string(),
  url: z.string(),
  // learn = docs/articles; course = Learn course/path/module; skillsup = SkillsUp companions
  kind: z.enum(["learn", "course", "skillsup"]).default("learn"),
});

const videoSchema = z.object({
  label: z.string(),
  action: z.enum(["watch", "skim", "skip"]),
  note: z.string().optional(),
  lectures: z.array(z.string()).default([]),
});

const externalSchema = z.object({
  provider: z.string(),
  title: z.string(),
  url: z.string(),
  instructor: z.string().default("John Christopher"),
  instructorUrl: z
    .string()
    .default("https://www.udemy.com/user/john-christopher-32/"),
  note: z.string().optional(),
});

const courses = defineCollection({
  loader: glob({
    pattern: "*/course.yaml",
    base: "./src/content/courses",
  }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    subtitle: z.string(),
    level: z.string(),
    status: z.enum(["live", "soon", "draft"]),
    color: z.string(),
    tags: z.array(z.string()).default([]),
    learn: z.array(z.string()).default([]),
    outOfScope: z.string().optional(),
    /** Non-Microsoft companion (Udemy). Shown on the hub card and course page. */
    external: externalSchema.optional(),
    /** Official labs live at /courses/<slug>/labs/ */
    hasLabs: z.boolean().default(false),
    studyGuide: z.string().optional(),
    /** days = numbered study days. sessions = 1 hour each weekday. */
    format: z.enum(["days", "sessions"]).default("days"),
  }),
});

const courseDays = defineCollection({
  loader: glob({
    pattern: "*/{days,sessions}/*.{md,mdx}",
    base: "./src/content/courses",
  }),
  schema: z.object({
    day: z.number().optional(),
    session: z.number().optional(),
    week: z.number().optional(),
    kind: z.enum(["learn", "review", "mock"]).default("learn"),
    practice: z.boolean().default(false),
    title: z.string(),
    moduleTitle: z.string(),
    moduleId: z.string(),
    minutes: z.number(),
    budget: z
      .array(z.object({ label: z.string(), minutes: z.number() }))
      .default([]),
    /** Cut from the hour. Shown on the week review, not deleted. */
    optional: z.array(z.string()).default([]),
    summary: z.string(),
    /** What this hour includes. Longer lab work stays in the week optional list. */
    hourNote: z.string().optional(),
    focus: z.string(),
    tags: z.array(z.string()).default([]),
    resources: z.array(resourceSchema).default([]),
    videos: z.array(videoSchema).default([]),
    /** Portal-only tips (not duplicated from official MS Learning labs) */
    lab: z.array(z.string()).default([]),
    /** Primary hands-on practice → official AB-650 labs in /courses/ab-650/labs/ */
    officialLabs: z
      .array(
        z.object({
          labId: z.string(),
          exerciseIds: z.array(z.string()).optional(),
        }),
      )
      .default([]),
    outOfScopeNote: z.string().optional(),
    tldr: z.array(z.string()).default([]),
    trap: z.string(),
    videoTip: z.string().optional(),
  }).refine((entry) => entry.day != null || entry.session != null, {
    message: "A unit needs day or session",
  }),
});

export const collections = { courses, courseDays };
