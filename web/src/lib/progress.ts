import type { ContentTag, ProgressState, QuestionAttempt } from '../types'

const STORAGE_KEY = 'ab650-portal-progress-v1'

export function emptyProgress(): ProgressState {
  return {
    version: 1,
    modules: {},
    tagFilter: 'all',
    updatedAt: new Date().toISOString(),
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as ProgressState
    if (parsed?.version !== 1 || typeof parsed.modules !== 'object') {
      return emptyProgress()
    }
    return parsed
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(state: ProgressState): void {
  const next = { ...state, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function exportProgress(state: ProgressState): string {
  return JSON.stringify(state, null, 2)
}

export function importProgress(json: string): ProgressState {
  const parsed = JSON.parse(json) as ProgressState
  if (parsed?.version !== 1 || typeof parsed.modules !== 'object') {
    throw new Error('Invalid progress file')
  }
  saveProgress(parsed)
  return parsed
}

export function recordAttempt(
  state: ProgressState,
  moduleId: string,
  questionId: string,
  attempt: QuestionAttempt,
): ProgressState {
  const existing = state.modules[moduleId] ?? {
    completed: false,
    attempts: {},
  }
  return {
    ...state,
    lastModuleId: moduleId,
    modules: {
      ...state.modules,
      [moduleId]: {
        ...existing,
        attempts: {
          ...existing.attempts,
          [questionId]: attempt,
        },
      },
    },
  }
}

export function markModuleComplete(
  state: ProgressState,
  moduleId: string,
  completed: boolean,
): ProgressState {
  const existing = state.modules[moduleId] ?? {
    completed: false,
    attempts: {},
  }
  return {
    ...state,
    lastModuleId: moduleId,
    modules: {
      ...state.modules,
      [moduleId]: {
        ...existing,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      },
    },
  }
}

export function setTagFilter(
  state: ProgressState,
  tagFilter: ContentTag | 'all',
): ProgressState {
  return { ...state, tagFilter }
}

export function resetModule(
  state: ProgressState,
  moduleId: string,
): ProgressState {
  const next = { ...state.modules }
  delete next[moduleId]
  return { ...state, modules: next }
}
