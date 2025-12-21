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
      description="過去2年間に決算期の変更はありましたか？"
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
      description="直近の決算期において、営業損益は黒字でしたか？"
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
      description="直近2期連続で経常損益が赤字でしたか？"
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
      description="直近の決算期において、債務超過の状態にありますか？"
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
      description="決算書類の作成に税理士が関与していますか？"
      icon={FileText}
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
      value={data.hasTaxAccountant}
      onChange={(value) => update({ hasTaxAccountant: value })}
      className={className}
    />
  );
}
