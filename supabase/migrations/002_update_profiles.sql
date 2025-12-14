-- =====================================================
-- profiles テーブル拡張
-- 事業者情報と記入者情報のカラムを追加
-- =====================================================

-- 事業者情報
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS office_count INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permit_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_types TEXT[];

-- 記入者情報
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- =====================================================
-- survey_drafts テーブル作成
-- 調査回答の中断・再開を可能にする
-- =====================================================

CREATE TABLE IF NOT EXISTS survey_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_year INTEGER NOT NULL DEFAULT 2024,
  form_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, survey_year)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_survey_drafts_user_id ON survey_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_drafts_survey_year ON survey_drafts(survey_year);

-- RLS有効化
ALTER TABLE survey_drafts ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
CREATE POLICY "Users can view own drafts" ON survey_drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts" ON survey_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts" ON survey_drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts" ON survey_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_survey_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_survey_drafts_updated_at ON survey_drafts;
CREATE TRIGGER trigger_update_survey_drafts_updated_at
  BEFORE UPDATE ON survey_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_drafts_updated_at();
