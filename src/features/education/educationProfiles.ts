export type EducationLevel = "school" | "university" | "professional" | "independent";

export interface EducationProfile {
  id: EducationLevel;
  title: string;
  description: string;
  studyLabel: string;
  sectionSingular: string;
  sectionPlural: string;
}

export const EDUCATION_LEVEL_SETTING_KEY = "education-level";

export const educationProfiles: readonly EducationProfile[] = [
  {
    id: "school",
    title: "School",
    description: "For primary and secondary school subjects.",
    studyLabel: "Subject",
    sectionSingular: "Topic",
    sectionPlural: "Topics",
  },
  {
    id: "university",
    title: "University",
    description: "For college and university courses.",
    studyLabel: "Course",
    sectionSingular: "Topic",
    sectionPlural: "Topics",
  },
  {
    id: "professional",
    title: "Professional training",
    description: "For certifications and workplace learning.",
    studyLabel: "Training course",
    sectionSingular: "Module",
    sectionPlural: "Modules",
  },
  {
    id: "independent",
    title: "Independent learning",
    description: "For personal study and self-directed learning.",
    studyLabel: "Study area",
    sectionSingular: "Topic",
    sectionPlural: "Topics",
  },
] as const;

export function getEducationProfile(value: unknown): EducationProfile | null {
  if (typeof value !== "string") return null;
  return educationProfiles.find((profile) => profile.id === value) ?? null;
}
