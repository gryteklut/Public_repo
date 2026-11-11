import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProgress } from "@/hooks/useProgress";
import type { Day, Module, Question } from "@/types";

type Props = {
  day: Day;
  module: Module;
};

export function Quiz({ day, module }: Props) {
  const {
    isQuestionCorrect,
    allQuestionsCorrect,
    submitAnswer,
    isModuleComplete,
    setCompleted,
    clearModule,
  } = useProgress();

  const questionIds = module.questions.map((q) => q.id);
  const unlocked = allQuestionsCorrect(module.id, questionIds);
  const completed = isModuleComplete(module.id);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {day.isPracticeDay ? "Practice questions" : "Learn, then check"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {day.isPracticeDay
            ? "Quiz-first practice day. Expand “Study this topic” only if you need a refresher."
            : "Expand the study panel above each question to learn the topic, then answer. Pure drilling is Day 10."}
        </p>
      </div>

      <ol className="space-y-4">
        {module.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            moduleId={module.id}
            question={question}
            index={index}
            practiceMode={Boolean(day.isPracticeDay)}
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

      <div className="bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
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
  practiceMode,
  alreadyCorrect,
  onSubmit,
}: {
  moduleId: string;
  question: Question;
  index: number;
  practiceMode: boolean;
  alreadyCorrect: boolean;
  onSubmit: (selectedIndex: number) => boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(alreadyCorrect);
  const [wasCorrect, setWasCorrect] = useState(alreadyCorrect);
  const [studyOpen, setStudyOpen] = useState(!practiceMode);

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = onSubmit(selected);
    setWasCorrect(correct);
    setRevealed(true);
  };

  return (
    <li
      className={`bg-card rounded-2xl border p-5 shadow-xs ${alreadyCorrect ? "border-foreground/25" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Question {index + 1}
        </span>
        {alreadyCorrect && (
          <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
            Correct
          </span>
        )}
      </div>

      <details
        className="bg-muted/40 mb-4 rounded-xl border p-3"
        open={studyOpen}
        onToggle={(e) => setStudyOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-medium">
          Study this topic
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

      <p className="font-medium leading-relaxed">{question.prompt}</p>

      <div
        className="mt-4 space-y-2"
        role="radiogroup"
        aria-label={`Answers for question ${index + 1}`}
      >
        {question.choices.map((choice, choiceIndex) => {
          const id = `${moduleId}-${question.id}-${choiceIndex}`;
          return (
            <label
              key={id}
              className={`hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                selected === choiceIndex ? "border-foreground/40" : ""
              }`}
            >
              <input
                type="radio"
                className="mt-1"
                name={`${moduleId}-${question.id}`}
                value={choiceIndex}
                checked={selected === choiceIndex}
                disabled={alreadyCorrect}
                onChange={() => {
                  setSelected(choiceIndex);
                  setRevealed(false);
                }}
              />
              <span>{choice}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          disabled={selected === null || alreadyCorrect}
          onClick={handleSubmit}
        >
          {alreadyCorrect ? "Answered" : "Check answer"}
        </Button>
      </div>

      {revealed && (
        <div
          className={`mt-4 rounded-xl border p-4 text-sm ${
            wasCorrect
              ? "bg-muted/60"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <strong>{wasCorrect ? "Correct" : "Not yet"}</strong>
          <p className="mt-2 leading-relaxed">{question.explanation}</p>
          <p className="text-muted-foreground mt-2">
            Correct answer: {question.choices[question.correctIndex]}
          </p>
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
