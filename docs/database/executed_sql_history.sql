-- =============================================
-- 実行済みSQLコード履歴
-- Supabase SQL Editorで実行されたコードの記録
-- =============================================

-- =============================================
-- 実行日: 2024-12-21
-- 目的: ファイルアップロード機能の追加
-- 実行者: Claude Code (AI生成)
-- =============================================

-- 1. ストレージバケットを作成
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'survey-documents',
  'survey-documents',
  false,  -- プライベートバケット
  524288000,  -- 500MB (500 * 1024 * 1024)
  ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

-- 2. ストレージのRLSポリシー（アップロード）
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'survey-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. ストレージのRLSポリシー（閲覧）
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'survey-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. ストレージのRLSポリシー（削除）
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'survey-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. uploaded_filesテーブルを作成（メタデータ管理）
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. uploaded_filesのRLSを有効化
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- 7. uploaded_filesのRLSポリシー（閲覧）
CREATE POLICY "Users can view their own uploaded files"
ON uploaded_files
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 8. uploaded_filesのRLSポリシー（挿入）
CREATE POLICY "Users can insert their own uploaded files"
ON uploaded_files
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 9. uploaded_filesのRLSポリシー（削除）
CREATE POLICY "Users can delete their own uploaded files"
ON uploaded_files
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 10. インデックス作成
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_at ON uploaded_files(uploaded_at DESC);


-- =============================================
-- 以下に新しいSQLコードを追記してください
-- フォーマット:
--
-- -- =============================================
-- -- 実行日: YYYY-MM-DD
-- -- 目的: [実行目的]
-- -- 実行者: [実行者名]
-- -- =============================================
-- [SQLコード]
-- =============================================
