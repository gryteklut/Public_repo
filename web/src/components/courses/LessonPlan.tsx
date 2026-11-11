import { useEffect, useState } from "react";

import {
  DEFAULT_DAY_SOURCES,
  SOURCES_EVENT,
  getDaySources,
  loadCourseProgress,
  type DaySources,
} from "@/lib/courseProgress";

type Resource = { label: string; url: string; kind?: string };

const JUMPS = [
  { href: "#training", label: "Microsoft Learn", source: "microsoft" as const },
  { href: "#watch", label: "Watch checklist", source: "udemy" as const },
  { href: "#lab", label: "Lab", source: "microsoft" as const },
  { href: "#tldr", label: "Exam trap", source: null },
  { href: "#check", label: "Knowledge check", source: null },
];

export function LessonPlan({
  code,
  day,
  resources,
  hasWatch,
  hasLab,
}: {
  code: string;
  day: number;
  resources: Resource[];
  hasWatch: boolean;
  hasLab: boolean;
}) {
  const [sources, setSources] = useState<DaySources>(DEFAULT_DAY_SOURCES);

  useEffect(() => {
    setSources(getDaySources(loadCourseProgress(code), String(day)));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ day: number; sources: DaySources }>)
        .detail;
      if (!detail || detail.day !== day) return;
      setSources(detail.sources);
    };
    window.addEventListener(SOURCES_EVENT, onChange);
    return () => window.removeEventListener(SOURCES_EVENT, onChange);
  }, [code, day]);

  const path = resources.find(
    (r) => r.kind === "course" && r.label.startsWith("Path:"),
  );
  const skills = resources.filter((r) => r.kind === "skillsup");
  const jumps = JUMPS.filter((item) => {
    if (item.href === "#watch") return hasWatch && sources.udemy;
    if (item.href === "#lab") return hasLab;
    if (item.source === "microsoft") return sources.microsoft;
    if (item.source === "udemy") return sources.udemy;
    return true;
  });

  return (
    <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
      <div className="course-card p-5 shadow-xs">
        <h2 className="text-lg font-semibold">On this page</h2>
        <ol className="mt-4 space-y-2">
          {jumps.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium"
              >
                <span className="text-muted-foreground w-4 text-xs">
                  {i + 1}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
        {sources.microsoft && path && (
          <a
            href={path.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block text-sm font-semibold text-[var(--ms-accent)] underline-offset-4 hover:underline"
          >
            {path.label.replace(/^Path:\s*/, "Learn path: ")}
          </a>
        )}
        {sources.microsoft && skills.length > 0 && (
          <ul className="mt-3 space-y-2">
            {skills.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
