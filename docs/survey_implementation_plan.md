# 調査票WEB版 実装計画書

## 1. 概要

### 1.1 プロジェクト概要
- **目的**: 国土交通省の適正原価実態調査票をWEB版として実装
- **調査票種類**: 12種類（90%共通、10%相違）
- **総ページ数**: 約20ページ/種類
- **データベース**: Supabase（PostgreSQL）

### 1.2 調査票の種類（12種類）
| No | 車型カテゴリ | 備考 |
|----|-------------|------|
| 1 | ドライバン等 | バンボディ、ウィングボディ、平ボディ、幌ウィング |
| 2 | 冷蔵車・冷凍車 | 特殊車両 |
| 3 | ダンプ車 | 特殊車両 |
| 4 | タンク車 | 特殊車両 |
| 5 | バルク車 | 特殊車両 |
| 6 | コンテナ輸送車 | 特殊車両 |
| 7 | コンクリートミキサー車 | 特殊車両 |
| 8 | トラック搭載型クレーン車 | 特殊車両 |
| 9 | 一般廃棄物輸送車 | 特殊車両 |
| 10 | 車積載車（キャリアカー） | 特殊車両 |
| 11 | 重量物輸送車 | 特殊車両 |
| 12 | その他 | 上記以外 |

---

## 2. 設問分析（PDF 4ページ分）

### 2.1 設問一覧と入力タイプ

#### ページ1: 設問2〜6（事業全体情報）

| 設問 | 内容 | 入力タイプ | 複雑度 |
|------|------|-----------|--------|
| Q2 | 保有車両台数（全営業所） | 数値入力×1 | 低 |
| Q3 | 保有車両詳細 | 複合テーブル（数値×10 + チェックボックス×16） | **高** |
| Q4 | 運転者情報 | テーブル（数値×20：5項目×4カテゴリ） | **高** |
| Q5 | 行政処分の有無 | ラジオ（3択） | 低 |
| Q6 | 災害影響の有無 | ラジオ（3択） | 低 |

#### ページ2: 設問7〜14（財務情報）

| 設問 | 内容 | 入力タイプ | 複雑度 |
|------|------|-----------|--------|
| Q7 | 設立・合併等の発生 | チェックボックス（5択・複数可） | 低 |
| Q8 | 決算期変更の有無 | ラジオ（3択） | 低 |
| Q9 | 営業損益（黒字/赤字） | ラジオ（3択） | 低 |
| Q10 | 経常損益（2期連続） | ラジオ（3択） | 低 |
| Q11 | 債務超過の有無 | ラジオ（3択） | 低 |
| Q12 | 損益明細表データ | 数値入力×10（千円単位） | 中 |
| Q13 | P/Lデータ | 数値入力×3（千円単位） | 低 |
| Q14 | 税理士関与の有無 | ラジオ（3択） | 低 |

#### ページ3: 設問15（安全関連経費）

| 設問 | 内容 | 入力タイプ | 複雑度 |
|------|------|-----------|--------|
| Q15 | 安全確保経費 | チェックボックス×14 + 各項目に時間・金額入力 | **高** |

#### ページ4: 設問16（事業継続投資）

| 設問 | 内容 | 入力タイプ | 複雑度 |
|------|------|-----------|--------|
| Q16 | 事業継続投資 | 5カテゴリ×複数項目×（割合%＋金額＋その他テキスト） | **最高** |

---

## 3. WEB画面設計

### 3.1 画面構成（ステップ方式）

```
ステップ1: 事業基本情報（Q2-Q6）
  └─ Step1-1: 車両台数（Q2-Q3）
  └─ Step1-2: 運転者情報（Q4）
  └─ Step1-3: 確認事項（Q5-Q6）

ステップ2: 財務情報（Q7-Q14）
  └─ Step2-1: 事業変動確認（Q7-Q11）
  └─ Step2-2: 損益明細表（Q12）
  └─ Step2-3: P/L・その他（Q13-Q14）

ステップ3: 安全関連経費（Q15）
  └─ Step3-1: 法定経費
  └─ Step3-2: 任意経費

ステップ4: 事業継続投資（Q16）
  └─ Step4-1: 事業基盤強化
  └─ Step4-2: 人材関連
  └─ Step4-3: BCP関連
  └─ Step4-4: 環境対策

ステップ5: 車両個別情報（車型別：10%相違部分）
  └─ 車型ごとの固有設問

ステップ6: 確認・提出
```

### 3.2 各設問のUI実装方針

