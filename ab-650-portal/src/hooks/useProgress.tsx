import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ContentTag, ProgressState } from '../types'
import { getAllModules } from '../data/curriculum'
import {
  exportProgress,
  importProgress,
  loadProgress,
  markModuleComplete,
  recordAttempt,
  resetModule,
  saveProgress,
  setTagFilter,
} from '../lib/progress'

type ProgressContextValue = {
  progress: ProgressState
  completedCount: number
  totalCount: number
  percentComplete: number
  isModuleComplete: (moduleId: string) => boolean
  isQuestionCorrect: (moduleId: string, questionId: string) => boolean
  allQuestionsCorrect: (moduleId: string, questionIds: string[]) => boolean
  submitAnswer: (
    moduleId: string,
    questionId: string,
    selectedIndex: number,
    correctIndex: number,
  ) => boolean
  setCompleted: (moduleId: string, completed: boolean) => void
  clearModule: (moduleId: string) => void
  updateTagFilter: (filter: ContentTag | 'all') => void
  downloadBackup: () => void
  uploadBackup: (file: File) => Promise<void>
  setLastModule: (moduleId: string) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const totalCount = getAllModules().length

  const apply = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev)
      if (next === prev) return prev
      saveProgress(next)
      return next
    })
  }, [])

  const completedCount = useMemo(
    () => Object.values(progress.modules).filter((m) => m.completed).length,
    [progress.modules],
  )

  const isModuleComplete = useCallback(
    (moduleId: string) => Boolean(progress.modules[moduleId]?.completed),
    [progress.modules],
  )

  const isQuestionCorrect = useCallback(
    (moduleId: string, questionId: string) =>
      Boolean(progress.modules[moduleId]?.attempts[questionId]?.correct),
    [progress.modules],
  )

  const allQuestionsCorrect = useCallback(
    (moduleId: string, questionIds: string[]) =>
      questionIds.every(
        (id) => progress.modules[moduleId]?.attempts[id]?.correct,
      ),
    [progress.modules],
  )

  const submitAnswer = useCallback(
    (
      moduleId: string,
      questionId: string,
      selectedIndex: number,
      correctIndex: number,
    ) => {
      const correct = selectedIndex === correctIndex
      apply((prev) =>
        recordAttempt(prev, moduleId, questionId, {
          selectedIndex,
          correct,
          answeredAt: new Date().toISOString(),
        }),
      )
      return correct
    },
    [apply],
  )

  const setCompleted = useCallback(
    (moduleId: string, completed: boolean) => {
      apply((prev) => markModuleComplete(prev, moduleId, completed))
    },
    [apply],
  )

  const clearModule = useCallback(
    (moduleId: string) => {
      apply((prev) => resetModule(prev, moduleId))
    },
    [apply],
  )

  const updateTagFilter = useCallback(
    (filter: ContentTag | 'all') => {
      apply((prev) => setTagFilter(prev, filter))
    },
    [apply],
  )

  const downloadBackup = useCallback(() => {
    const blob = new Blob([exportProgress(progress)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ab650-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [progress])

  const uploadBackup = useCallback(async (file: File) => {
    const text = await file.text()
    const next = importProgress(text)
    setProgress(next)
  }, [])

  const setLastModule = useCallback(
    (moduleId: string) => {
      apply((prev) =>
        prev.lastModuleId === moduleId
          ? prev
          : { ...prev, lastModuleId: moduleId },
      )
    },
    [apply],
  )

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      completedCount,
      totalCount,
      percentComplete:
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
      isModuleComplete,
      isQuestionCorrect,
      allQuestionsCorrect,
      submitAnswer,
      setCompleted,
      clearModule,
      updateTagFilter,
      downloadBackup,
      uploadBackup,
      setLastModule,
    }),
    [
      progress,
      completedCount,
      totalCount,
      isModuleComplete,
      isQuestionCorrect,
      allQuestionsCorrect,
      submitAnswer,
      setCompleted,
      clearModule,
      updateTagFilter,
      downloadBackup,
      uploadBackup,
      setLastModule,
    ],
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
