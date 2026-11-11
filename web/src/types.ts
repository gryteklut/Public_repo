export type ContentTag = 'MS-102-core' | 'MS-102-updated' | 'AB-650-new'

export type Question = {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
  sourceUrl: string
  sourceLabel: string
  /** Expandable study text shown above the question so you can learn before answering */
  studyContent: string
}

export type Module = {
  id: string
  title: string
  summary: string
  tags: ContentTag[]
  studyLinks: { label: string; url: string }[]
  labSteps?: string[]
  outOfScopeNote?: string
  questions: Question[]
}

export type Day = {
  id: string
  dayNumber: number
  title: string
  focus: string
  estimatedMinutes: number
  modules: Module[]
  /** Day 10-style: hide study panels by default and emphasize quiz-only practice */
  isPracticeDay?: boolean
}

export type QuestionAttempt = {
  selectedIndex: number
  correct: boolean
  answeredAt: string
}

export type ModuleProgress = {
  completed: boolean
  completedAt?: string
  /**
   * Successive relearning: next spaced retrieval session (ISO).
   * Set when a module is marked complete; cleared/pushed out after each relearn.
   */
  reviewDueAt?: string
  /** How many spaced relearning sessions completed after initial mastery */
  relearnCount?: number
  /** True while the learner is in a spaced relearning pass */
  inRelearnSession?: boolean
  attempts: Record<string, QuestionAttempt>
}

export type ProgressState = {
  version: 1
  modules: Record<string, ModuleProgress>
  lastModuleId?: string
  tagFilter?: ContentTag | 'all'
  updatedAt: string
}
