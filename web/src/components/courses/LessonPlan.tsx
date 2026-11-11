import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, GraduationCap } from "lucide-react";
import {
  DEFAULT_DAY_SOURCES,
  SOURCES_EVENT,
  getDaySources,
  loadCourseProgress,
  type DaySources,
} from "@/lib/courseProgress";

type Resource = { label: string; url: string; kind?: string };

function LinkList({
  items,
  pill,
}: {
  items: Resource[];
  pill?: boolean;
}) {
  return (
    <ul className="space-y-2">
      {items.map((link) => (
        <li key={`${link.label}-${link.url}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={
              pill
                ? "hover:bg-muted flex items-start justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
                : "bg-muted/60 hover:bg-muted flex items-start justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
            }
          >
            <span>{link.label}</span>
            {pill ? (
              <span className="course-pill shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                Open
              </span>
            ) : (
              <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-60" />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LessonPlan({
  code,
  day,
  focus,
  videoLabels,
  resources,
}: {
  code: string;
  day: number;
  focus: string;
  videoLabels: string[];
  resources: Resource[];
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

  const courses = resources.filter((r) => r.kind === "course");
  const learn = resources.filter(
    (r) => r.kind !== "skillsup" && r.kind !== "course",
  );
  const skills = resources.filter((r) => r.kind === "skillsup");

  return (
    <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
      <div className="course-card p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lesson plan</h2>
          <GraduationCap className="text-muted-foreground size-4" />
        </div>
        <ol className="relative space-y-5 border-l pl-4">
          <li className="relative">
            <span className="bg-foreground absolute top-1 -left-[21px] size-2.5 rounded-full" />
            <p className="text-sm font-semibold">Day focus</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {focus}
            </p>
          </li>
          {sources.udemy && videoLabels.length > 0 && (
            <li className="relative">
              <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="text-sm font-semibold">Udemy companion</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {videoLabels.slice(0, 2).join(" · ")}
              </p>
            </li>
          )}
          {sources.microsoft && courses.length > 0 && (
            <li className="relative">
              <span className="course-pill absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="mb-2 text-sm font-semibold">Microsoft Learn course</p>
              <LinkList items={courses} pill />
            </li>
          )}
          {sources.microsoft && learn.length > 0 && (
            <li className="relative">
              <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <BookOpen className="size-3.5" />
                Microsoft Learn
              </p>
              <LinkList items={learn} />
            </li>
          )}
          {sources.microsoft && skills.length > 0 && (
            <li className="relative">
              <span className="course-pill absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="mb-2 text-sm font-semibold">SkillsUp</p>
              <LinkList items={skills} pill />
            </li>
          )}
        </ol>
      </div>
    </aside>
  );
}
