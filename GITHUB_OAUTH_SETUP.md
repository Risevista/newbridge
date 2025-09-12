# GitHub OAuth App 設定手順

## 1. GitHub OAuth Appを作成

1. **GitHubにログイン**
   - https://github.com にアクセス

2. **Developer settingsに移動**
   - 右上のプロフィール画像 → Settings
   - 左サイドバーの「Developer settings」
   - 「OAuth Apps」をクリック

3. **新しいOAuth Appを作成**
   - 「New OAuth App」ボタンをクリック
   - 以下の情報を入力：
     - **Application name**: `RISE VISTA CMS`
     - **Homepage URL**: `https://risevista.pages.dev`
     - **Application description**: `RISE VISTAブログ管理システム`
     - **Authorization callback URL**: `https://risevista.pages.dev/api/auth/callback`

4. **Client IDとClient Secretを取得**
   - 作成後、Client IDとClient Secretが表示されます
   - これらをメモしておいてください

## 2. Cloudflare Pages環境変数の設定

1. **Cloudflareダッシュボードにアクセス**
   - https://dash.cloudflare.com/ にログイン

2. **Pagesプロジェクトを選択**
   - 「Pages」→「risevista」プロジェクトを選択

3. **環境変数を設定**
   - 「Settings」→「Environment variables」
   - 以下の変数を追加：
     - `GITHUB_CLIENT_ID`: 上記で取得したClient ID
     - `GITHUB_CLIENT_SECRET`: 上記で取得したClient Secret

4. **再デプロイ**
   - 環境変数設定後、プロジェクトを再デプロイ

## 3. 動作確認

1. **CMSにアクセス**
   - https://risevista.pages.dev/admin/ にアクセス

2. **GitHubでログイン**
   - 「GitHubでログイン」ボタンをクリック
   - GitHubの認証画面で許可

3. **ブログ記事の作成・編集**
   - ログイン後、ブログ記事の管理が可能

## トラブルシューティング

### よくある問題

1. **「Authorization callback URL mismatch」エラー**
   - GitHub OAuth Appの設定で、callback URLが正確に設定されているか確認
   - `https://risevista.pages.dev/api/auth/callback` であることを確認

2. **「Client ID not found」エラー**
   - Cloudflare Pagesの環境変数が正しく設定されているか確認
   - 再デプロイが完了しているか確認

3. **CORS エラー**
   - ブラウザの開発者ツールでコンソールエラーを確認
   - 認証エンドポイントが正しく動作しているか確認

### デバッグ方法

1. **認証エンドポイントのテスト**
   ```bash
   curl https://risevista.pages.dev/api/auth
   ```
   - GitHubの認証URLにリダイレクトされることを確認

2. **環境変数の確認**
   - Cloudflare PagesのFunctionsログで環境変数が正しく読み込まれているか確認
