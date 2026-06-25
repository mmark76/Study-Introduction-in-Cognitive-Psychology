import { useLiveQuery } from "dexie-react-hooks";
import { flashcards } from "../../data/flashcards";
import { units } from "../../data/units";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { isDue } from "../../shared/utils/date";
import { studyConfig } from "../../app/studyConfig";

export function HomePage() {
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), []) ?? [];
  const due = progress.filter((item) => isDue(item.nextReviewAt)).length;

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <p className="eyebrow">Reusable study workspace</p>
        <h2>{studyConfig.subjectName || "Κενό πρότυπο μελέτης"}</h2>
        <p>{studyConfig.description}</p>
      </section>
      <section className="stats-grid" aria-label="Στατιστικά">
        <article className="stat-card"><strong>{units.length}</strong><span>{studyConfig.unitsLabel}</span></article>
        <article className="stat-card"><strong>{flashcards.length}</strong><span>Flashcards</span></article>
        <article className="stat-card"><strong>{progress.length}</strong><span>Μελετημένες</span></article>
        <article className="stat-card"><strong>{due}</strong><span>Για επανάληψη</span></article>
      </section>
      {units.length === 0 && flashcards.length === 0 ? (
        <section className="empty-state">
          <h3>Το περιεχόμενο είναι κενό</h3>
          <p>Πρόσθεσε ενότητες και κάρτες στα αρχεία <code>src/data/units.ts</code> και <code>src/data/flashcards.ts</code>.</p>
        </section>
      ) : null}
    </div>
  );
}
