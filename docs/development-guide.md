# 開発ガイド - 適正原価実態調査システム

**最終更新**: 2024年12月14日
**プロジェクト**: 一般貨物自動車運送事業 適正原価に関する実態調査

---

## 1. 開発環境のセットアップ

### 1.1 前提条件

- Node.js 18以上
- Git Bash（Windows）
- npm

### 1.2 初回セットアップ

```bash
# プロジェクトディレクトリに移動
cd "F:/190111USB/更新制/system_development/mlit_cost_survey"

# 依存関係のインストール
npm install
```

### 1.3 環境変数の確認

`.env.local`ファイルが存在し、以下の設定があることを確認：

```bash
# 確認コマンド
cat .env.local
```

必要な環境変数：
| 変数名 | 説明 | 状態 |
|--------|------|------|
| `NEXT_PUBLIC_SITE_URL` | サイトURL | 設定済み |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | 設定済み |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | 設定済み |
| `ANTHROPIC_API_KEY` | Claude APIキー | 設定済み |
| `AWS_ACCESS_KEY_ID` | AWS SESキー | **未設定**（プレースホルダー） |
| `AWS_SECRET_ACCESS_KEY` | AWS SESシークレット | **未設定**（プレースホルダー） |

---

## 2. 開発サーバーの起動

### 2.1 起動前の確認事項

**重要**: シェル環境変数を確認

```bash
# ANTHROPIC_API_KEYが空または正しい値であることを確認
echo $ANTHROPIC_API_KEY

# 「your-api-key-here」と表示された場合は問題あり
# 空であればOK（.env.localの値が使用される）
```

もし「your-api-key-here」と表示された場合：
→ `docs/troubleshooting-anthropic-api-key.md` を参照

### 2.2 開発サーバーの起動

```bash
cd "F:/190111USB/更新制/system_development/mlit_cost_survey"
npm run dev
```

起動後、以下のURLでアクセス：
- **ローカル**: http://localhost:3000
- **ネットワーク**: http://192.168.1.2:3000（同一LAN内）

---

## 3. プロジェクト構成

### 3.1 ディレクトリ構造

```
mlit_cost_survey/
├── src/
│   ├── app/                    # ページ・APIルート
│   │   ├── page.tsx            # トップページ
│   │   ├── register/           # 回答者登録
│   │   ├── auth/login/         # ログイン
│   │   ├── dashboard/          # ダッシュボード
│   │   ├── ai-consultant/      # AI相談員
│   │   ├── qa/                 # Q&A
│   │   ├── contact/            # お問い合わせ
│   │   ├── download/           # ダウンロード
│   │   └── api/                # APIエンドポイント
│   │       ├── ai-consultant/  # AI相談員API
│   │       ├── contact/        # お問い合わせAPI
│   │       └── send-email/     # メール送信API
│   ├── components/             # コンポーネント
│   ├── data/                   # データファイル
│   │   └── qa-sample.json      # Q&Aサンプルデータ
│   ├── lib/                    # ユーティリティ
│   └── types/                  # 型定義
├── docs/                       # ドキュメント
├── public/                     # 静的ファイル
├── supabase/                   # Supabase設定
└── .env.local                  # 環境変数（Git管理外）
```

### 3.2 ページ一覧

| パス | ページ | 機能 |
|------|--------|------|
| `/` | トップページ | 調査概要・登録へのナビゲーション |
| `/register` | 回答者登録 | 新規アカウント作成 |
| `/auth/login` | ログイン | 既存ユーザーログイン |
| `/dashboard` | ダッシュボード | 調査回答メイン画面 |
| `/ai-consultant` | AI相談員 | Claude APIによるQ&A対応 |
| `/qa` | Q&A | よくある質問 |
| `/contact` | お問い合わせ | 問い合わせフォーム |
| `/download` | ダウンロード | 資料ダウンロード |

---

## 4. 機能別テスト手順

### 4.1 AI相談員機能

