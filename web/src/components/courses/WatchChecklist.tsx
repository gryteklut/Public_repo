import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  loadCourseProgress,
  saveCourseProgress,
  setVideoWatched,
} from "@/lib/courseProgress";

export type VideoSection = {
  label: string;
  action: "watch" | "skim" | "skip";
  note?: string;
  lectures: string[];
};

export function WatchChecklist({
  code,
  day,
  tip,
  sections,
  courseUrl,
}: {
  code: string;
  day: number;
  tip?: string;
  sections: VideoSection[];
  courseUrl?: string;
}) {
  const [tick, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  const watched = progress.steps[String(day)]?.videosWatched ?? {};

  const toggle = (lecture: string, value: boolean) => {
    saveCourseProgress(setVideoWatched(progress, String(day), lecture, value));
    setTick((t) => t + 1);
  };
  void tick;

  const watch = sections.filter((s) => s.action === "watch");
  const other = sections.filter((s) => s.action !== "watch");
  const all = watch.flatMap((s) =>
    s.lectures.length ? s.lectures : [s.label],
  );
  const done = all.filter((l) => watched[l]).length;

  return (
    <section className="course-card p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Day steps · Udemy
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Watch checklist
          </h2>
          {all.length > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">
              {done} / {all.length} watched
            </p>
          )}
        </div>
        {courseUrl && (
          <Button variant="outline" asChild>
            <a href={courseUrl} target="_blank" rel="noreferrer">
              Open course player
            </a>
          </Button>
        )}
      </div>

      {tip && (
        <p className="bg-muted text-muted-foreground mt-4 rounded-xl p-3 text-sm leading-relaxed">
          {tip}
        </p>
      )}

      <div className="mt-5 space-y-5">
        {watch.map((section) => (
          <div key={section.label} className="rounded-2xl border p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="course-pill rounded-full px-2.5 py-1 text-xs font-semibold">
                Watch
              </span>
              <strong className="text-sm">{section.label}</strong>
            </div>
            {section.note && (
              <p className="text-muted-foreground mb-3 text-sm">{section.note}</p>
            )}
            <ul className="space-y-2">
              {(section.lectures.length ? section.lectures : [section.label]).map(
                (lecture) => {
                  const id = `w-${day}-${lecture}`;
                  const checked = Boolean(watched[lecture]);
                  return (
                    <li key={lecture}>
                      <label
                        htmlFor={id}
                        className={`hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                          checked ? "border-foreground/20 bg-muted/30" : ""
                        }`}
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          className="mt-0.5"
                          onCheckedChange={(v) => toggle(lecture, v === true)}
                        />
                        <span className="min-w-0 flex-1 leading-relaxed">
                          <span className="text-muted-foreground mr-2 text-xs font-semibold tracking-wide uppercase">
                            Watch
                          </span>
                          <Label
                            htmlFor={id}
                            className={`cursor-pointer font-normal ${checked ? "text-muted-foreground line-through" : ""}`}
                          >
                            {lecture}
                          </Label>
                        </span>
                      </label>
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        ))}

        {other.length > 0 && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Skim / skip
            </p>
            {other.map((section) => (
              <div
                key={`${section.action}-${section.label}`}
                className="text-muted-foreground rounded-xl border border-dashed p-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border px-2 py-0.5 text-xs font-medium capitalize">
                    {section.action}
                  </span>
                  <strong className="text-foreground text-sm">
                    {section.label}
                  </strong>
                </div>
                {section.note && <p className="mt-1 text-xs">{section.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
