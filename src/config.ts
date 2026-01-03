// Solarized Dark Theme Colors
const COLORS = {
  base03: "#002b36", // background
  base01: "#586e75", // text
  yellow: "#b58900", // icon
  blue: "#268bd2", // streak number
};

const GITHUB_API_URL = "https://api.github.com/graphql";
const GH_USER = Deno.env.get("GH_USER");
const GH_TOKEN = Deno.env.get("GH_TOKEN");

export { COLORS, GH_TOKEN, GH_USER, GITHUB_API_URL };
