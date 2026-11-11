import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { loadCourseProgress } from "@/lib/courseProgress";
import { withBase } from "@/lib/base";

export function CurriculumAccordion({
  code,
  courseSlug,
  sessions,
}: {
  code: string;
  courseSlug: string;
  sessions: {
    session: number;
    week: number;
    title: string;
    minutes: number;
    kind?: "learn" | "review" | "mock";
  }[];
}) {
  const [, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  void setTick;

  return (
    <ol className="divide-border course-card divide-y overflow-hidden">
      {sessions.map((item, index) => {
        const done = Boolean(progress.done[String(item.session)]);
        const showWeek =
          index === 0 || item.week !== sessions[index - 1]?.week;
        const label =
          item.kind === "mock"
            ? "Mock exam"
            : item.kind === "review"
              ? "Review"
              : `Session ${item.session}`;
        return (
          <li key={item.session}>
            {showWeek && (
              <p className="bg-muted/40 text-muted-foreground px-4 py-2 text-xs font-semibold tracking-wider uppercase">
                Week {item.week}
              </p>
            )}
            <a
              href={withBase(`/courses/${courseSlug}/session-${item.session}/`)}
              className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors"
            >
              {done ? (
                <CheckCircle2 className="size-4 shrink-0 text-[color:var(--course-highlight-ink)]" />
              ) : (
                <Circle className="text-muted-foreground size-4 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {label}: {item.title}
                </p>
              </div>
              <span className="text-muted-foreground text-xs">
                ~{item.minutes}m
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
