import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { loadCourseProgress } from "@/lib/courseProgress";
import { withBase } from "@/lib/base";

export function CurriculumAccordion({
  code,
  courseSlug,
  days,
}: {
  code: string;
  courseSlug: string;
  days: {
    day: number;
    title: string;
    minutes: number;
    practice?: boolean;
  }[];
}) {
  const [, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  void setTick;

  return (
    <ol className="divide-border course-card divide-y overflow-hidden">
      {days.map((d) => {
        const done = Boolean(progress.done[String(d.day)]);
        return (
          <li key={d.day}>
            <a
              href={withBase(`/courses/${courseSlug}/day-${d.day}/`)}
              className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors"
            >
              {done ? (
                <CheckCircle2 className="size-4 shrink-0 text-[color:var(--course-highlight-ink)]" />
              ) : (
                <Circle className="text-muted-foreground size-4 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  Day {d.day}: {d.title}
                  {d.practice ? " · Practice" : ""}
                </p>
              </div>
              <span className="text-muted-foreground text-xs">
                ~{d.minutes}m
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
