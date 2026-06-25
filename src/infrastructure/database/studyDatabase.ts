import Dexie, { type EntityTable } from "dexie";
import type { AppSetting, CardProgress, StudySession } from "../../shared/types/models";

class StudyDatabase extends Dexie {
  cardProgress!: EntityTable<CardProgress, "cardId">;
  studySessions!: EntityTable<StudySession, "id">;
  settings!: EntityTable<AppSetting, "key">;

  constructor() {
    super("generic-study-app");
    this.version(1).stores({
      cardProgress: "&cardId,nextReviewAt,score",
      studySessions: "&id,mode,startedAt,completedAt",
      settings: "&key"
    });
  }
}

export const studyDatabase = new StudyDatabase();
