# ピンクフラッシュ機能実装計画

## 概要
設問において、選択した際に表示される数字入力・自由記述欄をピンク色でフラッシュさせる。
カーソルがアクティブ（フォーカス）になった場合は、フラッシュを中断する。

---

## 調査結果: 設問1〜30の条件付き入力フィールド一覧

### フラッシュ対象（条件付き入力フィールドあり）

| 設問 | ファイル | トリガー条件 | フラッシュ対象フィールド |
|------|----------|-------------|-------------------------|
| Q3 | Q3VehicleDetails.tsx | 「その他」チェック時 | テキスト入力（その他の車型） |
| Q15 | Q15SafetyExpenses.tsx | 項目チェック時 | 時間入力・金額入力欄 |
| Q16 | Q16BusinessInvestment.tsx | カテゴリ有効時 | 割合入力・金額入力・テキストエリア |
| Q17 | Q17AncillaryWorkFees.tsx | 項目選択時 | 収受額・損失額入力、「その他」テキスト |
| Q18 | Q18LoadingUnloadingFees.tsx | 「手荷役」「フォーク等」選択時 | 1時間当たり収受額入力 |
| Q20 | Q20StandbyWorkFees.tsx | 「収受」選択時 | 1時間当たり収受額入力 |
| Q21 | Q21WaitingTimeFees.tsx | 「別建て収受」「運賃に含める」「収受できていない」選択時 | 金額・損失額入力 |
| Q22 | Q22PreDesignatedWaiting.tsx | 「発生するが収受できていない」選択時 | 最長時間入力 |
| Q24 | Q24FuelSurchargeIntroduction.tsx | 「導入している」選択時 | 導入荷主割合入力 |
| Q26 | Q26FuelProcurement.tsx | 「その他」選択時 | テキスト入力 |
| Q29 | Q29TransactionTiers.tsx | 取引次数選択時 | 比率入力 |
| Q31 | Q31CharterFeeLevel.tsx | オプション選択時 | 金額・割合入力 |

### フラッシュ対象外（条件付きフィールドなし）

| 設問 | ファイル | 理由 |
|------|----------|------|
| Q2 | Q2VehicleCount.tsx | 常時表示の入力フィールド |
| Q4 | Q4DriverInfo.tsx | 常時表示のテーブル内入力 |
| Q5 | Q5AdministrativePenalty.tsx | ラジオボタンのみ |
| Q6 | Q6DisasterImpact.tsx | ラジオボタンのみ |
| Q7 | Q7BusinessChanges.tsx | チェックボックスのみ |
| Q8-Q11 | q7-q11/page.tsx | ラジオボタンのみ |
| Q12 | Q12FinancialStatement.tsx | 常時表示の入力フィールド |
| Q13 | Q13PLData.tsx | 常時表示の入力フィールド |
| Q14 | q12-q14/page.tsx | ラジオボタンのみ |
| Q19 | Q19MultipleLocations.tsx | ラジオボタンのみ |
| Q23 | Q23FuelSurchargeNegotiation.tsx | ラジオボタンのみ |
| Q25 | Q25FuelSurchargePrice.tsx | 常時表示の入力フィールド |
| Q27 | Q27HighwayFerryRates.tsx | 常時表示の入力フィールド |
| Q28 | Q28HighwayRateBasis.tsx | ラジオボタンのみ |
| Q30 | Q30CharterFeePayment.tsx | チェックボックスのみ |

---

## 実装計画

### Step 1: グローバルCSSにアニメーション定義追加

**ファイル:** `src/app/globals.css`

```css
/* ピンクフラッシュアニメーション */
@keyframes pinkFlash {
  0%, 100% {
    background-color: #fce7f3; /* pink-100 */
    box-shadow: 0 0 8px #f472b6; /* pink-400 */
  }
  50% {
    background-color: #fbcfe8; /* pink-200 */
    box-shadow: 0 0 16px #ec4899; /* pink-500 */
  }
}

.flash-pink {
  animation: pinkFlash 1s ease-in-out infinite;
}

.flash-pink:focus {
  animation: none;
  background-color: white;
  box-shadow: 0 0 0 2px #3b82f6; /* blue-500 focus ring */
}
```

