-- =====================================================
-- 国土交通省 適正原価実態調査システム
-- データベース初期化SQL
--
-- Supabase SQL Editorで全て選択して「Run」
-- =====================================================

-- =====================================================
-- 1. profilesテーブル作成
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  provider TEXT DEFAULT 'email',
  business_name TEXT,
  postal_code TEXT,
  address TEXT,
  business_number CHAR(12),
  office_count INTEGER,
  permit_year INTEGER,
  business_types TEXT[],
  contact_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 1-1. profilesテーブル 日本語コメント
-- =====================================================
COMMENT ON TABLE public.profiles IS 'ユーザープロファイル・事業者情報';
COMMENT ON COLUMN public.profiles.id IS 'ユーザーID（認証システム連携）';
COMMENT ON COLUMN public.profiles.email IS 'メールアドレス';
COMMENT ON COLUMN public.profiles.provider IS '認証方式（email固定）';
COMMENT ON COLUMN public.profiles.business_name IS '事業者名';
COMMENT ON COLUMN public.profiles.postal_code IS '郵便番号';
COMMENT ON COLUMN public.profiles.address IS '住所';
COMMENT ON COLUMN public.profiles.business_number IS '事業者番号（12桁）';
COMMENT ON COLUMN public.profiles.office_count IS '一般貨物運送事業：営業所数';
COMMENT ON COLUMN public.profiles.permit_year IS '事業許可年';
COMMENT ON COLUMN public.profiles.business_types IS '事業種別（一般貨物/特定貨物/特積貨物/第一種利用運送/第二種利用運送）';
COMMENT ON COLUMN public.profiles.contact_name IS '記入者名';
COMMENT ON COLUMN public.profiles.phone IS '連絡先電話番号';
COMMENT ON COLUMN public.profiles.created_at IS '作成日時';
COMMENT ON COLUMN public.profiles.updated_at IS '更新日時';

-- =====================================================
-- 2. survey_draftsテーブル作成
-- =====================================================
CREATE TABLE IF NOT EXISTS public.survey_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_year INTEGER NOT NULL DEFAULT 2024,
  form_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, survey_year)
);

-- =====================================================
-- 2-1. survey_draftsテーブル 日本語コメント
-- =====================================================
COMMENT ON TABLE public.survey_drafts IS '調査回答の下書き・提出データ';
COMMENT ON COLUMN public.survey_drafts.id IS 'レコードID';
COMMENT ON COLUMN public.survey_drafts.user_id IS 'ユーザーID';
COMMENT ON COLUMN public.survey_drafts.survey_year IS '調査年度';
COMMENT ON COLUMN public.survey_drafts.form_data IS '回答データ（JSON形式）';
COMMENT ON COLUMN public.survey_drafts.current_step IS '現在の入力ステップ';
COMMENT ON COLUMN public.survey_drafts.is_submitted IS '提出済みフラグ';
COMMENT ON COLUMN public.survey_drafts.submitted_at IS '提出日時';
COMMENT ON COLUMN public.survey_drafts.created_at IS '作成日時';
COMMENT ON COLUMN public.survey_drafts.updated_at IS '更新日時';

-- =====================================================
-- 3. インデックス作成
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_business_number ON public.profiles(business_number);
CREATE INDEX IF NOT EXISTS idx_survey_drafts_user_id ON public.survey_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_drafts_survey_year ON public.survey_drafts(survey_year);

-- =====================================================
-- 4. updated_at自動更新関数
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. updated_atトリガー設定
-- =====================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_survey_drafts_updated_at ON public.survey_drafts;
CREATE TRIGGER update_survey_drafts_updated_at
  BEFORE UPDATE ON public.survey_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. Row Level Security (RLS) 有効化
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_drafts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. profilesテーブルのRLSポリシー
-- =====================================================
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 8. survey_draftsテーブルのRLSポリシー
-- =====================================================
DROP POLICY IF EXISTS drafts_select ON public.survey_drafts;
CREATE POLICY drafts_select ON public.survey_drafts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS drafts_insert ON public.survey_drafts;
CREATE POLICY drafts_insert ON public.survey_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS drafts_update ON public.survey_drafts;
CREATE POLICY drafts_update ON public.survey_drafts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS drafts_delete ON public.survey_drafts;
CREATE POLICY drafts_delete ON public.survey_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. 新規ユーザー登録時の自動プロファイル作成
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 完了確認
-- =====================================================
SELECT 'SUCCESS' as result, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
