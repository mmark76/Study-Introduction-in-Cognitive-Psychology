import { describe, expect, it } from "vitest";
import { scheduleReview } from "../src/features/review/spacedRepetition";

describe("scheduleReview", () => {
  const now = new Date("2026-01-01T10:00:00.000Z");

  it("schedules rating zero after ten minutes", () => {
    const result = scheduleReview("card-1", 0, undefined, now);
    expect(result.lapses).toBe(1);
    expect(result.nextReviewAt).toBe("2026-01-01T10:10:00.000Z");
  });

  it("starts a known card at three days", () => {
    const result = scheduleReview("card-1", 2, undefined, now);
    expect(result.intervalDays).toBe(3);
    expect(result.nextReviewAt).toBe("2026-01-04T10:00:00.000Z");
  });
});
