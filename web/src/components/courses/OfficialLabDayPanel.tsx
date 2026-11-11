import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getOfficialLabById,
  type OfficialLab,
} from "@/data/officialLabs";
import { withBase } from "@/lib/base";
import {
  isOfficialLabExerciseComplete,
  loadCourseProgress,
  saveCourseProgress,
  setLabChecked,
} from "@/lib/courseProgress";

export type OfficialLabPointer = {
  labId: string;
  /** If set, only these exercises; otherwise the whole lab */
  exerciseIds?: string[];
};

const CODE_DEFAULT = "AB-650";

export function OfficialLabDayPanel({
  code = CODE_DEFAULT,
  courseSlug = "ab-650",
  day,
  pointers,
  portalTips = [],
}: {
  code?: string;
  courseSlug?: string;
  day: number;
  pointers: OfficialLabPointer[];
  portalTips?: string[];
}) {
  const [, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  const tipState = progress.steps[String(day)]?.labChecked ?? {};

  const resolved = pointers
    .map((p) => {
      const lab = getOfficialLabById(p.labId, code);
      if (!lab) return null;
      const exercises = p.exerciseIds?.length
        ? lab.exercises.filter((ex) => p.exerciseIds!.includes(ex.id))
        : lab.exercises;
      return { lab, exercises };
    })
    .filter(Boolean) as { lab: OfficialLab; exercises: OfficialLab["exercises"] }[];

  if (resolved.length === 0 && portalTips.length === 0) {
    return (
      <p className="text-muted-foreground mt-2 text-sm">
        No hands-on lab for this day — use the Microsoft Learn training and
        knowledge check.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-4">
      {resolved.length > 0 && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Do the official lab. Check off each exercise on the lab page.
          </p>
          {resolved.map(({ lab, exercises }) => {
            const doneCount = exercises.filter((ex) =>
              isOfficialLabExerciseComplete(progress, lab.id, ex.id),
            ).length;
            return (
              <div
                key={lab.id}
                className="rounded-xl border border-[var(--course-line)] bg-[var(--ms-soft)]/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ms-accent)]">
                      Official lab
                    </p>
                    <h4 className="mt-1 font-semibold">
                      <a
                        className="hover:text-[var(--ms-accent)]"
                        href={withBase(`/courses/${courseSlug}/labs/${lab.id}/`)}
                      >
                        {lab.title}
                      </a>
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {doneCount}/{exercises.length} exercises done ·{" "}
                      {lab.duration} min lab
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <a href={withBase(`/courses/${courseSlug}/labs/${lab.id}/`)}>
                      Open lab
                    </a>
                  </Button>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {exercises.map((ex) => {
                    const done = isOfficialLabExerciseComplete(
                      progress,
                      lab.id,
                      ex.id,
                    );
                    return (
                      <li key={ex.id} className="flex items-start gap-2 text-sm">
                        <span
                          className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            done
                              ? "border-[var(--ms-ok)] bg-[var(--ms-ok)] text-white"
                              : "border-[var(--course-line)]"
                          }`}
                          aria-hidden
                        >
                          {done ? "✓" : ""}
                        </span>
                        <a
                          className="hover:text-[var(--ms-accent)]"
                          href={withBase(
                            `/courses/${courseSlug}/labs/${lab.id}/#${ex.id}`,
                          )}
                        >
                          Exercise {ex.number}: {ex.title}{" "}
                          <span className="text-muted-foreground">
                            ({ex.minutes} min)
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-muted-foreground mt-3 text-xs">
                  Also on the{" "}
                  <a
                    className="font-medium text-[var(--ms-accent)]"
                    href={lab.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    official Microsoft Learning page
                  </a>
                  .
                </p>
              </div>
            );
          })}
        </div>
      )}

      {portalTips.length > 0 && (
        <div>
          <h3 className="font-semibold">Also</h3>
          <ul className="mt-2 space-y-2">
            {portalTips.map((tip) => {
              const id = `portal-tip-${day}-${tip}`;
              const checked = Boolean(tipState[tip]);
              return (
                <li key={tip}>
                  <label
                    htmlFor={id}
                    className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      className="mt-0.5"
                      onCheckedChange={(v) => {
                        saveCourseProgress(
                          setLabChecked(
                            progress,
                            String(day),
                            tip,
                            v === true,
                          ),
                        );
                        setTick((t) => t + 1);
                      }}
                    />
                    <span
                      className={`leading-relaxed ${checked ? "text-muted-foreground line-through" : ""}`}
                    >
                      {tip}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
