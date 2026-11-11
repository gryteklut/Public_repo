import { defineCollection } from "astro:content";

// No content collections yet — hub + AB-650 use typed TS data.
export const collections = {} as Record<string, ReturnType<typeof defineCollection>>;
