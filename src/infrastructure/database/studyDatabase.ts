import Dexie, { type EntityTable } from "dexie";
import type { LocalStudyFile } from "../../features/study-materials/localStudyFiles";
import type { AppSetting, CardProgress, StudySession } from "../../shared/types/models";

class StudyDatabase extends Dexie {
  cardProgress!: EntityTable<CardProgress, "cardId">;
  studySessions!: EntityTable<StudySession, "id">;
  settings!: EntityTable<AppSetting, "key">;
  studyFiles!: EntityTable<LocalStudyFile, "id">;

  constructor() {
    super("generic-study-app");
    this.version(1).stores({
      cardProgress: "&cardId,nextReviewAt,score",
      studySessions: "&id,mode,startedAt,completedAt",
      settings: "&key"
    });
    this.version(2).stores({
      cardProgress: "&cardId,nextReviewAt,score",
      studySessions: "&id,mode,startedAt,completedAt",
      settings: "&key",
      studyFiles: "&id,createdAt,title"
    });
  }
}

export const studyDatabase = new StudyDatabase();
