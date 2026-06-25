import { studyDatabase } from "../database/studyDatabase";
import type { AppSetting, CardProgress, StudyBackup, StudySession } from "../../shared/types/models";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCardProgress(value: unknown): value is CardProgress {
  if (!isObject(value)) return false;
  return typeof value.cardId === "string"
    && (value.score === 0 || value.score === 1 || value.score === 2)
    && typeof value.repetitions === "number"
    && typeof value.intervalDays === "number"
    && typeof value.nextReviewAt === "string"
    && typeof value.lastReviewedAt === "string"
    && typeof value.lapses === "number";
}

function isSession(value: unknown): value is StudySession {
  if (!isObject(value)) return false;
  return typeof value.id === "string"
    && (value.mode === "flashcards" || value.mode === "quiz" || value.mode === "review")
    && typeof value.startedAt === "string"
    && typeof value.reviewedCards === "number"
    && typeof value.correctAnswers === "number";
}

function isSetting(value: unknown): value is AppSetting {
  return isObject(value) && typeof value.key === "string" && "value" in value;
}

export function parseBackup(value: unknown): StudyBackup {
  if (!isObject(value)
    || value.schemaVersion !== 1
    || typeof value.exportedAt !== "string"
    || !Array.isArray(value.cardProgress)
    || !Array.isArray(value.studySessions)
    || !Array.isArray(value.settings)
    || !value.cardProgress.every(isCardProgress)
    || !value.studySessions.every(isSession)
    || !value.settings.every(isSetting)) {
    throw new Error("Invalid backup");
  }
  return value as unknown as StudyBackup;
}

export async function exportBackup(): Promise<StudyBackup> {
  const [cardProgress, studySessions, settings] = await Promise.all([
    studyDatabase.cardProgress.toArray(),
    studyDatabase.studySessions.toArray(),
    studyDatabase.settings.toArray()
  ]);
  return { schemaVersion: 1, exportedAt: new Date().toISOString(), cardProgress, studySessions, settings };
}

export async function importBackup(value: unknown): Promise<void> {
  const backup = parseBackup(value);
  await studyDatabase.transaction("rw", studyDatabase.cardProgress, studyDatabase.studySessions, studyDatabase.settings, async () => {
    await Promise.all([
      studyDatabase.cardProgress.clear(),
      studyDatabase.studySessions.clear(),
      studyDatabase.settings.clear()
    ]);
    await studyDatabase.cardProgress.bulkAdd(backup.cardProgress);
    await studyDatabase.studySessions.bulkAdd(backup.studySessions);
    await studyDatabase.settings.bulkAdd(backup.settings);
  });
}