#### Q2: 保有車両台数
```
┌─────────────────────────────────────┐
│ 保有車両台数                           │
│ ┌─────────────────┐                │
│ │      [    ] 両  │                │
│ └─────────────────┘                │
└─────────────────────────────────────┘
```
- **コンポーネント**: NumberInput
- **バリデーション**: 0以上の整数

#### Q3: 保有車両詳細（複合テーブル）
```
┌──────────────────────────────────────────────────────────────────┐
│ ドライバン等                                                       │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │
│ │牽引車    │被牽引車  │大型10t   │中型4t    │小型2t    │        │
│ │[  ]両   │[  ]両   │[  ]両   │[  ]両   │[  ]両   │        │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘        │
│                                                                  │
│ 車型（複数選択可）                                                 │
│ ☐ バンボディ  ☐ ウィングボディ  ☐ 平ボディ  ☐ 幌ウィング  ☐ バン型 │
├──────────────────────────────────────────────────────────────────┤
│ ドライバン等以外                                                   │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │
│ │牽引車    │被牽引車  │大型10t   │中型4t    │小型2t    │        │
│ │[  ]両   │[  ]両   │[  ]両   │[  ]両   │[  ]両   │        │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘        │
│                                                                  │
│ 車型（複数選択可）                                                 │
│ ☐ 冷蔵車・冷凍車  ☐ ダンプ車  ☐ タンク車  ☐ バルク車  ...        │
│ ☐ その他 [________________]                                      │
└──────────────────────────────────────────────────────────────────┘
```
- **コンポーネント**: VehicleDetailTable（カスタム）
- **バリデーション**: 各数値0以上、車型は1つ以上選択

#### Q4: 運転者情報（マトリクステーブル）
```
┌──────────────────────────────────────────────────────────────────┐
│ 1ヶ月合計      │牽引車  │大型車  │中型車  │小型車  │その他  │
├──────────────┼────────┼────────┼────────┼────────┼────────┤
│月間平均労働日数│[  ]日 │[  ]日 │[  ]日 │[  ]日 │[  ]日 │
│月間平均労働時間│[  ]時間│[  ]時間│[  ]時間│[  ]時間│[  ]時間│
│月間平均賃金総額│[  ]万円│[  ]万円│[  ]万円│[  ]万円│[  ]万円│
│平均年齢       │[  ]歳 │[  ]歳 │[  ]歳 │[  ]歳 │[  ]歳 │
└──────────────────────────────────────────────────────────────────┘
```
- **コンポーネント**: DriverInfoMatrix（カスタム）
- **バリデーション**: 労働日数0-31、労働時間0-744、賃金0以上、年齢18-80

#### Q5-Q6, Q8-Q11, Q14: ラジオボタン（3択）
```
┌─────────────────────────────────────────────────┐
│ Q5: 過去2年間に行政処分を受けたことはありますか？   │
│                                                 │
│ ○ はい  ○ いいえ  ○ 把握していない              │
└─────────────────────────────────────────────────┘
```
- **コンポーネント**: RadioGroup
- **バリデーション**: 必須選択

#### Q7: チェックボックス（複数選択）
```
┌─────────────────────────────────────────────────┐
│ Q7: 該当するものをすべて選択                      │
│                                                 │
│ ☐ 設立  ☐ 合併  ☐ 事業譲渡・譲受               │
│ ☐ 発生していない  ☐ 把握していない               │
└─────────────────────────────────────────────────┘
```
- **コンポーネント**: CheckboxGroup
- **バリデーション**: 1つ以上選択

#### Q12: 損益明細表（ペア入力）
```
┌──────────────────────────────────────────────────────────────┐
│ 一般貨物自動車運送事業損益明細表                               │
├─────────────────┬──────────┬─────────────────┬──────────┤
│営業収益（合計）  │[     ]千円│傭車費用         │[     ]千円│
│施設使用料       │[     ]千円│一般管理費（合計）│[     ]千円│
│施設賦課税       │[     ]千円│営業費用（合計）  │[     ]千円│
│事故賠償費       │[     ]千円│営業損益         │[     ]千円│
│その他          │[     ]千円│経常損益         │[     ]千円│
└──────────────────────────────────────────────────────────────┘
```
- **コンポーネント**: FinancialStatementForm（カスタム）
- **バリデーション**: 数値、マイナス可（損益）

