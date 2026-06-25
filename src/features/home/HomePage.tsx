import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { studyConfig } from "../../app/studyConfig";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { isDue } from "../../shared/utils/date";
import { useStudyContent } from "../content-import/useStudyContent";

export function HomePage() {
  const { units, flashcards } = useStudyContent();
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), []) ?? [];
  const due = progress.filter((item) => isDue(item.nextReviewAt)).length;

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <p className="eyebrow">Your study space</p>
        <h2>{studyConfig.subjectName || "Start a new study collection"}</h2>
        <p>{studyConfig.description}</p>
      </section>
      <section className="stats-grid" aria-label="Study overview">
        <article className="stat-card"><strong>{units.length}</strong><span>{studyConfig.unitsLabel}</span></article>
        <article className="stat-card"><strong>{flashcards.length}</strong><span>Flashcards</span></article>
        <article className="stat-card"><strong>{progress.length}</strong><span>Cards studied</span></article>
        <article className="stat-card"><strong>{due}</strong><span>Ready to review</span></article>
      </section>
      {units.length === 0 && flashcards.length === 0 ? (
        <section className="empty-state">
          <h3>Add your first study content</h3>
          <p>Create items directly in the app or use a simple spreadsheet.</p>
          <Link className="button primary" to="/import">Add study content</Link>
        </section>
      ) : null}
    </div>
  );
}
