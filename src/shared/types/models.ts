export type Rating = 0 | 1 | 2;
export type StudyMode = "flashcards" | "quiz" | "review";

export interface StudyUnit {
  id: string;
  number: number;
  title: string;
  objectives: string[];
  summary: string[];
  keyTerms: string[];
}

export interface Flashcard {
  id: string;
  unitId: string;
  number: number;
  question: string;
  answer: string;
  tags: string[];
}

export interface CardProgress {
  cardId: string;
  score: Rating;
  repetitions: number;
  intervalDays: number;
  nextReviewAt: string;
  lastReviewedAt: string;
  lapses: number;
}

export interface StudySession {
  id: string;
  mode: StudyMode;
  startedAt: string;
  completedAt?: string;
  reviewedCards: number;
  correctAnswers: number;
}

export interface AppSetting {
  key: string;
  value: unknown;
}

export interface StudyBackup {
  schemaVersion: 1;
  exportedAt: string;
  cardProgress: CardProgress[];
  studySessions: StudySession[];
  settings: AppSetting[];
}
