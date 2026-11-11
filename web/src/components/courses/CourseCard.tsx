import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadCourseProgress } from "@/lib/courseProgress";
import { estimateFinishDate, formatFinishDate } from "@/lib/sessionSchedule";
import { withBase } from "@/lib/base";

export type CourseExternal = {
  provider: string;
  title: string;
  url: string;
  instructor?: string;
  instructorUrl?: string;
};

export function CourseCard({
  slug,
  code,
  title,
  subtitle,
  status,
  color,
  total = 0,
  weeks = 1,
  labsHref,
  external,
}: {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  status: string;
  color: string;
  total?: number;
  weeks?: number;
  labsHref?: string;
  external?: CourseExternal;
}) {
  const [, setTick] = useState(0);
  void setTick;
  const soon = status !== "live";
  const progress = soon ? null : loadCourseProgress(code);
  const done = progress
    ? Array.from({ length: total }, (_, i) => progress.done[String(i + 1)]).filter(
        Boolean,
      ).length
    : 0;
  const finish = estimateFinishDate(Math.max(0, total - done));
  const planHref = withBase(`/courses/${slug}/`);

  return (
    <article className="course-card flex h-full flex-col p-6 shadow-xs">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="size-3 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {code}
          {soon ? ` · ${status}` : ""}
        </p>
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {subtitle}
      </p>
      {external && (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          <span className="text-foreground font-semibold">
            {external.provider}:
          </span>{" "}
          <a
            className="font-medium underline-offset-4 hover:underline"
            href={external.url}
            target="_blank"
            rel="noreferrer"
          >
            {external.title}
          </a>
          {external.instructor && (
            <>
              {" "}
              ·{" "}
              {external.instructorUrl ? (
                <a
                  className="underline-offset-4 hover:underline"
                  href={external.instructorUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {external.instructor}
                </a>
              ) : (
                external.instructor
              )}
            </>
          )}
        </p>
      )}
      {!soon && total > 0 && (
        <div className="text-muted-foreground mt-3 space-y-1 text-xs">
          <p>~{weeks} weeks at 1 h/workday</p>
          <p>
            {done}/{total} sessions
            {finish ? ` · finish ${formatFinishDate(finish)}` : " · finished"}
          </p>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {soon ? (
          <Button variant="outline" disabled>
            Coming soon
          </Button>
        ) : (
          <>
            <Button asChild>
              <a href={planHref}>
                Sessions
                <ArrowRight className="size-4" />
              </a>
            </Button>
            {labsHref && (
              <Button variant="outline" asChild>
                <a href={withBase(labsHref)}>Official labs</a>
              </Button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
