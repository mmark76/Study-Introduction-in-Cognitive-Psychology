import type { CardProgress, Rating } from "../../shared/types/models";
import { addDays } from "../../shared/utils/date";

const MAX_INTERVAL_DAYS = 180;

export function scheduleReview(cardId: string, rating: Rating, previous?: CardProgress, now = new Date()): CardProgress {
  const repetitions = (previous?.repetitions ?? 0) + 1;
  let intervalDays = 0;
  let nextReviewAt: Date;
  let lapses = previous?.lapses ?? 0;

  if (rating === 0) {
    lapses += 1;
    nextReviewAt = new Date(now.getTime() + 10 * 60 * 1000);
  } else if (rating === 1) {
    intervalDays = previous?.intervalDays ? Math.max(1, Math.round(previous.intervalDays * 1.8)) : 1;
    nextReviewAt = addDays(now, intervalDays);
  } else {
    intervalDays = previous?.intervalDays
      ? Math.max(3, Math.round(previous.intervalDays * 2.5))
      : repetitions === 1 ? 3 : 7;
    nextReviewAt = addDays(now, Math.min(intervalDays, MAX_INTERVAL_DAYS));
  }

  intervalDays = Math.min(intervalDays, MAX_INTERVAL_DAYS);
  return {
    cardId,
    score: rating,
    repetitions,
    intervalDays,
    nextReviewAt: nextReviewAt.toISOString(),
    lastReviewedAt: now.toISOString(),
    lapses
  };
}
