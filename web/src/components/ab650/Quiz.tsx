import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProgress } from "@/hooks/useProgress";
import { formatReviewDue } from "@/lib/relearning";
import type { Day, Module, Question } from "@/types";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

type Props = {
  day: Day;
  module: Module;
  /** Day overview: tighter chrome, retrieval-first by default */
  compact?: boolean;
  /**
   * retrieval-first = try before study (testing effect).
   * learn-first = study panel open (encoding then check).
   */
  method?: "retrieval-first" | "learn-first";
};

export function Quiz({ day, module, compact = false, method }: Props) {
  const {
    isQuestionCorrect,
    allQuestionsCorrect,
    submitAnswer,
    isModuleComplete,
    setCompleted,
    clearModule,
    getModuleProgress,
    isModuleReviewDue,
    startRelearn,
  } = useProgress();

  const resolvedMethod: "retrieval-first" | "learn-first" =
    method ??
    (compact || day.isPracticeDay ? "retrieval-first" : "learn-first");

  const questionIds = module.questions.map((q) => q.id);
  const unlocked = allQuestionsCorrect(module.id, questionIds);
  const completed = isModuleComplete(module.id);
  const modProgress = getModuleProgress(module.id);
  const reviewDue = isModuleReviewDue(module.id);
  const correctCount = questionIds.filter((id) =>
    isQuestionCorrect(module.id, id),
  ).length;

  return (
    <section className={compact ? "space-y-5" : "space-y-6"}>
      {!compact && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {resolvedMethod === "retrieval-first"
              ? "Retrieval practice"
              : "Learn, then check"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {resolvedMethod === "retrieval-first"
              ? "Try each question from memory first (testing effect). Open study notes only after a miss, then re-check until correct — successive relearning to criterion."
              : "Expand the study panel above each question to learn the topic, then answer. Day overview uses retrieval-first for stronger retention."}
          </p>
        </div>
      )}

      {reviewDue && completed && (
        <div className="bg-[#d8f56a]/40 flex flex-col gap-3 rounded-2xl border border-[#d8f56a] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Spaced relearning due</p>
            <p className="text-muted-foreground text-xs">
              Research shows retrieving again after a delay beats one-and-done
              mastery. Session #{(modProgress?.relearnCount ?? 0) + 1} ·{" "}
              {formatReviewDue(modProgress?.reviewDueAt)}
            </p>
          </div>
          <Button type="button" onClick={() => startRelearn(module.id)}>
            Start relearn session
          </Button>
        </div>
      )}

      {modProgress?.inRelearnSession && (
        <p className="bg-muted rounded-xl px-3 py-2 text-xs font-medium">
          Relearning session in progress — answer every question correctly again,
          then mark complete to schedule the next spaced review.
        </p>
      )}

      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          Method:{" "}
          <strong className="text-foreground">
            {resolvedMethod === "retrieval-first"
              ? "retrieval practice"
              : "learn-first"}
          </strong>
        </span>
        <span>
          Criterion: {correctCount}/{questionIds.length} correct
        </span>
      </div>

      <ol className="space-y-4">
        {module.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            moduleId={module.id}
            question={question}
            index={index}
            retrievalFirst={resolvedMethod === "retrieval-first"}
            alreadyCorrect={isQuestionCorrect(module.id, question.id)}
            onSubmit={(selected) =>
              submitAnswer(
                module.id,
                question.id,
                selected,
                question.correctIndex,
              )
            }
          />
        ))}
      </ol>

      <div className="bg-muted/30 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`complete-${module.id}`}
            checked={completed}
            disabled={!unlocked && !completed}
            onCheckedChange={(checked) => {
              if (!unlocked && checked) return;
              setCompleted(module.id, checked === true);
            }}
          />
          <Label
            htmlFor={`complete-${module.id}`}
            className={!unlocked && !completed ? "text-muted-foreground" : ""}
          >
            Mark module complete
            {!unlocked && !completed
              ? " (locked until all answers are correct)"
              : modProgress?.reviewDueAt && completed
                ? ` · next review ${formatReviewDue(modProgress.reviewDueAt)}`
                : ""}
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => clearModule(module.id)}
        >
          Reset module answers
        </Button>
      </div>
    </section>
  );
}

