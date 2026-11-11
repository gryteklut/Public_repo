#!/usr/bin/env node
/**
 * Scaffold a new course folder from _template.
 * Usage: npm run new-course -- md-102 "Endpoint Administrator"
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const title = process.argv[3] ?? "New course";

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new-course -- <slug> "Course title"');
  console.error("Example: npm run new-course -- md-102 \"Endpoint Administrator\"");
  process.exit(1);
}

const dest = join(root, "src/content/courses", slug);
const template = join(root, "src/content/courses/_template");

if (existsSync(dest)) {
  console.error(`Already exists: ${dest}`);
  process.exit(1);
}
if (!existsSync(template)) {
  console.error(`Missing template: ${template}`);
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(template, dest, { recursive: true });

const code = slug.toUpperCase();
const yamlPath = join(dest, "course.yaml");
let yaml = readFileSync(yamlPath, "utf8");
yaml = yaml
  .replace(/code:.*/i, `code: ${code}`)
  .replace(/title:.*/i, `title: ${title}`)
  .replace(/status:.*/i, "status: draft");
writeFileSync(yamlPath, yaml);

console.log(`Created ${dest}`);
console.log(`Edit course.yaml. Default format is days (days/*.mdx). Set format: sessions and use sessions/*.mdx for a 1-hour weekday plan.`);
console.log(
  "External companion: set external.provider, title, and url (no coupon query). Default instructor is John Christopher (https://www.udemy.com/user/john-christopher-32/).",
);
