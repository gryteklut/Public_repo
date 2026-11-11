import { useState } from 'react'
import type { Day, Module, Question } from '../types'
import { useProgress } from '../hooks/useProgress'

type Props = {
  day: Day
  module: Module
}

export function Quiz({ day, module }: Props) {
  const {
    isQuestionCorrect,
    allQuestionsCorrect,
    submitAnswer,
    isModuleComplete,
    setCompleted,
    clearModule,
  } = useProgress()

  const questionIds = module.questions.map((q) => q.id)
  const unlocked = allQuestionsCorrect(module.id, questionIds)
  const completed = isModuleComplete(module.id)

  return (
    <section className="quiz-section">
      <div className="section-heading-row">
        <div>
          <h2>{day.isPracticeDay ? 'Practice questions' : 'Learn, then check'}</h2>
          <p className="muted">
            {day.isPracticeDay
              ? 'Quiz-first practice day. Expand “Study this topic” only if you need a refresher.'
              : 'Expand the study panel above each question to learn the topic, then answer. Pure drilling is Day 10.'}
          </p>
        </div>
      </div>

      <ol className="question-list">
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

      <div className="completion-gate">
        <label
          className={`done-check ${unlocked ? '' : 'locked'}`}
          title={
            unlocked
              ? 'Mark this module complete'
              : 'Answer every question correctly to unlock'
          }
        >
          <input
            type="checkbox"
            checked={completed}
            disabled={!unlocked && !completed}
            onChange={(e) => {
              if (!unlocked && e.target.checked) return
              setCompleted(module.id, e.target.checked)
            }}
          />
          <span>
            Mark module complete
            {!unlocked && !completed ? ' (locked until all answers are correct)' : ''}
          </span>
        </label>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => clearModule(module.id)}
        >
          Reset module answers
        </button>
      </div>
    </section>
  )
}

function QuestionCard({
  moduleId,
  question,
  index,
  practiceMode,
  alreadyCorrect,
  onSubmit,
}: {
  moduleId: string
  question: Question
  index: number
  practiceMode: boolean
  alreadyCorrect: boolean
  onSubmit: (selectedIndex: number) => boolean
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(alreadyCorrect)
  const [wasCorrect, setWasCorrect] = useState(alreadyCorrect)
  const [studyOpen, setStudyOpen] = useState(!practiceMode)

  const handleSubmit = () => {
    if (selected === null) return
    const correct = onSubmit(selected)
    setWasCorrect(correct)
    setRevealed(true)
  }

  return (
    <li className={`question-card ${alreadyCorrect ? 'is-correct' : ''}`}>
      <div className="question-top">
        <span className="q-index">Question {index + 1}</span>
        {alreadyCorrect && <span className="pill success">Correct</span>}
      </div>

      <details
        className="study-panel"
        open={studyOpen}
        onToggle={(e) => setStudyOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary>Study this topic</summary>
        <div className="study-body">
          <p>{question.studyContent}</p>
          <a
            className="learn-link"
            href={question.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Microsoft Learn / docs: {question.sourceLabel}
          </a>
        </div>
      </details>

      <p className="prompt">{question.prompt}</p>

      <div className="choices" role="radiogroup" aria-label={`Answers for question ${index + 1}`}>
        {question.choices.map((choice, choiceIndex) => {
          const id = `${moduleId}-${question.id}-${choiceIndex}`
          return (
            <label key={id} className="choice">
              <input
                type="radio"
                name={`${moduleId}-${question.id}`}
                value={choiceIndex}
                checked={selected === choiceIndex}
                disabled={alreadyCorrect}
                onChange={() => {
                  setSelected(choiceIndex)
                  setRevealed(false)
                }}
              />
              <span>{choice}</span>
            </label>
          )
        })}
      </div>

      <div className="question-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={selected === null || alreadyCorrect}
          onClick={handleSubmit}
        >
          {alreadyCorrect ? 'Answered' : 'Check answer'}
        </button>
      </div>

      {revealed && (
        <div className={`feedback ${wasCorrect ? 'ok' : 'bad'}`}>
          <strong>{wasCorrect ? 'Correct' : 'Not yet'}</strong>
          <p>{question.explanation}</p>
          <p className="feedback-answer">
            Correct answer: {question.choices[question.correctIndex]}
          </p>
          <a
            className="learn-link"
            href={question.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Source: {question.sourceLabel}
          </a>
        </div>
      )}
    </li>
  )
}
