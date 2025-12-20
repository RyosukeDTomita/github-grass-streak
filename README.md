# GitHub Grass Streak

![GitHub Streak](github-streak.svg)

## ローカルでの実行方法

Deno環境でスクリプトを直接実行することも可能です。

1.  [Deno](https://deno.land/#installation)をインストールします。
2.  GitHubのPersonal Access Tokenを[こちら](https://github.com/settings/tokens)から作成します。`repo`と`read:user`のスコープを付与してください。
3.  環境変数を設定します:
    ```sh
    export GH_USER="<YOUR_GITHUB_USERNAME>"
    export GH_TOKEN="<YOUR_GITHUB_TOKEN>"
    ```
4.  以下のコマンドでスクリプトを実行します:
    ```sh
    deno run --allow-env --allow-net=api.github.com --allow-write main.ts
    ```
5.  `github-streak.svg`が生成されます。

---

## 使い方

1.  このリポジトリをフォークします。
2.  リポジトリの `Settings` > `Secrets and variables` > `Actions` に移動します。
3.  `New repository secret` をクリックし、以下の名前でPersonal Access Token（`repo` と `read:user` スコープを持つ）を登録します:
    *   `GH_TOKEN`
4.  `.github/workflows/main.yml` に記載されている自分のGitHubユーザー名を確認・変更します。
5.  Actionsを有効にし、`Create GitHub Streak SVG` ワークフローを手動で実行するか、次回のスケジュール実行（毎日 JST 9:00）を待ちます。

