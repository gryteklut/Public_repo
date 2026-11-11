/**
 * Convert src/data/curriculum.ts (+ udemy/skillsUp maps) into
 * content/courses/ab-650/** MDX + course.yaml
 *
 * Run: npx tsx scripts/migrate-curriculum.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { curriculum } from "../src/data/curriculum.ts";
import { getSkillsUpLinks } from "../src/data/skillsUpMap.ts";
import { getUdemyGuide } from "../src/data/udemyMap.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/content/courses/ab-650");

const SLUGS = [
  "01-tenant-foundations",
  "02-workloads-copilot",
  "03-entra-identities",
  "04-auth-conditional-access",
  "05-defender-office",
  "06-purview-dspm",
  "07-enable-copilot",
  "08-agents-agent365",
  "09-monitor-ai",
  "10-mixed-practice",
];

function yamlEscape(s: string): string {
  if (/[:#\[\]{}",'\n]/.test(s) || s.includes('"')) {
    return JSON.stringify(s);
  }
  return s;
}

function deriveTldr(studyContents: string[]): string[] {
  const points = studyContents
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((t) => {
      const sentence = t.split(/(?<=\.)\s+/)[0] ?? t;
      return sentence.length > 140 ? `${sentence.slice(0, 137)}…` : sentence;
    });
  const unique = [...new Set(points)];
  while (unique.length < 3 && studyContents[unique.length]) {
    unique.push(studyContents[unique.length]!.slice(0, 120));
  }
  return unique.slice(0, 5);
}

function deriveTrap(dayTitle: string, studyContents: string[]): string {
  const blob = studyContents.join(" ").toLowerCase();
  if (blob.includes("portal") || blob.includes("admin center")) {
    return `Exam trap: portal selection for “${dayTitle}” — know which admin center owns the setting.`;
  }
  if (blob.includes("copilot") || blob.includes("agent")) {
    return `Exam trap: Copilot/agent wording is precise — readiness, oversharing, and governance are different skills.`;
  }
  return `Exam trap: read the AB-650 skill stem carefully for “${dayTitle}” — distractors often mix MS-102-only tasks.`;
}

function quizBlock(q: {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceUrl: string;
  sourceLabel: string;
  studyContent: string;
}): string {
  const lines = q.choices.map((c, i) =>
    i === q.correctIndex ? `- [x] ${c}` : `- [ ] ${c}`,
  );
  return `
<Quiz id="${q.id}" title="${q.prompt.replace(/"/g, "'").slice(0, 80)}">
${q.prompt}

${lines.join("\n")}

${q.explanation}

[Source: ${q.sourceLabel}](${q.sourceUrl})
</Quiz>

<details class="study-collapse">
<summary>Study this topic</summary>

${q.studyContent}

</details>
`.trim();
}

mkdirSync(join(outDir, "days"), { recursive: true });

const courseYaml = `code: AB-650
title: Administering Microsoft 365 and AI Services
subtitle: Ten 60-minute days built on retrieval practice and successive relearning.
level: Intermediate
status: live
color: "#0f5c63"
tags:
  - MS-102-core
  - MS-102-updated
  - AB-650-new
learn:
  - Run tenant, licensing and workload admin with Copilot in mind
  - Govern Entra identities, authentication and Conditional Access
  - Secure collaboration with Defender for Office 365 and Purview
  - Enable Copilot, govern agents with Agent 365, and monitor AI usage
outOfScope: Skip hybrid Entra Connect sync troubleshooting and broad Defender XDR admin across Endpoint / Identity / Cloud Apps.
`;

writeFileSync(join(outDir, "course.yaml"), courseYaml);

curriculum.forEach((day, idx) => {
  const mod = day.modules[0]!;
  const slug = SLUGS[idx]!;
  const udemy = getUdemyGuide(mod.id);
  const skills = getSkillsUpLinks(mod.id);
  const studyTexts = mod.questions.map((q) => q.studyContent);
  const tldr = deriveTldr(studyTexts);
  const trap = deriveTrap(day.title, studyTexts);

  const resources = [
    ...mod.studyLinks.map((l) => ({ ...l, kind: "learn" as const })),
    ...skills.map((l) => ({ ...l, kind: "skillsup" as const })),
  ];

  const videos =
    udemy?.sections.map((s) => ({
      label: s.section,
      action: s.priority,
      note: s.note,
      lectures: s.lectures ?? [],
    })) ?? [];

  const fm: string[] = [
    "---",
    `day: ${day.dayNumber}`,
    `title: ${yamlEscape(day.title)}`,
    `moduleTitle: ${yamlEscape(mod.title)}`,
    `moduleId: ${yamlEscape(mod.id)}`,
    `minutes: ${day.estimatedMinutes}`,
    `practice: ${day.isPracticeDay ? "true" : "false"}`,
    `summary: ${yamlEscape(mod.summary)}`,
    `focus: ${yamlEscape(day.focus)}`,
    "tags:",
    ...mod.tags.map((t) => `  - ${t}`),
    "resources:",
    ...resources.map(
      (r) =>
        `  - { label: ${yamlEscape(r.label)}, url: ${yamlEscape(r.url)}, kind: ${r.kind} }`,
    ),
  ];

  if (videos.length) {
    fm.push("videos:");
    for (const v of videos) {
      fm.push(`  - label: ${yamlEscape(v.label)}`);
      fm.push(`    action: ${v.action}`);
      if (v.note) fm.push(`    note: ${yamlEscape(v.note)}`);
      if (v.lectures.length) {
        fm.push("    lectures:");
        for (const lec of v.lectures) fm.push(`      - ${yamlEscape(lec)}`);
      }
    }
  }

  if (mod.labSteps?.length) {
    fm.push("lab:");
    for (const step of mod.labSteps) fm.push(`  - ${yamlEscape(step)}`);
  }

  if (mod.outOfScopeNote) {
    fm.push(`outOfScopeNote: ${yamlEscape(mod.outOfScopeNote)}`);
  }

  fm.push("tldr:");
  for (const p of tldr) fm.push(`  - ${yamlEscape(p)}`);
  fm.push(`trap: ${yamlEscape(trap)}`);
  if (udemy?.tip) fm.push(`videoTip: ${yamlEscape(udemy.tip)}`);
  fm.push("---");
  fm.push("");
  fm.push("import { Quiz } from 'starlight-quiz/components';");
  fm.push("");
  fm.push(
    day.isPracticeDay
      ? "Quiz-first practice day. Answer from memory, then open study notes only if you miss."
      : "Learn the topic, then prove it with the knowledge checks below.",
  );
  fm.push("");
  for (const q of mod.questions) {
    fm.push(quizBlock(q));
    fm.push("");
  }

  writeFileSync(join(outDir, "days", `${slug}.mdx`), `${fm.join("\n")}\n`);
  console.log("wrote", slug);
});

// template course
const tmpl = join(root, "src/content/courses/_template");
mkdirSync(join(tmpl, "days"), { recursive: true });
writeFileSync(
  join(tmpl, "course.yaml"),
  `code: TEMPLATE
title: Template course
subtitle: Copy this folder to start a new topic.
level: Intermediate
status: draft
color: "#5b4bff"
tags: []
learn:
  - Replace this with real outcomes
outOfScope: Replace with what to skip.
`,
);
writeFileSync(
  join(tmpl, "days", "01-example.mdx"),
  `---
day: 1
title: Example day
moduleTitle: Example module
moduleId: example-1
minutes: 30
practice: false
summary: Short example day for scaffolding.
focus: Replace with the day’s focus.
tags: []
resources:
  - { label: Microsoft Learn, url: https://learn.microsoft.com/, kind: learn }
videos:
  - label: Example section
    action: watch
    lectures:
      - Example lecture title
lab:
  - Do a hands-on step in your lab tenant
tldr:
  - First key point
  - Second key point
  - Third key point
trap: Exams often trick you on portal selection.
---
import { Quiz } from 'starlight-quiz/components';

Replace this body with course content and quizzes.

<Quiz id="template-d1-q1" title="Example">
Is this a template?

- [x] Yes
- [ ] No

This is the scaffold quiz.
</Quiz>
`,
);

console.log("Migration complete →", outDir);
