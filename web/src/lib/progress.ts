import type { ContentTag, ProgressState, QuestionAttempt } from '../types'
import { nextReviewDueAt } from './relearning'

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
  const now = new Date().toISOString()
  if (!completed) {
    return {
      ...state,
      lastModuleId: moduleId,
      modules: {
        ...state.modules,
        [moduleId]: {
          ...existing,
          completed: false,
          completedAt: undefined,
          reviewDueAt: undefined,
          inRelearnSession: false,
        },
      },
    }
  }

  const relearnCount = existing.inRelearnSession
    ? (existing.relearnCount ?? 0) + 1
    : (existing.relearnCount ?? 0)

  return {
    ...state,
    lastModuleId: moduleId,
    modules: {
      ...state.modules,
      [moduleId]: {
        ...existing,
        completed: true,
        completedAt: now,
        relearnCount,
        inRelearnSession: false,
        reviewDueAt: nextReviewDueAt(now, relearnCount),
      },
    },
  }
}

/** Start a spaced relearning session: clear attempts, keep relearn schedule history. */
export function beginRelearnSession(
  state: ProgressState,
  moduleId: string,
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
        completed: false,
        completedAt: undefined,
        reviewDueAt: undefined,
        inRelearnSession: true,
        attempts: {},
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

export function setLectureWatched(
  state: ProgressState,
  moduleId: string,
  lectureKey: string,
  watched: boolean,
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
        watchedLectures: {
          ...(existing.watchedLectures ?? {}),
          [lectureKey]: watched,
        },
      },
    },
  }
}
