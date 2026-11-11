/** Companion SkillsUp / skills-training links per module (day overview sidebar). */
export type SkillsUpLink = {
  label: string;
  url: string;
};

const STUDY_GUIDE =
  "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650";
const OFFICIAL_COURSE =
  "https://learn.microsoft.com/en-us/training/courses/ab-650t00";
const CERT_PAGE =
  "https://learn.microsoft.com/en-us/credentials/certifications/microsoft-365-and-ai-services-administrator-associate/";

const SHARED: SkillsUpLink[] = [
  {
    label: "AB-650 skills measured (study guide)",
    url: STUDY_GUIDE,
  },
  {
    label: "Official course AB-650T00",
    url: OFFICIAL_COURSE,
  },
  {
    label: "Certification overview",
    url: CERT_PAGE,
  },
];

const BY_MODULE: Record<string, SkillsUpLink[]> = {
  "d1-tenant": [
    {
      label: "Skills: configure & manage a Microsoft 365 tenant",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d2-workloads": [
    {
      label: "Skills: manage Microsoft 365 workloads",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d3-identity": [
    {
      label: "Skills: manage identities in Microsoft Entra",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d4-auth": [
    {
      label: "Skills: authentication & Conditional Access",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d5-defender": [
    {
      label: "Skills: secure workloads (Defender for Office 365)",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d6-purview": [
    {
      label: "Skills: Purview & DSPM for AI",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d7-copilot": [
    {
      label: "Skills: enable & manage Microsoft 365 Copilot",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d8-agents": [
    {
      label: "Skills: implement, manage & govern agents",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d9-monitor": [
    {
      label: "Skills: monitor AI services in Microsoft 365",
      url: STUDY_GUIDE,
    },
    ...SHARED.slice(1),
  ],
  "d10-practice": SHARED,
};

export function getSkillsUpLinks(moduleId: string): SkillsUpLink[] {
  return BY_MODULE[moduleId] ?? SHARED;
}
