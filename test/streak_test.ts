import { assertEquals } from "assertEquals";
import { calculateStreak } from "../src/streak.ts";
import { Week } from "../src/type.ts";
import * as O from "fp-ts/Option";

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
});
