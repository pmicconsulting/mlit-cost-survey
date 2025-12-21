# 開発サマリー 2025-12-21

## 概要
MLIT原価調査システムに単車調査（Q40-Q61）およびトラクター調査（Q62-Q82）を実装しました。

## 実装内容

### 1. 型定義の追加（types.ts）
- **単車調査（Q40-Q61）**: 22の型定義
  - `VEHICLE_SHAPES`: 車両形状16種類（ドライバン、冷蔵車、ダンプ車等）
  - `VehicleShape`, `Q40Data` - `Q61Data`

- **トラクター調査（Q62-Q82）**: 21の型定義
  - `CHASSIS_TYPES`: シャーシタイプ9種類（バン型、冷蔵型、重量物運搬用等）
  - `ChassisType`, `Q62Data` - `Q82Data`

- **共通型**
  - `ProcurementMethod`: 調達方法（購入/リース/その他）
  - `VehicleCondition`: 新車/中古車
  - `DistanceRange`: 運行距離帯（近距離/中距離/長距離）
  - `WorkerType`: 作業実施者（運転者/荷主/その他）

### 2. SurveyContext拡張
- Q40-Q82の初期値設定（`createInitialFormData`）
- Q40-Q82の更新関数（`updateQ40` - `updateQ82`）
- Q40-Q82のカスタムフック（`useQ40` - `useQ82`）
- 型インポートの追加

### 3. 単車コンポーネント（22ファイル）
| 設問 | コンポーネント | 内容 |
|------|---------------|------|
| Q40 | Q40VehicleShape | 車両形状選択（16種類ラジオ） |
| Q41 | Q41VehicleSpecs | 車両基本情報（営業所名、積載量等） |
| Q42 | Q42ProcurementMethod | 調達方法選択 |
| Q43 | Q43ProcurementDetails | 購入/リース詳細（条件付き表示） |
| Q44 | Q44EquipmentCosts | 付属備品費用（デジタコ、ドラレコ等） |
| Q45 | Q45DistanceRange | 主な運行距離帯 |
| Q46 | Q46MainCargo | 主な輸送品 |
| Q47 | Q47CrewCount | 平均乗務人数 |
| Q48 | Q48Taxes | 税金（環境性能割、自動車税等） |
| Q49 | Q49Insurance | 保険料（自賠責、任意） |
| Q50 | Q50FuelEfficiency | 平均燃費 |
| Q51 | Q51OilCosts | オイル関連費用 |
| Q52 | Q52TireCosts | タイヤ関連費用 |
| Q53 | Q53UreaCosts | 尿素水費用 |
| Q54 | Q54MaintenanceCosts | 車検・修理費用 |
| Q55 | Q55CargoHandlingSupplies | 荷役関連経費 |
| Q56 | Q56MonthlyRevenue | 月間収入・料金 |
| Q57 | Q57MonthlyOperations | 月間運行データ |
| Q58 | Q58AveragePerOperation | 1運行当たり平均 |
| Q59 | Q59VehicleWashing | 車両洗浄 |
| Q60 | Q60SpecialPermitCost | 特殊車両通行許可費用 |
| Q61 | Q61OperationDetails | 運行詳細（19フィールド） |

### 4. トラクターコンポーネント（21ファイル）
| 設問 | コンポーネント | 内容 |
|------|---------------|------|
| Q62 | Q62ChassisTypes | シャーシ選択（9種類、複数選択可） |
| Q63-Q82 | Q63-Q82Tractor* | 単車Q41-Q61と同等構造 |

### 5. ページ構成
#### 単車調査（紫色テーマ）
- `/survey/single-truck/step1` - 車両基本情報（Q40-Q44）
- `/survey/single-truck/step2` - 運行概要（Q45-Q47）
- `/survey/single-truck/step3` - 税金・保険・消耗品（Q48-Q54）
- `/survey/single-truck/step4` - 荷役・収入（Q55-Q57）
- `/survey/single-truck/step5` - 運行データ（Q58-Q60）
- `/survey/single-truck/step6` - 運行詳細（Q61）

#### トラクター調査（オレンジ色テーマ）
- `/survey/tractor/step1` - トラクター基本情報（Q62-Q66）
- `/survey/tractor/step2` - 運行概要（Q67-Q68）
- `/survey/tractor/step3` - 税金・保険・消耗品（Q69-Q75）
- `/survey/tractor/step4` - 荷役・収入（Q76-Q78）
- `/survey/tractor/step5` - 運行データ（Q79-Q81）
- `/survey/tractor/step6` - 運行詳細（Q82）

### 6. UIの修正
- 設問5（Q5AdministrativePenalty）: ラジオボタンを縦並びから横並びに変更

## ファイル構成
```
src/
├── components/survey/
│   ├── types.ts                    # 型定義（+約400行追加）
│   ├── SurveyContext.tsx           # コンテキスト（+約200行追加）
│   └── questions/
│       ├── Q40VehicleShape.tsx     # 単車コンポーネント
│       ├── Q41VehicleSpecs.tsx
│       ├── ...（Q42-Q60）
│       ├── Q61OperationDetails.tsx
│       ├── Q62ChassisTypes.tsx     # トラクターコンポーネント
│       ├── Q63TractorSpecs.tsx
│       ├── ...（Q64-Q81）
│       ├── Q82TractorOperationDetails.tsx
│       └── index.ts                # エクスポート追加
└── app/survey/
    ├── single-truck/               # 単車ページ（6ステップ）
    │   ├── step1/page.tsx
    │   ├── step2/page.tsx
    │   ├── step3/page.tsx
    │   ├── step4/page.tsx
    │   ├── step5/page.tsx
    │   └── step6/page.tsx
    └── tractor/                    # トラクターページ（6ステップ）
        ├── step1/page.tsx
        ├── step2/page.tsx
        ├── step3/page.tsx
        ├── step4/page.tsx
        ├── step5/page.tsx
        └── step6/page.tsx
```

## 総ページ数
58ページ（新規12ページ追加）

## デプロイ
- **Production URL**: https://mlitcostsurvey-jzdp9zfre-pmis-projects.vercel.app
- **GitHub**: https://github.com/pmicconsulting/mlit-cost-survey

## 技術スタック
- Next.js 16.0.10 (Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Supabase（認証・DB・Storage）

## 今後の改善点
- 確認画面（/survey/confirm）の拡張
- 単車・トラクターデータの表示・編集機能
- データ送信機能の実装
