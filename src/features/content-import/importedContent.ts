import type { Flashcard, StudyUnit } from "../../shared/types/models";

export const IMPORTED_UNITS_SETTING_KEY = "imported-study-units";
export const IMPORTED_FLASHCARDS_SETTING_KEY = "imported-flashcards";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${field}`);
  }
  return value.trim();
}

function readPositiveInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

function readStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Invalid ${field}`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function extractArray(value: unknown, property: "units" | "flashcards"): unknown[] {
  const candidate = isRecord(value) ? value[property] : value;
  if (!Array.isArray(candidate)) throw new Error(`Expected a ${property} array`);
  return candidate;
}

export function parseImportedUnits(value: unknown): StudyUnit[] {
  const rows = extractArray(value, "units");
  const ids = new Set<string>();

  return rows.map((row) => {
    if (!isRecord(row)) throw new Error("Invalid unit record");
    const unit: StudyUnit = {
      id: readString(row.id, "unit id"),
      number: readPositiveInteger(row.number, "unit number"),
      title: readString(row.title, "unit title"),
      objectives: readStringArray(row.objectives, "unit objectives"),
      summary: readStringArray(row.summary, "unit summary"),
      keyTerms: readStringArray(row.keyTerms, "unit key terms"),
    };
    if (ids.has(unit.id)) throw new Error(`Duplicate unit id: ${unit.id}`);
    ids.add(unit.id);
    return unit;
  });
}

export function parseImportedFlashcards(value: unknown): Flashcard[] {
  const rows = extractArray(value, "flashcards");
  const ids = new Set<string>();

  return rows.map((row) => {
    if (!isRecord(row)) throw new Error("Invalid flashcard record");
    const card: Flashcard = {
      id: readString(row.id, "flashcard id"),
      unitId: readString(row.unitId, "flashcard unit id"),
      number: readPositiveInteger(row.number, "flashcard number"),
      question: readString(row.question, "flashcard question"),
      answer: readString(row.answer, "flashcard answer"),
      tags: readStringArray(row.tags, "flashcard tags"),
    };
    if (ids.has(card.id)) throw new Error(`Duplicate flashcard id: ${card.id}`);
    ids.add(card.id);
    return card;
  });
}

export function parseStoredUnits(value: unknown): StudyUnit[] {
  try {
    return parseImportedUnits(value);
  } catch {
    return [];
  }
}

export function parseStoredFlashcards(value: unknown): Flashcard[] {
  try {
    return parseImportedFlashcards(value);
  } catch {
    return [];
  }
}

export function mergeById<T extends { id: string }>(builtIn: readonly T[], imported: readonly T[]): T[] {
  const merged = new Map<string, T>();
  for (const item of builtIn) merged.set(item.id, item);
  for (const item of imported) merged.set(item.id, item);
  return [...merged.values()];
}
