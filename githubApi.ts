import { GITHUB_API_URL } from "./config.ts";
import { Week } from "./type.ts";

/**
 * @param userName GitHub username
 * @param token github token
 * @returns contribution weeks data (only 1 year)
 */
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
    throw new Error(
      `GitHub API returned errors: ${JSON.stringify(data.errors)}`,
    );
  }

  return data.data.user.contributionsCollection.contributionCalendar
    .weeks as Week[];
}

export { getContributionData };
