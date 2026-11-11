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
  }),
});

const courseDays = defineCollection({
  loader: glob({
    pattern: "*/days/*.{md,mdx}",
    base: "./src/content/courses",
  }),
  schema: z.object({
    day: z.number(),
    title: z.string(),
    moduleTitle: z.string(),
    moduleId: z.string(),
    minutes: z.number(),
    practice: z.boolean().default(false),
    summary: z.string(),
    focus: z.string(),
    tags: z.array(z.string()).default([]),
    resources: z.array(resourceSchema).default([]),
    videos: z.array(videoSchema).default([]),
    lab: z.array(z.string()).default([]),
    outOfScopeNote: z.string().optional(),
    tldr: z.array(z.string()).default([]),
    trap: z.string(),
    videoTip: z.string().optional(),
  }),
});

export const collections = { courses, courseDays };
