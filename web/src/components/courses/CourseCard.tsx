import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadCourseProgress } from "@/lib/courseProgress";
import { withBase } from "@/lib/base";

export function CourseCard({
  slug,
  code,
  title,
  subtitle,
  status,
  color,
  total = 0,
}: {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  status: string;
  color: string;
  total?: number;
}) {
  const [, setTick] = useState(0);
  void setTick;
  const soon = status !== "live";
  const progress = soon ? null : loadCourseProgress(code);
  const done = progress
    ? Object.values(progress.done).filter(Boolean).length
    : 0;

  return (
    <a
      href={soon ? undefined : withBase(`/courses/${slug}/`)}
      className={`course-card group block p-6 shadow-xs transition-colors ${
        soon ? "pointer-events-none opacity-70" : "hover:border-foreground/25"
      }`}
      aria-disabled={soon}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="size-3 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {code} · {status}
        </p>
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {subtitle}
      </p>
      {!soon && total > 0 && (
        <p className="text-muted-foreground mt-3 text-xs">
          {done}/{total} days complete
        </p>
      )}
      <div className="mt-5">
        <Button variant="outline" className="gap-2" asChild>
          <span>
            {soon ? "Coming soon" : "Open course"}
            {!soon && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        </Button>
      </div>
    </a>
  );
}
