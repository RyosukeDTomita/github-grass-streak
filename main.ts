// -------------------
// CONFIG
// -------------------

// Solarized Dark Theme Colors
const COLORS = {
  base03: "#002b36", // background
  base01: "#586e75", // text
  yellow: "#b58900", // icon
  blue: "#268bd2",   // streak number
};

const GITHUB_API_URL = "https://api.github.com/graphql";
const GH_USER = Deno.env.get("GH_USER");
const GH_TOKEN = Deno.env.get("GH_TOKEN");

// -------------------
// TYPES
// -------------------

type ContributionDay = {
  contributionCount: number;
  date: string;
};

type Week = {
  contributionDays: ContributionDay[];
};

// -------------------
// API
// -------------------

async function getContributionData(userName: string, token: string) {
  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { userName },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.errors) {
    throw new Error(`GitHub API returned errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data.user.contributionsCollection.contributionCalendar.weeks as Week[];
}

// -------------------
// LOGIC
// -------------------

function calculateStreak(weeks: Week[]): number {
  const allDays = weeks.flatMap((week) => week.contributionDays);
  
  let currentStreak = 0;
  let hasContributionTodayOrYesterday = false;

  // Check today's and yesterday's contributions
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const lastContribution = allDays[allDays.length -1];
  if(lastContribution.date === todayStr || lastContribution.date === yesterdayStr) {
      hasContributionTodayOrYesterday = lastContribution.contributionCount > 0
  }


  // Calculate streak from the end of the list
  for (let i = allDays.length - 1; i >= 0; i--) {
    const day = allDays[i];
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      // If we find a day with 0 contributions, we need to check if it's today
      // If today has no contribution, yesterday's contribution counts as a finished streak.
      // The loop should stop.
      if (day.date !== todayStr) {
          break;
      }
    }
  }

  // If the latest day with contribution is not today or yesterday, streak is 0
  let lastContributionDate = "";
  for (let i = allDays.length - 1; i >= 0; i--) {
    if(allDays[i].contributionCount > 0){
        lastContributionDate = allDays[i].date;
        break;
    }
  }

  if (lastContributionDate !== todayStr && lastContributionDate !== yesterdayStr) {
    return 0;
  }


  return currentStreak;
}


// -------------------
// SVG
// -------------------

function createSvg(streak: number): string {
  const width = 160;
  const height = 100;

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

  return `
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
        ${streak}
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
    </svg>
  `;
}

// -------------------
// MAIN
// -------------------

async function main() {
  if (!GH_USER || !GH_TOKEN) {
    console.error("GH_USER and GH_TOKEN environment variables are required.");
    Deno.exit(1);
  }

  try {
    console.log(`Fetching contribution data for ${GH_USER}...`);
    const weeks = await getContributionData(GH_USER, GH_TOKEN);

    console.log("Calculating streak...");
    const streak = calculateStreak(weeks);

    console.log("Creating SVG...");
    const svg = createSvg(streak);

    await Deno.writeTextFile("github-streak.svg", svg);

    console.log(`Successfully generated github-streak.svg with a streak of ${streak} days.`);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    Deno.exit(1);
  }
}

await main();
