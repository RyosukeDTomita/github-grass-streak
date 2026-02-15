import { assertEquals } from "assertEquals";
import { calculateStreak, createSvg } from "../src/streak.ts";
import { Week } from "../src/type.ts";
import * as O from "fp-ts/Option";

// ------streak count-----
Deno.test("calculateStreak - return 0 when no contributions", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 0 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 0);
});

Deno.test("calculateStreak - return 1 when today has contribution but yesterday does not continue streak", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 1 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 1);
});

Deno.test("calculateStreak - streak continues when today has contribution", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 1 },
      { date: today, contributionCount: 1 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 3);
});

Deno.test("calculateStreak - streak continues when today has no contribution", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 1 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 2);
});

// -----streak start date end date

// TODO: 
Deno.test("calculateStreak - start date and end date is null? when no contributions", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 0 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 0);
});

Deno.test("calculateStreak - start date and end date is correct when streak is not zero", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const today = "2026-01-10";
  const yesterday = "2026-01-09";
  const twoDaysAgo = "2026-01-08";

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 0 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.streak, 0);
});

// -----streak percentage-----
Deno.test("calculateStreak - ytd count includes only current year days", () => {
  const now = new Date("2026-01-10T12:00:00Z");
  const todayStr = "2026-01-03";
  const yesterdayStr = "2026-01-02";
  const yearStart = "2026-01-01";
  const lastYearEnd = "2025-12-31";

  const weeks: Week[] = [{
    contributionDays: [
      { date: lastYearEnd, contributionCount: 1 },
      { date: yearStart, contributionCount: 1 },
      { date: yesterdayStr, contributionCount: 1 },
      { date: todayStr, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks, now);
  assertEquals(result.ytdGrassDays, 2); // this years contribution count
  assertEquals(result.ytdTotalDays, 3);
  // TODO: percentageの検証
});