#### Q15: 安全関連経費（チェック＋入力）
```
┌───────────────────────────────────────────────────────────────────┐
│ 安全確保のための経費                                              │
├───────────────────────────────────────────┬──────────┬──────────┤
│                                          │年間時間  │年間金額  │
├───────────────────────────────────────────┼──────────┼──────────┤
│☐【トラック法法定】運行管理者講習の受講費用  │[   ]時間/年│[   ]万円/年│
│☐【トラック法法定】整備管理者講習の受講費用  │[   ]時間/年│[   ]万円/年│
│☐【トラック法法定】運転者講習の受講費用     │[   ]時間/年│[   ]万円/年│
│...                                        │          │          │
└───────────────────────────────────────────────────────────────────┘
```
- **コンポーネント**: SafetyExpenseForm（カスタム）
- **ロジック**: チェック時のみ入力欄を活性化

#### Q16: 事業継続投資（カテゴリ別・複合入力）
```
┌───────────────────────────────────────────────────────────────────┐
│ ▼ 事業基盤強化に向けた投資                                        │
│   総費用に対する割合: [   ]%    概算額: [      ]万円/年           │
│                                                                   │
│   ☐ 施設・設備更新                                               │
│     └─ 荷役設備の更新（フォークリフト等）                          │
│     └─ 待機場所の確保                                             │
│     └─ その他: [________________]                                 │
│                                                                   │
│   ☐ コンプライアンス・ガバナンス                                   │
│     └─ 業務システムのセキュリティ対策強化                          │
│     └─ ...                                                       │
├───────────────────────────────────────────────────────────────────┤
│ ▼ 将来の人材関連投資                                              │
│   ...                                                            │
└───────────────────────────────────────────────────────────────────┘
```
- **コンポーネント**: BusinessInvestmentForm（カスタム）
- **ロジック**: アコーディオン形式、カテゴリ選択で子項目表示

---

## 4. データベース設計

### 4.1 設計方針

#### 基本原則
1. **正規化と非正規化のバランス**: 頻繁に参照するデータは非正規化
2. **JSONB活用**: 複雑な構造はJSONBカラムで柔軟に対応
3. **共通テーブル分離**: 12種類の調査票で90%共通の設問は共通テーブルに
4. **車型別テーブル**: 10%の相違部分は車型別テーブルで管理
5. **履歴管理**: 回答の変更履歴を保持

### 4.2 テーブル構成

