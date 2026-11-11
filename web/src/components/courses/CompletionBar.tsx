import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  isReviewDue,
  loadCourseProgress,
  markDayComplete,
  saveCourseProgress,
} from "@/lib/courseProgress";

type QuizProgress = {
  score: number;
  answered: number;
  total: number;
};

export function CompletionBar({ code, day }: { code: string; day: number }) {
  const [quiz, setQuiz] = useState<QuizProgress>({
    score: 0,
    answered: 0,
    total: 0,
  });
  const [tick, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  const done = Boolean(progress.done[String(day)]);
  const reviewDue = isReviewDue(progress.review[String(day)]);
  const unlocked = quiz.total > 0 && quiz.score === 100;
  void tick;

  useEffect(() => {
    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<QuizProgress>).detail;
      if (!detail || typeof detail.score !== "number") return;
      setQuiz(detail);
    };
    window.addEventListener("starlight-quiz:progress", onProgress);
    return () =>
      window.removeEventListener("starlight-quiz:progress", onProgress);
  }, []);

  return (
    <div className="course-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`day-complete-${day}`}
          checked={done}
          disabled={!unlocked && !done}
          onCheckedChange={(v) => {
            if (!unlocked && v) return;
            saveCourseProgress(
              markDayComplete(progress, String(day), v === true),
            );
            setTick((t) => t + 1);
          }}
        />
        <div>
          <Label htmlFor={`day-complete-${day}`}>
            Mark session complete
            {!unlocked && !done
              ? " (locked until knowledge check is 100%)"
              : ""}
          </Label>
          <p className="text-muted-foreground mt-1 text-xs">
            Quiz score: {quiz.score}%
            {quiz.total > 0 ? ` · ${quiz.answered}/${quiz.total} answered` : ""}
            {done && reviewDue ? " · spaced review due" : ""}
          </p>
        </div>
      </div>
      {done && reviewDue && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            saveCourseProgress(markDayComplete(progress, String(day), false));
            setTick((t) => t + 1);
          }}
        >
          Start relearn
        </Button>
      )}
    </div>
  );
}
