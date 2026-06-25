import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useRef, useState } from "react";
import { flashcards } from "../../data/flashcards";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import type { Rating } from "../../shared/types/models";
import { isDue } from "../../shared/utils/date";
import { scheduleReview } from "./spacedRepetition";

export function ReviewPage() {
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), []) ?? [];
  const dueCards = useMemo(() => {
    const dueIds = new Set(progress.filter((item) => isDue(item.nextReviewAt)).map((item) => item.cardId));
    return flashcards.filter((card) => dueIds.has(card.id));
  }, [progress]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const lock = useRef(false);
  const card = dueCards[index];

  async function rate(rating: Rating) {
    if (!card || lock.current) return;
    lock.current = true;
    try {
      const previous = await studyDatabase.cardProgress.get(card.id);
      await studyDatabase.cardProgress.put(scheduleReview(card.id, rating, previous));
      setRevealed(false);
      setIndex((current) => current >= dueCards.length - 1 ? 0 : current + 1);
    } finally {
      lock.current = false;
    }
  }

  if (!card) return <section className="empty-state"><h2>Δεν υπάρχουν κάρτες για επανάληψη</h2><p>Οι κάρτες εμφανίζονται εδώ όταν λήξει το διάστημα επανάληψής τους.</p></section>;

  return (
    <div className="study-panel">
      <div className="session-progress"><span>{index + 1} / {dueCards.length}</span><progress max={dueCards.length} value={index + 1} /></div>
      <article className="flashcard"><p className="eyebrow">Επανάληψη</p><h2>{revealed ? card.answer : card.question}</h2></article>
      {!revealed ? <button className="button primary" onClick={() => setRevealed(true)}>Εμφάνιση απάντησης</button> : (
        <div className="rating-grid">
          <button className="button danger" onClick={() => void rate(0)}>0 · Ξανά</button>
          <button className="button secondary" onClick={() => void rate(1)}>1 · Δύσκολο</button>
          <button className="button primary" onClick={() => void rate(2)}>2 · Γνωστό</button>
        </div>
      )}
    </div>
  );
}
