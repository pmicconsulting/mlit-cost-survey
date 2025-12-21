"use client";

import { Calendar, TrendingUp, TrendingDown, AlertCircle, FileText } from "lucide-react";
import { useQ8, useQ9, useQ10, useQ11, useQ14 } from "../SurveyContext";
import { RadioQuestion } from "./RadioQuestion";

// Q8: 決算期変更
export function Q8FiscalYearChange({ className = "" }: { className?: string }) {
  const { data, update } = useQ8();

  return (
    <RadioQuestion
      questionNumber="q8"
      title="設問8"
      description="過去２期の決算において、決算期の変更により決算期間が通常より短縮または延長された結果、通常の決算期間と比べて業績が著しく変動している状況はありますか。"
      icon={Calendar}
      iconBgColor="bg-purple-100"
      iconColor="text-purple-600"
      value={data.hasFiscalYearChange}
      onChange={(value) => update({ hasFiscalYearChange: value })}
      className={className}
    />
  );
}

// Q9: 営業損益
export function Q9OperatingProfit({ className = "" }: { className?: string }) {
  const { data, update } = useQ9();

  return (
    <RadioQuestion
      questionNumber="q9"
      title="設問9"
      description="一般貨物自動車運送事業損益明細表で、直近の決算期で、営業損益（営業利益）が黒字（プラス）ですか。"
      icon={TrendingUp}
      iconBgColor="bg-green-100"
      iconColor="text-green-600"
      value={data.hasOperatingProfit}
      onChange={(value) => update({ hasOperatingProfit: value })}
      className={className}
    />
  );
}

// Q10: 経常損益
export function Q10ConsecutiveLoss({ className = "" }: { className?: string }) {
  const { data, update } = useQ10();

  return (
    <RadioQuestion
      questionNumber="q10"
      title="設問10"
      description="一般貨物自動車運送事業損益明細表で、過去２期連続で、経常損益（経常利益）が黒字（プラス）ですか。"
      icon={TrendingDown}
      iconBgColor="bg-red-100"
      iconColor="text-red-600"
      value={data.hasConsecutiveLoss}
      onChange={(value) => update({ hasConsecutiveLoss: value })}
      className={className}
    />
  );
}

// Q11: 債務超過
export function Q11ExcessDebt({ className = "" }: { className?: string }) {
  const { data, update } = useQ11();

  return (
    <RadioQuestion
      questionNumber="q11"
      title="設問11"
      description="直近の決算期の貸借対照表「株主（自己）資本の部」は債務超過ですか。※債務超過は「株主資本合計がマイナス」の状態です。"
      icon={AlertCircle}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-600"
      value={data.hasExcessDebt}
      onChange={(value) => update({ hasExcessDebt: value })}
      className={className}
    />
  );
}

// Q14: 税理士関与
export function Q14TaxAccountant({ className = "" }: { className?: string }) {
  const { data, update } = useQ14();

  return (
    <RadioQuestion
      questionNumber="q14"
      title="設問14"
      description="決算書作成にあたり、税理士・公認会計士が関与していますか。"
      icon={FileText}
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
      value={data.hasTaxAccountant}
      onChange={(value) => update({ hasTaxAccountant: value })}
      className={className}
    />
  );
}
