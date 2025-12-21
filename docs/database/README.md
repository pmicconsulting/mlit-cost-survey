# データベース管理ドキュメント

このフォルダには、Supabaseデータベースに関するSQLコードと管理情報が含まれています。

## ファイル一覧

| ファイル名 | 説明 |
|-----------|------|
| `executed_sql_history.sql` | 実行済みSQLコードの履歴（時系列順） |
| `check_database_status.sql` | データベース状態確認用SQLクエリ |

## Supabaseダッシュボードへのアクセス

1. https://supabase.com/dashboard にアクセス
2. プロジェクトを選択
3. 左メニューから以下を確認:
   - **Table Editor**: テーブル一覧とデータ
   - **SQL Editor**: SQLクエリの実行
   - **Storage**: ファイルストレージ
   - **Authentication**: ユーザー管理

## 新しいSQLを実行する際の注意

1. 実行前に `executed_sql_history.sql` に追記
2. 日付とコメントを含める
3. 実行結果も記録