```bash
# APIテスト
curl -s -X POST http://localhost:3000/api/ai-consultant \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"調査の目的は？"}]}'
```

期待されるレスポンス：
```json
{
  "message": "本調査の目的は...",
  "debug": { "relevantQACount": 0, "categories": [] }
}
```

エラーの場合：
→ `docs/troubleshooting-anthropic-api-key.md` を参照

### 4.2 認証機能

1. http://localhost:3000/register でアカウント作成
2. メール確認（Supabaseの設定による）
3. http://localhost:3000/auth/login でログイン
4. http://localhost:3000/dashboard にリダイレクトされることを確認

### 4.3 お問い合わせ機能

**注意**: AWS SES設定が未完了のため、メール送信は動作しない。
設定後にテスト可能。

---

## 5. 残タスク一覧

### 5.1 優先度：高

| タスク | 説明 | ファイル |
|--------|------|----------|
| Q&Aデータ充実 | Word文書からQ&Aを追加 | `src/data/qa-sample.json` |

### 5.2 優先度：中

| タスク | 説明 | ファイル |
|--------|------|----------|
| AWS SES設定 | メール送信機能を有効化 | `.env.local` |
| 各ページ動作確認 | 全ページのUIテスト | - |

### 5.3 優先度：低（本番デプロイ時）

| タスク | 説明 | ファイル |
|--------|------|----------|
| Vercelデプロイ | 本番環境へデプロイ | - |
| 本番URL設定 | `NEXT_PUBLIC_SITE_URL`を変更 | `.env.local` |
| Supabase本番設定 | 本番用キーに変更（必要なら） | `.env.local` |

---

## 6. Q&Aデータの追加方法

### 6.1 ファイル場所

`src/data/qa-sample.json`

### 6.2 データ形式

```json
{
  "qa_items": [
    {
      "id": "q001",
      "category": "カテゴリ名",
      "question": "質問文",
      "answer": "回答文",
      "keywords": ["キーワード1", "キーワード2"]
    }
  ]
}
```

### 6.3 追加手順

1. Word文書からQ&Aを抽出
2. 上記形式に変換
3. `qa-sample.json`に追加
4. 開発サーバーを再起動（自動リロードされる場合は不要）
5. AI相談員でテスト

---

## 7. Gitワークフロー

### 7.1 変更のコミット

```bash
# 状態確認
git status

# ステージング
git add .

# コミット
git commit -m "feat: 変更内容の説明"

# プッシュ（必要な場合）
git push origin master
```

### 7.2 コミットメッセージ規約

| プレフィックス | 用途 |
|----------------|------|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント |
| `refactor:` | リファクタリング |
| `style:` | フォーマット変更 |

---

## 8. トラブルシューティング

### 8.1 よくある問題

| 問題 | 解決策 |
|------|--------|
| AI相談員がエラー | `docs/troubleshooting-anthropic-api-key.md`参照 |
| ポート3000が使用中 | `taskkill //F //IM node.exe` で既存プロセスを終了 |
| 環境変数が反映されない | ターミナルを再起動 |
| ビルドエラー | `rm -rf .next && npm run dev` |

### 8.2 デバッグログの確認

開発サーバーのログを確認：
```bash
# サーバー起動時のログを監視
npm run dev
# Ctrl+C で終了
```

---

## 9. 本番デプロイ手順（将来用）

### 9.1 事前準備

1. AWS SES設定を完了
2. `.env.local`の本番設定を確認
3. `npm run build`でビルドテスト

### 9.2 Vercelへデプロイ

```bash
# Vercel CLIでデプロイ
npx vercel --prod

# 環境変数をVercelダッシュボードで設定
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ANTHROPIC_API_KEY
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
```

---

## 10. 連絡先・参考リンク

| リソース | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard |
| Anthropic Console | https://console.anthropic.com |
| AWS Console (SES) | https://console.aws.amazon.com/ses |
| Vercel Dashboard | https://vercel.com/dashboard |

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2024-12-14 | 初版作成 |
