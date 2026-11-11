import { createEmptyCard, fsrs, generatorParameters, type Card, type Grade } from "ts-fsrs";

export type DaySources = {
  microsoft: boolean;
  udemy: boolean;
};

export type CourseStepState = {
  resourcesRead?: boolean;
  labChecked?: Record<string, boolean>;
  videosWatched?: Record<string, boolean>;
  /** Which study companions to show for this day (default: both on). */
  sources?: DaySources;
};

/** Official AB-650 Microsoft Learning hands-on lab progress */
export type OfficialLabProgress = {
  /** Exercise id → completed */
  exercises: Record<string, boolean>;
  completed?: boolean;
  completedAt?: string;
};

export type CourseProgress = {
  version: 1;
  code: string;
  done: Record<string, boolean>; // day key "1"
  steps: Record<string, CourseStepState>;
  review: Record<string, Card>;
  /** lab id → per-exercise checkboxes (official MS Learning labs) */
  officialLabs?: Record<string, OfficialLabProgress>;
  last?: string; // day key
  lastOfficialLabId?: string;
  updatedAt: string;
};

export type ProgressBundle = {
  version: 1;
  courses: Record<string, CourseProgress>;
  migratedFromAb650?: boolean;
};

const BUNDLE_KEY = "courses-progress-bundle-v1";
const LEGACY_AB650 = "ab650-portal-progress-v1";

const scheduler = fsrs(generatorParameters({ enable_fuzz: false }));

export function emptyCourseProgress(code: string): CourseProgress {
  return {
    version: 1,
    code,
    done: {},
    steps: {},
    review: {},
    updatedAt: new Date().toISOString(),
  };
}

export function storageKey(code: string): string {
  return `courses:${code}:v1`;
}

function canUseStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function loadBundle(): ProgressBundle {
  if (!canUseStorage()) {
    return { version: 1, courses: {} };
  }
  try {
    const raw = localStorage.getItem(BUNDLE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressBundle;
      if (parsed?.version === 1) return parsed;
    }
  } catch {
    /* ignore */
  }
  return migrateLegacyAb650();
}

function migrateLegacyAb650(): ProgressBundle {
  const bundle: ProgressBundle = { version: 1, courses: {}, migratedFromAb650: false };
  try {
    const raw = localStorage.getItem(LEGACY_AB650);
    if (!raw) return bundle;
    const legacy = JSON.parse(raw) as {
      modules?: Record<
        string,
        {
          completed?: boolean;
          watchedLectures?: Record<string, boolean>;
        }
      >;
      lastModuleId?: string;
    };
    const course = emptyCourseProgress("AB-650");
    const map: Record<string, string> = {
      "d1-tenant": "1",
      "d2-workloads": "2",
      "d3-identity": "3",
      "d4-auth": "4",
      "d5-defender": "5",
      "d6-purview": "6",
      "d7-copilot": "7",
      "d8-agents": "8",
      "d9-monitor": "9",
      "d10-practice": "10",
    };
    for (const [modId, dayKey] of Object.entries(map)) {
      const m = legacy.modules?.[modId];
      if (!m) continue;
      if (m.completed) course.done[dayKey] = true;
      if (m.watchedLectures) {
        course.steps[dayKey] = {
          ...(course.steps[dayKey] ?? {}),
          videosWatched: m.watchedLectures,
        };
      }
    }
    if (legacy.lastModuleId && map[legacy.lastModuleId]) {
      course.last = map[legacy.lastModuleId];
    }
    bundle.courses["AB-650"] = course;
    bundle.migratedFromAb650 = true;
    saveBundle(bundle);
    localStorage.setItem(storageKey("AB-650"), JSON.stringify(course));
  } catch {
    /* ignore */
  }
  return bundle;
}

export function saveBundle(bundle: ProgressBundle): void {
  if (!canUseStorage()) return;
  const next: ProgressBundle = { ...bundle, version: 1 };
  localStorage.setItem(BUNDLE_KEY, JSON.stringify(next));
  for (const [code, course] of Object.entries(next.courses)) {
    localStorage.setItem(storageKey(code), JSON.stringify(course));
  }
}

