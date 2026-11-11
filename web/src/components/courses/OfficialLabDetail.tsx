import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  getLearningPathForLab,
  getOfficialLabById,
  officialLabsCatalog,
  TOTAL_OFFICIAL_LAB_MINUTES,
  type OfficialLab,
} from "@/data/officialLabs";
import {
  isOfficialLabComplete,
  isOfficialLabExerciseComplete,
  loadCourseProgress,
  officialLabMinutesCompleted,
  saveCourseProgress,
  setOfficialLabComplete,
  setOfficialLabExercise,
} from "@/lib/courseProgress";

const CODE = "AB-650";

export function OfficialLabDetail({ labId }: { labId: string }) {
  const lab = getOfficialLabById(labId);
  if (!lab) {
    return (
      <p className="text-muted-foreground">
        Lab not found.{" "}
        <a className="text-[var(--ms-accent)]" href="../">
          Back to labs
        </a>
      </p>
    );
  }
  return <LabDetailInner lab={lab} />;
}

function LabDetailInner({ lab }: { lab: OfficialLab }) {
  const [, setTick] = useState(0);
  const progress = loadCourseProgress(CODE);
  const lp = getLearningPathForLab(lab);
  const exerciseIds = lab.exercises.map((e) => e.id);
  const done = isOfficialLabComplete(progress, lab.id, exerciseIds);

  const doneMinutes = lab.exercises
    .filter((ex) =>
      isOfficialLabExerciseComplete(progress, lab.id, ex.id),
    )
    .reduce((sum, ex) => sum + ex.minutes, 0);
  const labPercent = Math.round((doneMinutes / lab.duration) * 100);

  const allMeta = officialLabsCatalog.learningPaths
    .flatMap((p) => p.labs)
    .flatMap((l) =>
      l.exercises.map((ex) => ({
        labId: l.id,
        exerciseId: ex.id,
        minutes: ex.minutes,
      })),
    );
  const minutesLeft =
    TOTAL_OFFICIAL_LAB_MINUTES -
    officialLabMinutesCompleted(progress, allMeta);

  function refresh() {
    setTick((t) => t + 1);
  }

  return (
    <div className="space-y-8">
      <header className="course-card space-y-4 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ms-accent)]">
          Learning path {lab.learningPath}
          {lp ? ` · ${lp.title}` : ""}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{lab.title}</h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          {lab.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="ms-badge ms-badge-accent">
            {lab.duration} minutes
          </span>
          <span className="ms-badge">Level {lab.level}</span>
          <span className="ms-badge">{lab.exercises.length} exercises</span>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="font-semibold">This lab</span>
            <span className="text-muted-foreground">
              {doneMinutes} / {lab.duration} min · {minutesLeft} min remaining
              across all labs
            </span>
          </div>
          <Progress value={labPercent} className="h-2" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={lab.officialUrl} target="_blank" rel="noreferrer">
              Official lab page
            </a>
          </Button>
          {lp && (
            <Button variant="secondary" asChild>
              <a href={lp.learnUrl} target="_blank" rel="noreferrer">
                Related Learn path
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={lab.sourceUrl} target="_blank" rel="noreferrer">
              Source markdown
            </a>
          </Button>
        </div>
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
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <Checkbox
            checked={done}
            onCheckedChange={(v) => {
              saveCourseProgress(
                setOfficialLabComplete(
                  progress,
                  lab.id,
                  v === true,
                  exerciseIds,
                ),
              );
              refresh();
            }}
          />
          Mark entire lab complete
        </label>
      </header>

      {lab.objectives.length > 0 && (
        <section className="course-card p-5 md:p-6">
          <h2 className="text-xl font-semibold">Learning objectives</h2>
          <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {lab.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        {lab.exercises.map((ex) => {
          const exDone = isOfficialLabExerciseComplete(
            progress,
            lab.id,
            ex.id,
          );
          return (
            <article
              key={ex.id}
              id={ex.id}
              className={`course-card space-y-3 p-5 ${exDone ? "ms-lab-done" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <label className="flex cursor-pointer items-start gap-3 font-semibold">
                  <Checkbox
                    className="mt-1"
                    checked={exDone}
                    onCheckedChange={(v) => {
                      saveCourseProgress(
                        setOfficialLabExercise(
                          progress,
                          lab.id,
                          ex.id,
                          v === true,
                          exerciseIds,
                        ),
                      );
                      refresh();
                    }}
                  />
                  <span>
                    Exercise {ex.number}: {ex.title}
                  </span>
                </label>
                <span className="ms-badge">{ex.minutes} min</span>
              </div>
              {ex.scenario && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {ex.scenario}
                </p>
              )}
              {ex.tasks.map((task) => (
                <details
                  key={task.id}
                  className="ms-task rounded-xl border border-[var(--course-line)] bg-[var(--ms-soft)]/50"
                  open={!exDone}
                >
                  <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--ms-accent)]">
                    Task {task.number}: {task.title}
                  </summary>
                  <ol className="space-y-2 border-t border-[var(--course-line)] px-4 py-3 text-sm leading-relaxed">
                    {task.steps.map((step, idx) => (
                      <li key={`${task.id}-${idx}`} className="ml-4 list-decimal">
                        {step}
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </article>
          );
        })}
      </section>

      <aside className="course-card bg-[var(--ms-badge-bg)] p-4 text-sm leading-relaxed">
        <p className="text-muted-foreground">
          Adapted under MIT from{" "}
          <a
            className="font-semibold text-[var(--ms-accent)]"
            href={lab.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {lab.sourcePath}
          </a>
          . {officialLabsCatalog.attribution.copyright}. Prefer the{" "}
          <a
            className="font-semibold text-[var(--ms-accent)]"
            href={lab.officialUrl}
            target="_blank"
            rel="noreferrer"
          >
            official page
          </a>{" "}
          if wording differs.
        </p>
      </aside>
    </div>
  );
}
