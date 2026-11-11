import az140LabsJson from "./az140Labs.json";
import labsJson from "./officialLabs.json";

export type LabTask = {
  id: string;
  number: number;
  title: string;
  steps: string[];
};

export type LabExercise = {
  id: string;
  number: number;
  title: string;
  minutes: number;
  scenario: string;
  tasks: LabTask[];
};

export type OfficialLab = {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  level: number;
  objectives: string[];
  slug: string;
  sourcePath: string;
  officialUrl: string;
  sourceUrl: string;
  labFiles: string[];
  learningPath: number;
  exercises: LabExercise[];
};

export type OfficialLearningPath = {
  number: number;
  title: string;
  learnUrl: string;
  duration: number;
  labs: OfficialLab[];
};

export type OfficialLabsCatalog = {
  attribution: {
    license: string;
    copyright: string;
    sourceRepo: string;
    officialSite: string;
    notice: string;
  };
  totalLabs: number;
  totalMinutes: number;
  /** Short line under the labs title. */
  summary?: string;
  learningPaths: OfficialLearningPath[];
};

export const officialLabsCatalog = labsJson as OfficialLabsCatalog;

const catalogs: Record<string, OfficialLabsCatalog> = {
  "AB-650": officialLabsCatalog,
  "AZ-140": az140LabsJson as OfficialLabsCatalog,
};

export function getLabCatalog(code: string): OfficialLabsCatalog | undefined {
  return catalogs[code];
}

export const TOTAL_OFFICIAL_LAB_MINUTES = officialLabsCatalog.totalMinutes;

export function getAllOfficialLabs(code = "AB-650"): OfficialLab[] {
  return (
    getLabCatalog(code)?.learningPaths.flatMap((lp) => lp.labs) ?? []
  );
}

export function getOfficialLabById(
  labId: string,
  code = "AB-650",
): OfficialLab | undefined {
  return getAllOfficialLabs(code).find((lab) => lab.id === labId);
}

export function getLearningPathForLab(
  lab: OfficialLab,
  code = "AB-650",
): OfficialLearningPath | undefined {
  return getLabCatalog(code)?.learningPaths.find(
    (lp) => lp.number === lab.learningPath,
  );
}

export function getAllOfficialExercises(): {
  lab: OfficialLab;
  exercise: LabExercise;
}[] {
  return getAllOfficialLabs().flatMap((lab) =>
    lab.exercises.map((exercise) => ({ lab, exercise })),
  );
}