### Step 2: 共通コンポーネント作成（オプション）

**ファイル:** `src/components/survey/FlashInput.tsx`

```tsx
"use client";

import { useState } from "react";

interface FlashInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showFlash?: boolean;
}

export function FlashInput({ showFlash = true, className = "", ...props }: FlashInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      {...props}
      className={`${className} ${showFlash && !isFocused ? "flash-pink" : ""}`}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
}
```

### Step 3: 各コンポーネントへの適用

#### パターンA: CSSクラス直接適用（シンプル）

条件付き入力フィールドに `flash-pink` クラスを追加し、`:focus` 疑似クラスでアニメーション停止。

```tsx
// 例: Q18LoadingUnloadingFees.tsx
{data.manualWork.selected && (
  <input
    type="text"
    value={data.manualWork.hourlyRate}
    className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"
  />
)}
```

#### パターンB: FlashInputコンポーネント使用

```tsx
// 例: Q18LoadingUnloadingFees.tsx
import { FlashInput } from "../FlashInput";

{data.manualWork.selected && (
  <FlashInput
    type="text"
    value={data.manualWork.hourlyRate}
    className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
    showFlash={true}
  />
)}
```

---

## 修正が必要なファイル一覧

### コンポーネントファイル（12ファイル）

1. `src/components/survey/questions/Q3VehicleDetails.tsx`
   - Line 277-283: その他テキスト入力

2. `src/components/survey/questions/Q15SafetyExpenses.tsx`
   - Line 169-178: 時間入力欄
   - Line 187-196: 金額入力欄
   - Line 246-254: その他金額入力欄

3. `src/components/survey/questions/Q16BusinessInvestment.tsx`
   - Line 380-388: 割合入力欄
   - Line 393-400: 金額入力欄
   - Line 437-444: テキストエリア

4. `src/components/survey/questions/Q17AncillaryWorkFees.tsx`
   - Line 143-154: 収受額入力欄
   - Line 174-185: 損失額入力欄
   - Line 126-135: その他テキスト入力

5. `src/components/survey/questions/Q18LoadingUnloadingFees.tsx`
   - Line 41-45: 手荷役収受額入力
   - Line 65-69: フォーク等収受額入力

6. `src/components/survey/questions/Q20StandbyWorkFees.tsx`
   - Line 55-59: 収受額入力欄

7. `src/components/survey/questions/Q21WaitingTimeFees.tsx`
   - Line 49-54: 別建て収受額入力
   - Line 74-79: 運賃含み換算額入力
   - Line 99-104: 損失額入力

8. `src/components/survey/questions/Q22PreDesignatedWaiting.tsx`
   - Line 41-45: 最長時間入力

9. `src/components/survey/questions/Q24FuelSurchargeIntroduction.tsx`
   - Line 53-58: 導入荷主割合入力

10. `src/components/survey/questions/Q26FuelProcurement.tsx`
    - Line 67-71: その他テキスト入力

11. `src/components/survey/questions/Q29TransactionTiers.tsx`
    - Line 53-59: 比率入力欄

12. `src/components/survey/questions/Q31CharterFeeLevel.tsx`
    - Line 55-60: 金額/割合入力欄

---

## 実装優先順位

1. **Phase 1**: globals.css にアニメーション定義追加
2. **Phase 2**: FlashInput共通コンポーネント作成
3. **Phase 3**: 各設問コンポーネントにFlashInputを適用（12ファイル）
4. **Phase 4**: 動作確認・微調整

---

## 技術仕様

### アニメーション設定
- **色**: ピンク系（pink-100 → pink-200）
- **周期**: 1秒
- **エフェクト**: box-shadow でグロー効果
- **停止条件**: input:focus 時

### ブラウザ互換性
- モダンブラウザ全対応（CSS Animation）
- IE11非対応（サポート対象外）

---

## 備考

- Q1は共通ページに含まれており、入力フィールドは確認されず
- Q31はQ30の次であり、設問30までの範囲には含まれるが一応対象として記載
- 共通ページ（q7-q11, q12-q14）はローカルstate管理のため、コンポーネント版への統一が推奨
