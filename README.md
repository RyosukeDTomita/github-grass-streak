# GitHub Grass Streak

![mit license](https://img.shields.io/github/license/RyosukeDTomita/github-grass-streak)
[![codecov](https://codecov.io/gh/RyosukeDTomita/github-grass-streak/graph/badge.svg?token=KZeTiIlWBZ)](https://codecov.io/gh/RyosukeDTomita/github-grass-streak)
[![Deno Test](https://github.com/RyosukeDTomita/github-grass-streak/actions/workflows/deno_test.yml/badge.svg)](https://github.com/RyosukeDTomita/github-grass-streak/actions/workflows/deno_test.yml)
[![Create GitHub Streak SVG and Deploy to Pages](https://github.com/RyosukeDTomita/github-grass-streak/actions/workflows/main.yml/badge.svg)](https://github.com/RyosukeDTomita/github-grass-streak/actions/workflows/main.yml)

## INDEX

- [ABOUT](#about)
- [ENVIRONMENT](#environment)
- [HOW TO USE](#how-to-use)
- [For Developers](#for-developers)

---

## ABOUT

Create a GitHub contribution streak badge SVG using [GitHub EST API](https://docs.github.com/ja/rest?apiVersion=2022-11-28) and [Deno](https://deno.com/), and deploy it to [GitHub Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site).

This is my example👇

[![GitHub Grass Streak](https://ryosukedtomita.github.io/github-grass-streak/github-streak.svg)](https://github.com/RyosukeDTomita/github-grass-streak)

### Why this approach?

- Stability: Existing streak tools often rely on on-demand SVG generation via external URLs, which can occasionally fail to render.

- Cost Free: This repository generates the SVG once per day using GitHub Actions and serves it via GitHub Pages, ensuring stable availability without any cost.

---

## ENVIRONMENT

```shell
deno -v
deno 2.6.3
```

---

## HOW TO USE

1. Fork this repository.
2. Go to `Settings` > `Secrets and variables` > `Actions` in your repository.
3. Click `New repository secret` and add a Personal Access Token (with `repo`
   and `read:user` scopes) with the following name:
   - `GH_TOKEN`
4. Check and update your GitHub username in `.github/workflows/main.yml`.
5. Enable Actions and either run the `Create GitHub Streak SVG` workflow
   manually, or wait for the next scheduled run (every day at 9:00 JST).
6. Use streak badge.

```md
[![GitHub Grass Streak](https://ryosukedtomita.github.io/github-grass-streak/github-streak.svg)](https://github.com/RyosukeDTomita/github-grass-streak)
```

---

## For Developers

1. install deno using nix:

   ```shell
   nix develop
   ```

2. create a GitHub Personal Access Token with `repo` and `read:user` scopes.
3. add the following environment variables:

   ```shell
   export GH_USER="<YOUR_GITHUB_USERNAME>"
   export GH_TOKEN="<YOUR_GITHUB_TOKEN>"
   ```

4. run the script to check if it works:

   ```shell
   deno task test # unit test
   deno task start
   ls github-streak.svg
   ```