```sql
-- ============================================
-- 1. マスターテーブル
-- ============================================

-- 調査票種類マスタ
CREATE TABLE survey_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,      -- 'dryvan', 'refrigerator', etc.
  name VARCHAR(100) NOT NULL,            -- 'ドライバン等', '冷蔵車・冷凍車'
  category VARCHAR(50),                  -- 'standard', 'special'
  display_order INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 車型マスタ（チェックボックス選択肢）
CREATE TABLE vehicle_body_types (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,         -- 'dryvan', 'special', 'other'
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_order INT,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- 2. 回答管理テーブル
-- ============================================

-- 調査回答（メイン）
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  survey_year INT NOT NULL,              -- 調査年度
  survey_type_id INT REFERENCES survey_types(id),
  status VARCHAR(20) DEFAULT 'draft',    -- draft, submitted, approved
  current_step INT DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, survey_year, survey_type_id)
);

-- ============================================
-- 3. 共通設問回答テーブル（90%部分）
-- ============================================

-- Q2: 保有車両台数
CREATE TABLE answers_q2_vehicle_count (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  total_vehicles INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q3: 保有車両詳細
CREATE TABLE answers_q3_vehicle_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  -- ドライバン等
  dryvan_tractor INT DEFAULT 0,
  dryvan_chassis INT DEFAULT 0,
  dryvan_large INT DEFAULT 0,
  dryvan_medium INT DEFAULT 0,
  dryvan_small INT DEFAULT 0,
  dryvan_body_types TEXT[],              -- ['van_body', 'wing_body', ...]
  -- ドライバン等以外
  other_tractor INT DEFAULT 0,
  other_chassis INT DEFAULT 0,
  other_large INT DEFAULT 0,
  other_medium INT DEFAULT 0,
  other_small INT DEFAULT 0,
  other_body_types TEXT[],               -- ['refrigerator', 'dump', ...]
  other_body_type_text VARCHAR(200),     -- 「その他」の自由記入
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q4: 運転者情報
CREATE TABLE answers_q4_driver_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  -- JSONB形式で車格別データを格納
  -- { "tractor": { "days": 22, "hours": 180, "wage": 35, "age": 48 }, ... }
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q5-Q6, Q8-Q11, Q14: 単純選択回答
CREATE TABLE answers_simple_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_number INT NOT NULL,          -- 5, 6, 8, 9, 10, 11, 14
  answer VARCHAR(50),                    -- 'yes', 'no', 'unknown'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id, question_number)
);

-- Q7: 複数選択回答
CREATE TABLE answers_q7_business_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  selected_options TEXT[],               -- ['establishment', 'merger', ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q12: 損益明細表
CREATE TABLE answers_q12_financial_statement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  operating_revenue BIGINT,              -- 営業収益（千円）
  facility_usage_fee BIGINT,             -- 施設使用料
  facility_tax BIGINT,                   -- 施設賦課税
  accident_compensation BIGINT,          -- 事故賠償費
  other_expenses BIGINT,                 -- その他
  charter_cost BIGINT,                   -- 傭車費用
  general_admin_cost BIGINT,             -- 一般管理費
  operating_cost BIGINT,                 -- 営業費用
  operating_profit BIGINT,               -- 営業損益
  ordinary_profit BIGINT,                -- 経常損益
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q13: P/Lデータ
CREATE TABLE answers_q13_pl_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  total_sales BIGINT,                    -- 売上高（千円）
  operating_profit BIGINT,               -- 営業損益
  ordinary_profit BIGINT,                -- 経常損益
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q15: 安全関連経費
CREATE TABLE answers_q15_safety_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  -- JSONB形式で各項目のデータを格納
  -- { "operation_manager_training": { "selected": true, "hours": 8, "amount": 5 }, ... }
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- Q16: 事業継続投資
CREATE TABLE answers_q16_business_investment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  -- JSONB形式でカテゴリ別データを格納
  -- {
  --   "infrastructure": {
  --     "percentage": 15,
  --     "amount": 500,
  --     "items": {
  --       "facility_update": { "selected": true },
  --       "compliance": { "selected": true, "other_text": "..." }
  --     }
  --   },
  --   ...
  -- }
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id)
);

-- ============================================
-- 4. 車型別テーブル（10%相違部分）
-- ============================================

-- 車両個別情報（車型共通構造）
CREATE TABLE answers_vehicle_specific (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  vehicle_index INT NOT NULL,            -- 同一回答内の車両番号
  -- 車型別の固有項目はJSONBで柔軟に対応
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id, vehicle_index)
);

-- ============================================
-- 5. インデックス
-- ============================================

CREATE INDEX idx_survey_responses_user ON survey_responses(user_id);
CREATE INDEX idx_survey_responses_year ON survey_responses(survey_year);
CREATE INDEX idx_survey_responses_status ON survey_responses(status);
CREATE INDEX idx_answers_q15_data ON answers_q15_safety_expenses USING GIN(data);
CREATE INDEX idx_answers_q16_data ON answers_q16_business_investment USING GIN(data);
```

### 4.3 JSONB構造定義

#### Q4: 運転者情報
```json
{
  "tractor": {
    "working_days": 22,
    "working_hours": 180,
    "total_wage": 35,
    "average_age": 48
  },
  "large": {
    "working_days": 23,
    "working_hours": 200,
    "total_wage": 32,
    "average_age": 45
  },
  "medium": { ... },
  "small": { ... },
  "other": { ... }
}
```

#### Q15: 安全関連経費
```json
{
  "operation_manager_training": {
    "selected": true,
    "hours_per_year": 8,
    "amount_per_year": 5
  },
  "maintenance_manager_training": {
    "selected": false,
    "hours_per_year": null,
    "amount_per_year": null
  },
  "driver_training": { ... },
  "aptitude_test": { ... },
  "alcohol_detector": { ... },
  "health_check_new": { ... },
  "health_check_regular": { ... },
  "g_mark": { ... },
  "safety_management_consulting": { ... },
  "auto_roll_call": { ... },
  "heat_stroke": { ... },
  "safety_operation_system": { ... },
  "driver_training_time": { ... },
  "other": {
    "selected": true,
    "description": "AED設置",
    "amount_per_year": 10
  }
}
```

#### Q16: 事業継続投資
```json
{
  "infrastructure": {
    "percentage": 15,
    "amount": 500,
    "facility_update": {
      "selected": true,
      "items": ["forklift", "waiting_area"],
      "other_text": null
    },
    "compliance": {
      "selected": true,
      "items": ["security", "legal_system", "certification"],
      "other_text": null
    }
  },
  "human_resources": {
    "percentage": 10,
    "amount": 300,
    "recruitment": {
      "selected": true,
      "items": ["foreign_worker", "diversity"],
      "other_text": null
    },
    "training": { ... },
    "work_environment": { ... }
  },
  "bcp": { ... },
  "environment": { ... },
  "other": { ... }
}
```

---

## 5. コンポーネント設計

### 5.1 共通コンポーネント