export function loadCourseProgress(code: string): CourseProgress {
  if (!canUseStorage()) {
    return emptyCourseProgress(code);
  }
  const bundle = loadBundle();
  if (bundle.courses[code]) return bundle.courses[code]!;
  try {
    const raw = localStorage.getItem(storageKey(code));
    if (raw) {
      const parsed = JSON.parse(raw) as CourseProgress;
      if (parsed?.version === 1) {
        bundle.courses[code] = parsed;
        saveBundle(bundle);
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  const empty = emptyCourseProgress(code);
  bundle.courses[code] = empty;
  saveBundle(bundle);
  return empty;
}

export function saveCourseProgress(progress: CourseProgress): void {
  if (!canUseStorage()) return;
  const bundle = loadBundle();
  progress.updatedAt = new Date().toISOString();
  bundle.courses[progress.code] = progress;
  saveBundle(bundle);
}

export function exportAllProgress(): string {
  return JSON.stringify(loadBundle(), null, 2);
}

export function importAllProgress(json: string): ProgressBundle {
  const parsed = JSON.parse(json) as ProgressBundle;
  if (parsed?.version !== 1 || typeof parsed.courses !== "object") {
    throw new Error("Invalid progress file");
  }
  saveBundle(parsed);
  return parsed;
}

export function markDayComplete(
  progress: CourseProgress,
  dayKey: string,
  complete: boolean,
): CourseProgress {
  const done = { ...progress.done };
  const review = { ...progress.review };
  if (complete) {
    done[dayKey] = true;
    const card = review[dayKey] ?? createEmptyCard(new Date());
    const scheduled = scheduler.next(card, new Date(), 3 as Grade); // Good
    review[dayKey] = scheduled.card;
  } else {
    delete done[dayKey];
  }
  return {
    ...progress,
    done,
    review,
    last: dayKey,
    updatedAt: new Date().toISOString(),
  };
}

export function isReviewDue(card?: Card, now = new Date()): boolean {
  if (!card?.due) return false;
  return new Date(card.due).getTime() <= now.getTime();
}

export function setVideoWatched(
  progress: CourseProgress,
  dayKey: string,
  lecture: string,
  watched: boolean,
): CourseProgress {
  const step = { ...(progress.steps[dayKey] ?? {}) };
  const videos = { ...(step.videosWatched ?? {}) };
  videos[lecture] = watched;
  step.videosWatched = videos;
  return {
    ...progress,
    steps: { ...progress.steps, [dayKey]: step },
    last: dayKey,
    updatedAt: new Date().toISOString(),
  };
}

export function setLabChecked(
  progress: CourseProgress,
  dayKey: string,
  step: string,
  checked: boolean,
): CourseProgress {
  const st = { ...(progress.steps[dayKey] ?? {}) };
  const lab = { ...(st.labChecked ?? {}) };
  lab[step] = checked;
  st.labChecked = lab;
  return {
    ...progress,
    steps: { ...progress.steps, [dayKey]: st },
    last: dayKey,
    updatedAt: new Date().toISOString(),
  };
}

export function setResourcesRead(
  progress: CourseProgress,
  dayKey: string,
  read: boolean,
): CourseProgress {
  const st = { ...(progress.steps[dayKey] ?? {}), resourcesRead: read };
  return {
    ...progress,
    steps: { ...progress.steps, [dayKey]: st },
    last: dayKey,
    updatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_DAY_SOURCES: DaySources = {
  microsoft: true,
  udemy: true,
};

export function getDaySources(
  progress: CourseProgress,
  dayKey: string,
): DaySources {
  const raw = progress.steps[dayKey]?.sources;
  if (!raw) return { ...DEFAULT_DAY_SOURCES };
  return {
    microsoft: raw.microsoft !== false,
    udemy: raw.udemy !== false,
  };
}

export function setDaySources(
  progress: CourseProgress,
  dayKey: string,
  sources: DaySources,
): CourseProgress {
  // Keep at least one source enabled
  const next: DaySources =
    sources.microsoft || sources.udemy
      ? sources
      : { microsoft: true, udemy: false };
  const st = { ...(progress.steps[dayKey] ?? {}), sources: next };
  return {
    ...progress,
    steps: { ...progress.steps, [dayKey]: st },
    last: dayKey,
    updatedAt: new Date().toISOString(),
  };
}

export const SOURCES_EVENT = "course-day-sources";

export function applySourceVisibility(sources: DaySources): void {
  if (typeof document === "undefined") return;
  document.querySelectorAll<HTMLElement>("[data-source='microsoft']").forEach(
    (el) => {
      el.hidden = !sources.microsoft;
    },
  );
  document.querySelectorAll<HTMLElement>("[data-source='udemy']").forEach(
    (el) => {
      el.hidden = !sources.udemy;
    },
  );
}

function officialLabEntry(
  progress: CourseProgress,
  labId: string,
): OfficialLabProgress {
  return progress.officialLabs?.[labId] ?? { exercises: {} };
}

export function isOfficialLabExerciseComplete(
  progress: CourseProgress,
  labId: string,
  exerciseId: string,
): boolean {
  return Boolean(progress.officialLabs?.[labId]?.exercises?.[exerciseId]);
}

export function setOfficialLabExercise(
  progress: CourseProgress,
  labId: string,
  exerciseId: string,
  completed: boolean,
  allExerciseIds: string[],
): CourseProgress {
  const existing = officialLabEntry(progress, labId);
  const exercises = { ...existing.exercises };
  if (completed) exercises[exerciseId] = true;
  else delete exercises[exerciseId];
  const allDone = allExerciseIds.every((id) => Boolean(exercises[id]));
  return {
    ...progress,
    lastOfficialLabId: labId,
    officialLabs: {
      ...(progress.officialLabs ?? {}),
      [labId]: {
        exercises,
        completed: allDone,
        completedAt: allDone ? new Date().toISOString() : undefined,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

export function setOfficialLabComplete(
  progress: CourseProgress,
  labId: string,
  completed: boolean,
  exerciseIds: string[],
): CourseProgress {
  const exercises: Record<string, boolean> = {};
  if (completed) {
    for (const id of exerciseIds) exercises[id] = true;
  }
  return {
    ...progress,
    lastOfficialLabId: labId,
    officialLabs: {
      ...(progress.officialLabs ?? {}),
      [labId]: {
        exercises,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

export function isOfficialLabComplete(
  progress: CourseProgress,
  labId: string,
  exerciseIds: string[],
): boolean {
  const entry = progress.officialLabs?.[labId];
  if (entry?.completed) return true;
  return exerciseIds.every((id) => Boolean(entry?.exercises?.[id]));
}

export function officialLabMinutesCompleted(
  progress: CourseProgress,
  exercises: { labId: string; exerciseId: string; minutes: number }[],
): number {
  let done = 0;
  for (const ex of exercises) {
    if (isOfficialLabExerciseComplete(progress, ex.labId, ex.exerciseId)) {
      done += ex.minutes;
    }
  }
  return done;
}
