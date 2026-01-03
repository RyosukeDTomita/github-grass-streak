import { COLORS } from "./config.ts";
import { Week } from "./type.ts";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";

interface StreakInfo {
  streak: number;
  startDate: string | null;
  endDate: string | null;
}

function calculateStreak(weeks: Week[]): StreakInfo {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  return pipe(
    weeks,
    A.flatMap((week) => week.contributionDays),
    NEA.fromArray,
    O.chain((allDays) =>
      pipe(
        // 最後のコントリビューション日を探す
        A.findLast<(typeof allDays)[number]>((day) =>
          day.contributionCount > 0
        )(
          allDays,
        ),
        O.filter((lastContribution) => lastContribution.date === todayStr ||
          lastContribution.date === yesterdayStr
        ),
        O.map(() =>
          pipe(
            // 配列を逆順にしてストリークをカウント
            allDays,
            A.reverse,
            A.reduce(
              { streak: 0, shouldContinue: true, dates: [] as string[] },
              (acc, day) => {
                if (!acc.shouldContinue) return acc;

                if (day.contributionCount > 0) {
                  return {
                    ...acc,
                    streak: acc.streak + 1,
                    dates: [...acc.dates, day.date],
                  };
                } else if (day.date === todayStr) {
                  // 今日がコントリビューション0でも続行
                  return acc;
                } else {
                  // それ以外の0の日でストップ
                  return { ...acc, shouldContinue: false };
                }
              },
            ),
            (result): StreakInfo => ({
              streak: result.streak,
              startDate: result.dates[result.dates.length - 1] || null,
              endDate: result.dates[0] || null,
            }),
          )
        ),
      )
    ),
    O.getOrElse((): StreakInfo => ({
      streak: 0,
      startDate: null,
      endDate: null,
    })),
  );
}

/**
 * @param streakInfo
 * @returns
 */
function createSvg(streakInfo: StreakInfo): string {
  const width = 160;
  const height = 120;

  const icon = `
    <g transform="translate(15, 20)">
      <path
        fill="${COLORS.yellow}"
        d="M9.9,1.1l-1.8,2.8C7.4,5,7,6,7,7.1c0,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8c0-1.1-0.4-2.1-1.1-2.8l-1.8-2.8
        C11.3,0.5,10.7,0.5,9.9,1.1z M10.8,12.8c-3.1,0-5.6,2.5-5.6,5.6c0,0.6,0.4,1,1,1h9.2c0.6,0,1-0.4,1-1
        C16.4,15.3,13.9,12.8,10.8,12.8z"
      />
    </g>
  `;

  const svg = `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="${width}"
        height="${height}"
        fill="${COLORS.base03}"
        rx="8"
      />
      ${icon}
      <text
        x="140"
        y="55"
        text-anchor="end"
        font-family="'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-size="40"
        font-weight="bold"
        fill="${COLORS.blue}"
      >
        ${streakInfo.streak}
      </text>
      <text
        x="140"
        y="80"
        text-anchor="end"
        font-family="'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-size="16"
        font-weight="normal"
        fill="${COLORS.base01}"
      >
        Days Streak
      </text>
      ${
    streakInfo.startDate && streakInfo.endDate
      ? `
      <text
        x="80"
        y="110"
        text-anchor="middle"
        font-family="'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-size="12"
        font-weight="normal"
        fill="${COLORS.base01}"
      >
        ${streakInfo.startDate} - ${streakInfo.endDate}
      </text>`
      : ""
  }
    </svg>
  `;
  return svg;
}

export { calculateStreak, createSvg };
