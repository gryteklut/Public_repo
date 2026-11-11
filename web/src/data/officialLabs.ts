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
  learningPaths: OfficialLearningPath[];
};

export const officialLabsCatalog = labsJson as OfficialLabsCatalog;

export const TOTAL_OFFICIAL_LAB_MINUTES = officialLabsCatalog.totalMinutes;

export function getAllOfficialLabs(): OfficialLab[] {
  return officialLabsCatalog.learningPaths.flatMap((lp) => lp.labs);
}

export function getOfficialLabById(labId: string): OfficialLab | undefined {
  return getAllOfficialLabs().find((lab) => lab.id === labId);
}

export function getLearningPathForLab(
  lab: OfficialLab,
): OfficialLearningPath | undefined {
  return officialLabsCatalog.learningPaths.find(
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
