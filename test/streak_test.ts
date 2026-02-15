import { assertEquals } from "assertEquals";
import { calculateStreak, createSvg } from "../src/streak.ts";
import { Week, StreakInfo } from "../src/type.ts";
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

Deno.test("calculateStreak - start date and end date is none when no contributions", () => {
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
  assertEquals(O.isNone(result.startDate), true);
  assertEquals(O.isNone(result.endDate), true);
});

Deno.test("calculateStreak - start date and end date is correct when streak is not zero", () => {
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
  assertEquals(result.startDate, O.some(today));
  assertEquals(result.endDate, O.some(today));
});

// -----streak percentage-----
Deno.test("calculateStreak - ytd count includes only current year days", () => {
  const now = new Date("2026-01-03T12:00:00Z");
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
  const expectedPercentage = (2 / 3) * 100;
  assertEquals(
    (result.ytdGrassDays / result.ytdTotalDays) * 100,
    expectedPercentage,
  );
});

// -----SVG Generation-----
Deno.test("createSvg - includes streak count", () => {
  const streakInfo: StreakInfo = {
    streak: 5,
    startDate: O.some("2026-01-10"),
    endDate: O.some("2026-01-14"),
    ytdGrassDays: 10,
    ytdTotalDays: 14,
  };

  const svg = createSvg(streakInfo);
  assertEquals(svg.includes("5"), true);
  assertEquals(svg.includes("Days Streak"), true);
  assertEquals(svg.includes("YTD 10/14"), true);
  assertEquals(svg.includes("71.4%"), true);
});
