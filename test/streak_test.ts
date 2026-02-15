import { assertEquals } from "assertEquals";
import { calculateStreak, createSvg } from "../src/streak.ts";
import { Week } from "../src/type.ts";
import * as O from "fp-ts/Option";

function getJSTDateString(date: Date): string {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(
    0,
    10,
  );
}

function daysFromYearStart(todayStr: string): number {
  const [year, month, day] = todayStr.split("-").map(Number);
  const yearStart = Date.UTC(year, 0, 1);
  const today = Date.UTC(year, month - 1, day);
  return Math.floor((today - yearStart) / (24 * 60 * 60 * 1000)) + 1;
}

Deno.test("calculateStreak - return 0 when no contributions", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 0 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks);
  assertEquals(result.streak, 0);
  assertEquals(result.startDate, O.none);
  assertEquals(result.endDate, O.none);
  assertEquals(result.ytdGrassDays, 0);
  assertEquals(result.ytdTotalDays > 0, true);
});

Deno.test("calculateStreak - return 1 when today has contribution but yesterday does not continue streak", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 0 },
      { date: today, contributionCount: 1 },
    ],
  }];

  const result = calculateStreak(weeks);
  assertEquals(result.streak, 1);
  assertEquals(result.startDate, O.some(today));
  assertEquals(result.endDate, O.some(today));
  assertEquals(result.ytdGrassDays > 0, true);
  assertEquals(result.ytdTotalDays > 0, true);
});

Deno.test("calculateStreak - streak continues when today has contribution", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 1 },
      { date: today, contributionCount: 1 },
    ],
  }];

  const result = calculateStreak(weeks);
  assertEquals(result.streak, 3);
  assertEquals(result.startDate, O.some(twoDaysAgo));
  assertEquals(result.endDate, O.some(today));
  assertEquals(result.ytdGrassDays > 0, true);
  assertEquals(result.ytdTotalDays > 0, true);
});

Deno.test("calculateStreak - streak continues when today has no contribution", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const weeks: Week[] = [{
    contributionDays: [
      { date: twoDaysAgo, contributionCount: 1 },
      { date: yesterday, contributionCount: 1 },
      { date: today, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks);
  assertEquals(result.streak, 2);
  assertEquals(result.startDate, O.some(twoDaysAgo));
  assertEquals(result.endDate, O.some(yesterday));
  assertEquals(result.ytdGrassDays > 0, true);
  assertEquals(result.ytdTotalDays > 0, true);
});

Deno.test("calculateStreak - ytd count includes only current year days", () => {
  const todayStr = getJSTDateString(new Date());
  const yesterdayStr = getJSTDateString(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  );
  const currentYear = todayStr.slice(0, 4);
  const previousYear = String(Number(currentYear) - 1);
  const yearStart = `${currentYear}-01-01`;
  const lastYearEnd = `${previousYear}-12-31`;

  const weeks: Week[] = [{
    contributionDays: [
      { date: lastYearEnd, contributionCount: 1 },
      { date: yearStart, contributionCount: 1 },
      { date: yesterdayStr, contributionCount: 1 },
      { date: todayStr, contributionCount: 0 },
    ],
  }];

  const result = calculateStreak(weeks);
  assertEquals(result.ytdGrassDays, 2);
  assertEquals(result.ytdTotalDays, daysFromYearStart(todayStr));
});

Deno.test("createSvg - render ytd label and percentage", () => {
  const svg = createSvg({
    streak: 5,
    startDate: O.some("2026-01-01"),
    endDate: O.some("2026-01-05"),
    ytdGrassDays: 10,
    ytdTotalDays: 20,
  });

  assertEquals(svg.includes("YTD 10/20"), true);
  assertEquals(svg.includes("50.0%"), true);
});