function QuestionCard({
  moduleId,
  question,
  index,
  retrievalFirst,
  alreadyCorrect,
  onSubmit,
}: {
  moduleId: string;
  question: Question;
  index: number;
  retrievalFirst: boolean;
  alreadyCorrect: boolean;
  onSubmit: (selectedIndex: number) => boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(alreadyCorrect);
  const [wasCorrect, setWasCorrect] = useState(alreadyCorrect);
  const [studyOpen, setStudyOpen] = useState(
    alreadyCorrect ? false : !retrievalFirst,
  );
  const [missedOnce, setMissedOnce] = useState(false);

  useEffect(() => {
    if (alreadyCorrect) {
      setWasCorrect(true);
      setRevealed(true);
    }
  }, [alreadyCorrect]);

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = onSubmit(selected);
    setWasCorrect(correct);
    setRevealed(true);
    if (!correct) {
      setMissedOnce(true);
      setStudyOpen(true);
    }
  };

  return (
    <li
      className={`rounded-2xl border bg-white/70 p-4 shadow-xs md:p-5 dark:bg-card ${alreadyCorrect ? "border-foreground/20" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Question {index + 1}
        </span>
        {alreadyCorrect && (
          <span className="bg-[#d8f56a] text-foreground rounded-full px-2.5 py-1 text-xs font-semibold">
            Correct
          </span>
        )}
      </div>

      <p className="font-medium leading-relaxed">{question.prompt}</p>

      <div
        className="mt-4 grid gap-2"
        role="radiogroup"
        aria-label={`Answers for question ${index + 1}`}
      >
        {question.choices.map((choice, choiceIndex) => {
          const id = `${moduleId}-${question.id}-${choiceIndex}`;
          const letter = LETTERS[choiceIndex] ?? String(choiceIndex + 1);
          const active = selected === choiceIndex;
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors ${
                active
                  ? "border-foreground/40 bg-[#d8f56a]/25"
                  : "bg-muted/40 hover:bg-muted/70"
              } ${alreadyCorrect ? "opacity-80" : ""}`}
            >
              <input
                type="radio"
                className="sr-only"
                name={`${moduleId}-${question.id}`}
                value={choiceIndex}
                checked={active}
                disabled={alreadyCorrect}
                onChange={() => {
                  setSelected(choiceIndex);
                  setRevealed(false);
                }}
              />
              <span
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  active ? "bg-foreground text-background" : "bg-background border"
                }`}
              >
                {letter}
              </span>
              <span className="pt-0.5 leading-relaxed">{choice}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={selected === null || alreadyCorrect}
          onClick={handleSubmit}
        >
          {alreadyCorrect ? "Answered" : "Check answer"}
        </Button>
        {retrievalFirst && !alreadyCorrect && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStudyOpen((v) => !v)}
          >
            {studyOpen ? "Hide study notes" : "Study this topic"}
          </Button>
        )}
      </div>

      <details
        className="bg-muted/40 mt-4 rounded-xl border p-3"
        open={studyOpen}
        onToggle={(e) => setStudyOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-medium">
          Study this topic
          {missedOnce && !alreadyCorrect ? " (open after miss — then retry)" : ""}
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <p className="leading-relaxed">{question.studyContent}</p>
          <a
            className="font-medium underline-offset-4 hover:underline"
            href={question.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Microsoft Learn / docs: {question.sourceLabel}
          </a>
        </div>
      </details>

      {revealed && (
        <div
          className={`mt-4 rounded-xl border p-4 text-sm ${
            wasCorrect
              ? "border-[#d8f56a] bg-[#d8f56a]/20"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <strong>{wasCorrect ? "Correct — criterion hit" : "Not yet — retrieve again"}</strong>
          <p className="mt-2 leading-relaxed">{question.explanation}</p>
          {!wasCorrect && (
            <p className="text-muted-foreground mt-2 text-xs">
              Read the study notes, then pick again and check. The exact choice
              stays hidden until you retrieve it correctly.
            </p>
          )}
          {wasCorrect && (
            <p className="text-muted-foreground mt-2">
              Correct answer: {question.choices[question.correctIndex]}
            </p>
          )}
          <a
            className="mt-2 inline-block font-medium underline-offset-4 hover:underline"
            href={question.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Source: {question.sourceLabel}
          </a>
        </div>
      )}
    </li>
  );
}
