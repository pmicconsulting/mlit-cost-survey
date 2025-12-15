-- =====================================================
-- 既存テーブル更新SQL
--
-- 【実行対象】既にテーブルが存在する環境
-- Supabase SQL Editorで実行してください
-- =====================================================

-- =====================================================
-- 1. 不要カラム削除
-- =====================================================
ALTER TABLE public.profiles DROP COLUMN IF EXISTS display_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- =====================================================
-- 2. profilesテーブル 日本語コメント追加
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
-- 3. survey_draftsテーブル 日本語コメント追加
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
-- 4. handle_new_user関数を更新（display_name, avatar_url削除）
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

-- =====================================================
-- 完了確認
-- =====================================================
SELECT 'UPDATE SUCCESS' as result;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
