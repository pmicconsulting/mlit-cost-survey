-- =============================================
-- データベース状態確認用SQLクエリ
-- Supabase SQL Editorで実行して状態を確認
-- =============================================

-- =============================================
-- 1. テーブル一覧の確認
-- =============================================
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


-- =============================================
-- 2. 各テーブルの行数確認
-- =============================================
SELECT
  schemaname,
  relname as table_name,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;


-- =============================================
-- 3. テーブル構造の確認（uploaded_files）
-- =============================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'uploaded_files'
ORDER BY ordinal_position;


-- =============================================
-- 4. テーブル構造の確認（profiles）
-- =============================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;


-- =============================================
-- 5. テーブル構造の確認（survey_drafts）
-- =============================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'survey_drafts'
ORDER BY ordinal_position;


-- =============================================
-- 6. RLSポリシーの確認
-- =============================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- =============================================
-- 7. ストレージバケットの確認
-- =============================================
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
ORDER BY created_at;


-- =============================================
-- 8. ストレージのRLSポリシー確認
-- =============================================
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;


-- =============================================
-- 9. インデックスの確認
-- =============================================
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;


-- =============================================
-- 10. アップロード済みファイル数（ユーザー別）
-- =============================================
SELECT
  user_id,
  COUNT(*) as file_count,
  SUM(file_size) as total_size_bytes,
  ROUND(SUM(file_size) / 1024.0 / 1024.0, 2) as total_size_mb
FROM uploaded_files
GROUP BY user_id
ORDER BY file_count DESC;


-- =============================================
-- 11. 最近アップロードされたファイル（10件）
-- =============================================
SELECT
  id,
  user_id,
  file_name,
  file_size,
  mime_type,
  uploaded_at
FROM uploaded_files
ORDER BY uploaded_at DESC
LIMIT 10;


-- =============================================
-- 12. ユーザー数の確認
-- =============================================
SELECT
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_users
FROM auth.users;


-- =============================================
-- 13. プロファイル登録状況
-- =============================================
SELECT
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE business_name IS NOT NULL) as with_business_name,
  COUNT(*) FILTER (WHERE contact_name IS NOT NULL) as with_contact_name
FROM profiles;


-- =============================================
-- 14. 調査回答状況
-- =============================================
SELECT
  survey_year,
  COUNT(*) as total_drafts,
  COUNT(*) FILTER (WHERE is_submitted = true) as submitted,
  COUNT(*) FILTER (WHERE is_submitted = false) as in_progress
FROM survey_drafts
GROUP BY survey_year
ORDER BY survey_year DESC;
