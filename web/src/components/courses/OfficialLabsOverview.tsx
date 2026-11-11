import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getAllOfficialExercises,
  officialLabsCatalog,
  TOTAL_OFFICIAL_LAB_MINUTES,
} from "@/data/officialLabs";
import { withBase } from "@/lib/base";
import {
  isOfficialLabComplete,
  isOfficialLabExerciseComplete,
  loadCourseProgress,
  officialLabMinutesCompleted,
} from "@/lib/courseProgress";

const CODE = "AB-650";

export function OfficialLabsOverview() {
  const [, setTick] = useState(0);
  void setTick;
  const progress = loadCourseProgress(CODE);
  const { attribution, learningPaths, totalLabs } = officialLabsCatalog;

  const exerciseMeta = getAllOfficialExercises().map(({ lab, exercise }) => ({
    labId: lab.id,
    exerciseId: exercise.id,
    minutes: exercise.minutes,
  }));
  const minutesDone = officialLabMinutesCompleted(progress, exerciseMeta);
  const minutesLeft = Math.max(0, TOTAL_OFFICIAL_LAB_MINUTES - minutesDone);
  const percent =
    TOTAL_OFFICIAL_LAB_MINUTES === 0
      ? 0
      : Math.round((minutesDone / TOTAL_OFFICIAL_LAB_MINUTES) * 100);

  const labsDone = learningPaths
    .flatMap((lp) => lp.labs)
    .filter((lab) =>
      isOfficialLabComplete(
        progress,
        lab.id,
        lab.exercises.map((e) => e.id),
      ),
    ).length;

  const exercisesDone = exerciseMeta.filter((ex) =>
    isOfficialLabExerciseComplete(progress, ex.labId, ex.exerciseId),
  ).length;

  return (
    <div className="space-y-10">
      <header className="course-card ms-lab-hero p-6 md:p-8">
        <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ms-accent)]">
          Official hands-on labs
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          AB-650 labs
        </h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-relaxed">
          Seven labs across three Microsoft Learn paths —{" "}
          {TOTAL_OFFICIAL_LAB_MINUTES} minutes of practice on one Microsoft 365
          E7 lab tenant. Complete them in order; later labs reuse groups, sites,
          and agents you create earlier.
        </p>
        <div className="mt-5 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <span className="font-semibold">
              {labsDone} of {totalLabs} labs
            </span>
            <span className="text-muted-foreground">
              {minutesDone} of {TOTAL_OFFICIAL_LAB_MINUTES} min · {minutesLeft}{" "}
              min left
            </span>
          </div>
          <Progress value={percent} className="h-2" />
          <p className="text-muted-foreground text-xs">
            {exercisesDone} of {exerciseMeta.length} exercises
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a
              href={attribution.officialSite}
              target="_blank"
              rel="noreferrer"
            >
              Official lab site
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a
              href={`${attribution.officialSite}Instructions/Labs/00-getting-started.html`}
              target="_blank"
              rel="noreferrer"
            >
              Get started guide
            </a>
          </Button>
        </div>
      </header>

      {learningPaths.map((lp) => (
        <section key={lp.number} className="space-y-4" id={`lp-${lp.number}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ms-accent)]">
                Learning path {lp.number}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{lp.title}</h2>
              <p className="text-muted-foreground text-sm">
                {lp.labs.length} labs · {lp.duration} minutes
              </p>
            </div>
            <Button variant="secondary" asChild>
              <a href={lp.learnUrl} target="_blank" rel="noreferrer">
                Microsoft Learn path
              </a>
            </Button>
          </div>

          <div className="grid gap-4">
            {lp.labs.map((lab) => {
              const done = isOfficialLabComplete(
                progress,
                lab.id,
                lab.exercises.map((e) => e.id),
              );
              const doneEx = lab.exercises.filter((ex) =>
                isOfficialLabExerciseComplete(progress, lab.id, ex.id),
              ).length;
              return (
                <article
                  key={lab.id}
                  className={`course-card space-y-3 p-5 md:p-6 ${done ? "ms-lab-done" : ""}`}
                  id={lab.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">
                      <a
                        className="hover:text-[var(--ms-accent)]"
                        href={withBase(`/courses/ab-650/labs/${lab.id}/`)}
                      >
                        {lab.title}
                      </a>
                    </h3>
                    <span className="ms-badge">{lab.duration} min</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="ms-badge">Level {lab.level}</span>
                    <span className="ms-badge">
                      {lab.exercises.length} exercises
                    </span>
                    <span className="ms-badge">
                      {doneEx}/{lab.exercises.length} done
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {lab.description}
                  </p>
                  <details className="text-sm">
                    <summary className="cursor-pointer font-semibold text-[var(--ms-accent)]">
                      {doneEx} of {lab.exercises.length} exercises
                    </summary>
                    <ol className="mt-2 space-y-2">
                      {lab.exercises.map((ex) => {
                        const exDone = isOfficialLabExerciseComplete(
                          progress,
                          lab.id,
                          ex.id,
                        );
                        return (
                          <li
                            key={ex.id}
                            className="flex items-start gap-2"
                          >
                            <span
                              className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                exDone
                                  ? "border-[var(--ms-ok)] bg-[var(--ms-ok)] text-white"
                                  : "border-[var(--course-line)]"
                              }`}
                              aria-hidden
                            >
                              {exDone ? "✓" : ""}
                            </span>
                            <span>
                              {ex.title}{" "}
                              <span className="text-muted-foreground">
                                ({ex.minutes} min)
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                  {lab.labFiles.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      Lab files:{" "}
                      {lab.labFiles.map((f, i) => (
                        <span key={f}>
                          <code className="ms-code">{f}</code>
                          {i < lab.labFiles.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild>
                      <a href={withBase(`/courses/ab-650/labs/${lab.id}/`)}>
                        Open lab
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={lab.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official page
                      </a>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <aside className="course-card bg-[var(--ms-badge-bg)] p-5 text-sm leading-relaxed">
        <h3 className="font-semibold">Attribution</h3>
        <p className="text-muted-foreground mt-2">
          Exercise steps are adapted from the{" "}
          <a
            className="font-semibold text-[var(--ms-accent)]"
            href={attribution.sourceRepo}
            target="_blank"
            rel="noreferrer"
          >
            MicrosoftLearning/AB-650T00_administer_microsoft_365_and_ai_services
          </a>{" "}
          repository ({attribution.copyright}) under the{" "}
          <a
            className="font-semibold text-[var(--ms-accent)]"
            href={`${attribution.sourceRepo}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer"
          >
            {attribution.license} License
          </a>
          . Prefer the{" "}
          <a
            className="font-semibold text-[var(--ms-accent)]"
            href={attribution.officialSite}
            target="_blank"
            rel="noreferrer"
          >
            official lab pages
          </a>{" "}
          for the latest wording.
        </p>
      </aside>
    </div>
  );
}