```
src/components/survey/
├── common/
│   ├── SurveyLayout.tsx          # 調査票全体レイアウト
│   ├── StepIndicator.tsx         # ステップインジケーター
│   ├── SectionHeader.tsx         # セクションヘッダー
│   ├── QuestionCard.tsx          # 設問カード
│   ├── RadioQuestion.tsx         # ラジオボタン設問
│   ├── CheckboxQuestion.tsx      # チェックボックス設問
│   ├── NumberInput.tsx           # 数値入力
│   ├── CurrencyInput.tsx         # 金額入力（千円/万円対応）
│   ├── MatrixTable.tsx           # マトリクステーブル
│   └── SaveButton.tsx            # 保存ボタン
│
├── questions/
│   ├── Q2VehicleCount.tsx        # Q2: 車両台数
│   ├── Q3VehicleDetails.tsx      # Q3: 車両詳細（複合）
│   ├── Q4DriverInfo.tsx          # Q4: 運転者情報
│   ├── Q5to6Confirmation.tsx     # Q5-Q6: 確認事項
│   ├── Q7BusinessChanges.tsx     # Q7: 事業変動
│   ├── Q8to11Financial.tsx       # Q8-Q11: 財務確認
│   ├── Q12FinancialStatement.tsx # Q12: 損益明細表
│   ├── Q13PLData.tsx             # Q13: P/L
│   ├── Q14Accountant.tsx         # Q14: 税理士関与
│   ├── Q15SafetyExpenses.tsx     # Q15: 安全経費
│   └── Q16BusinessInvestment.tsx # Q16: 事業投資
│
├── steps/
│   ├── Step1BasicInfo.tsx        # ステップ1
│   ├── Step2Financial.tsx        # ステップ2
│   ├── Step3Safety.tsx           # ステップ3
│   ├── Step4Investment.tsx       # ステップ4
│   ├── Step5VehicleSpecific.tsx  # ステップ5（車型別）
│   └── Step6Confirm.tsx          # ステップ6
│
└── hooks/
    ├── useSurveyForm.ts          # フォーム状態管理
    ├── useSurveyAutoSave.ts      # 自動保存
    └── useSurveyValidation.ts    # バリデーション
```

### 5.2 状態管理（Zustand）

```typescript
// src/stores/surveyStore.ts
interface SurveyStore {
  // 基本情報
  responseId: string | null;
  surveyYear: number;
  surveyTypeId: number;
  currentStep: number;
  status: 'draft' | 'submitted';

  // 回答データ
  answers: {
    q2: Q2Answer | null;
    q3: Q3Answer | null;
    q4: Q4Answer | null;
    simpleChoices: Record<number, string>;
    q7: string[];
    q12: Q12Answer | null;
    q13: Q13Answer | null;
    q15: Q15Answer | null;
    q16: Q16Answer | null;
    vehicleSpecific: VehicleSpecificAnswer[];
  };

  // アクション
  setAnswer: (question: string, data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveProgress: () => Promise<void>;
  submit: () => Promise<void>;
}
```

---

## 6. 実装スケジュール

### Phase 1: 基盤構築（1週目）
- [ ] データベーステーブル作成
- [ ] 共通コンポーネント作成
- [ ] 状態管理（Zustand）セットアップ
- [ ] 自動保存機能

### Phase 2: 設問実装（2-3週目）
- [ ] Q2-Q6 実装
- [ ] Q7-Q14 実装
- [ ] Q15 実装
- [ ] Q16 実装

### Phase 3: 車型別対応（4週目）
- [ ] 車型別設問の分析
- [ ] 車型別コンポーネント作成
- [ ] 12種類の調査票対応

### Phase 4: 仕上げ（5週目）
- [ ] バリデーション強化
- [ ] エラーハンドリング
- [ ] 確認・提出画面
- [ ] テスト

---

## 7. 技術的考慮事項

### 7.1 パフォーマンス
- 大きなフォームは遅延読み込み
- 入力値のデバウンス処理（自動保存）
- JSONB検索用のGINインデックス

### 7.2 UX
- ステップ間の進捗保存
- 入力中の離脱警告
- エラー箇所へのスクロール
- モバイル対応（レスポンシブ）

### 7.3 データ整合性
- トランザクション処理
- 楽観的ロック（updated_at比較）
- バリデーションエラーの詳細表示

---

## 8. 次のアクション

1. **残りページの確認**: 設問17以降のPDF取得
2. **12種類の調査票比較**: 相違点の特定
3. **プロトタイプ作成**: Q3（複合テーブル）から着手
4. **Supabaseテーブル作成**: 開発環境でテスト
