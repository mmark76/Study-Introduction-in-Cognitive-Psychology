import { useMemo, useState } from "react";
import { flashcards } from "../../data/flashcards";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { createId } from "../../shared/utils/id";
import { buildQuiz } from "./quiz";

export function QuizPage() {
  const questions = useMemo(() => buildQuiz(flashcards), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  async function answer(option: string) {
    if (!question || finished) return;
    const nextScore = score + (option === question.correctAnswer ? 1 : 0);
    setScore(nextScore);
    if (index >= questions.length - 1) {
      setFinished(true);
      await studyDatabase.studySessions.add({
        id: createId("session"), mode: "quiz", startedAt: new Date().toISOString(), completedAt: new Date().toISOString(),
        reviewedCards: questions.length, correctAnswers: nextScore
      });
    } else {
      setIndex(index + 1);
    }
  }

  if (questions.length === 0) return <section className="empty-state"><h2>Το quiz δεν είναι ακόμη διαθέσιμο</h2><p>Χρειάζονται τουλάχιστον τέσσερις κάρτες με διαφορετικές απαντήσεις.</p></section>;
  if (finished) return <section className="empty-state"><h2>Αποτέλεσμα: {score} / {questions.length}</h2><button className="button primary" onClick={() => window.location.reload()}>Νέο quiz</button></section>;

  return (
    <article className="quiz-card">
      <p className="eyebrow">Ερώτηση {index + 1} από {questions.length}</p>
      <h2>{question.question}</h2>
      <div className="option-grid">{question.options.map((option) => <button className="option-button" key={option} onClick={() => void answer(option)}>{option}</button>)}</div>
    </article>
  );
}
