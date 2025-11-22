# Vercelへのデプロイ方法

寺嶋農園のホームページをVercelにデプロイする手順です。

## 前提条件
- GitHubにコードがプッシュされていること（完了済み）
- Vercelのアカウントを持っていること

## 手順

1. **Vercelにログイン**
   [Vercel Dashboard](https://vercel.com/dashboard) にアクセスしてログインします。

2. **新規プロジェクトの追加**
   - ダッシュボード右上の「Add New...」ボタンをクリックし、「Project」を選択します。

3. **GitHubリポジトリのインポート**
   - 「Import Git Repository」の画面で、先ほどプッシュした `terashima-hp` リポジトリを探し、「Import」ボタンをクリックします。
   - もしリストに表示されない場合は、「Adjust GitHub App Permissions」をクリックして、リポジトリへのアクセス権限を許可してください。

4. **デプロイ設定**
   - 「Configure Project」画面が表示されます。
   - 今回は静的なHTML/CSSサイトなので、設定を変更する必要はありません（Framework Presetは "Other" または自動検出されます）。
   - そのまま「Deploy」ボタンをクリックします。

5. **完了**
   - しばらく待つとデプロイが完了し、花吹雪が舞います。
   - 表示されたドメイン（例: `terashima-hp.vercel.app`）にアクセスして、サイトが正しく表示されるか確認してください。
