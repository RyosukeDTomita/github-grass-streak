import { GH_TOKEN, GH_USER } from "./config.ts";
import { calculateStreak, createSvg } from "./streak.ts";
import { getContributionData } from "./githubApi.ts";
import * as O from "fp-ts/Option";

async function main() {
  if (!GH_USER) {
    console.error("GH_USER environment variables are required.");
    Deno.exit(1);
  }
  if (!GH_TOKEN) {
    console.error("GH_TOKEN environment variables are required.");
    Deno.exit(1);
  }

  // not catching Exceptions
  const weeks = await getContributionData(GH_USER, GH_TOKEN);
  // console.log(weeks);

  const streakInfo = calculateStreak(weeks);

  const svg = createSvg(streakInfo);
  await Deno.writeTextFile("github-streak.svg", svg);

  const dateRange = (() => {
    if (O.isSome(streakInfo.startDate) && O.isSome(streakInfo.endDate)) {
      return `(${streakInfo.startDate.value} - ${streakInfo.endDate.value})`;
    }
    return "";
  })();
  console.log(
    `Successfully generated github-streak.svg with a streak of ${streakInfo.streak} days ${dateRange}.`,
  );
}

await main();
