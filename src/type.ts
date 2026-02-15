import * as O from "fp-ts/Option";

type ContributionDay = {
  contributionCount: number;
  date: string;
};

type Week = {
  contributionDays: ContributionDay[];
};

type StreakInfo = {
  streak: number;
  startDate: O.Option<string>;
  endDate: O.Option<string>;
  ytdGrassDays: number;
  ytdTotalDays: number;
};

export type { ContributionDay, StreakInfo, Week };
