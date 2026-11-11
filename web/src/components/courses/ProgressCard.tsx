import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getAllOfficialExercises,
  TOTAL_OFFICIAL_LAB_MINUTES,
} from "@/data/officialLabs";
import {
  exportAllProgress,
  importAllProgress,
  isReviewDue,
  loadCourseProgress,
  officialLabMinutesCompleted,
} from "@/lib/courseProgress";
import { withBase } from "@/lib/base";

export function ProgressCard({
  courseSlug,
  code,
  totalDays,
}: {
  courseSlug: string;
  code: string;
  totalDays: number;
}) {
  const [, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const progress = loadCourseProgress(code);
  const doneCount = Object.values(progress.done).filter(Boolean).length;
  const percent =
    totalDays === 0 ? 0 : Math.round((doneCount / totalDays) * 100);
  const continueDay = Number(progress.last ?? "1") || 1;
  const due = Array.from({ length: totalDays }, (_, i) => i + 1).filter((d) =>
    isReviewDue(progress.review[String(d)]),
  );

  const showOfficialLabs = code === "AB-650";
  const labMinutesDone = showOfficialLabs
    ? officialLabMinutesCompleted(
        progress,
        getAllOfficialExercises().map(({ lab, exercise }) => ({
          labId: lab.id,
          exerciseId: exercise.id,
          minutes: exercise.minutes,
        })),
      )
    : 0;
  const labMinutesLeft = Math.max(
    0,
    TOTAL_OFFICIAL_LAB_MINUTES - labMinutesDone,
  );
  const labPercent =
    TOTAL_OFFICIAL_LAB_MINUTES === 0
      ? 0
      : Math.round((labMinutesDone / TOTAL_OFFICIAL_LAB_MINUTES) * 100);

  return (
    <div className="course-card space-y-4 p-5 shadow-xs">
      <div>
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {code} progress
        </p>
        <p className="mt-1 text-sm">
          {doneCount} / {totalDays} days · {percent}%
        </p>
        <Progress value={percent} className="mt-3 h-2" />
      </div>
      <Button className="w-full" asChild>
        <a href={withBase(`/courses/${courseSlug}/day-${continueDay}/`)}>
          {doneCount === 0 ? "Start day 1" : `Continue day ${continueDay}`}
        </a>
      </Button>
      {showOfficialLabs && (
        <div className="space-y-2 rounded-xl border border-[var(--course-line)] bg-[var(--ms-soft)]/60 p-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ms-accent)]">
            Official labs
          </p>
          <p className="text-sm">
            {labMinutesLeft} min remaining · {labMinutesDone}/
            {TOTAL_OFFICIAL_LAB_MINUTES}
          </p>
          <Progress value={labPercent} className="h-1.5" />
          <Button variant="secondary" className="w-full" asChild>
            <a href={withBase(`/courses/${courseSlug}/labs/`)}>Open labs</a>
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          type="button"
          onClick={() => {
            const blob = new Blob([exportAllProgress()], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `courses-progress-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          type="button"
          onClick={() => fileRef.current?.click()}
        >
          Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              importAllProgress(await f.text());
              setTick((t) => t + 1);
            }
            e.target.value = "";
          }}
        />
      </div>
      {due.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Spaced review due: day {due.join(", ")}
        </p>
      )}
    </div>
  );
}
