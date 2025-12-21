# Q61・Q82 表形式レスポンシブ再設計ログ

**日付**: 2025-12-21
**コミット**: 2af8132

## 概要

問61（単車・運行詳細）と問82（トラクタ・運行詳細）をPDF調査票に準拠した表形式レイアウトに再設計。レスポンシブ対応により、PC/タブレットでは表形式、スマートフォンではカード形式を表示。

## 変更ファイル

- `src/components/survey/questions/Q61OperationDetails.tsx`
- `src/components/survey/questions/Q82TractorOperationDetails.tsx`

## 参照PDF

- `調査票/ドバイバン等/3.pdf` - 問61の表形式レイアウト参照

## 設計仕様

### レスポンシブブレークポイント

| 画面サイズ | レイアウト |
|-----------|----------|
| 768px以上 (md+) | 表形式 |
| 768px未満 | カード形式 |

### PC/タブレット表示（表形式）

4列構成:
1. **項目カテゴリ** - 乗務前点呼・整備点検等、指定場所へ移動時間と距離 など
2. **項目説明** - 出社から運行開始までの所要時間（平均）など
3. **記入例** - 15分、5km、食品/飲料 など（緑フラッシュ表示）
4. **入力欄** - テキスト入力 + 単位

### セクション見出し

運行の流れに沿った見出しを青/オレンジ背景で表示:
- 運転者が出社
- 車両乗務、運行開始（車庫を出発）
- 積込場所に到着
- 積込場所を出発
- 目的地に到着
- 目的地を出発
- 営業所の車庫に到着
- 運転者が退社

### テーマカラー

| 設問 | テーマ色 | 対象 |
|-----|---------|------|
| Q61 | 紫 (purple) | 単車 |
| Q82 | オレンジ (orange) | トラクタ |

### 入力フィードバック

- **未入力**: `flash-green`（緑フラッシュアニメーション）
- **入力済み**: `input-filled`（青背景）

## スマートフォン表示（カード形式）

従来のカード形式を維持:
- 各セクション（出発前、積込作業、走行、取卸作業、帰庫）が独立したカード
- セクション内はグリッドレイアウトで項目を配置

## 入力項目一覧

### 出発前
- 輸送品目
- 出社から運行開始までの所要時間
- 車庫から積込場所までの所要時間
- 車庫から積込場所までの走行距離

### 積込作業
- 待機時間
- 附帯作業時間
- 積込作業の所要時間
- 積込作業の実施者（運転者/荷主/その他）
- 積付（養生・固縛等）作業時間

### 走行
- 出発地から到着地までの所要時間（時間＋分）
- 出発地から到着地までの走行距離

### 取卸作業
- 待機時間
- 取卸作業の所要時間
- 取卸作業の実施者（運転者/荷主/その他）
- 附帯作業時間

### 帰庫
- 目的地から車庫までの所要時間
- 目的地から車庫までの走行距離
- 帰庫から退社までの所要時間

## 技術実装

### Tailwind CSSクラス

```tsx
// PC表示切替
<div className="hidden md:block">表形式</div>
<div className="md:hidden">カード形式</div>

// 記入例セル
<td className="text-center flash-green text-green-700 font-medium">15分</td>

// 入力フィードバック
className={`... ${value ? 'input-filled' : 'flash-green'}`}
```

### コンポーネント構造

```tsx
export function Q61OperationDetails() {
  const { data, update } = useQ61();

  const inputClass = (value) => `... ${value ? 'input-filled' : 'flash-green'}`;
  const tableInputClass = (value) => `... ${value ? 'input-filled' : 'flash-green'}`;

  return (
    <div>
      {/* ヘッダー */}
      <div className="hidden md:block">
        {/* PC: 表形式 */}
        <table>...</table>
      </div>
      <div className="md:hidden">
        {/* SP: カード形式 */}
      </div>
    </div>
  );
}
```

## デプロイ

- **GitHub**: `git push origin master`
- **Vercel**: `npx vercel --prod`
- **本番URL**: https://www.mlit.site/
