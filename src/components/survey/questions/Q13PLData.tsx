"use client";

import { FileText } from "lucide-react";
import { useQ13 } from "../SurveyContext";
import { Q13Data } from "../types";

const Q13_ITEMS: { id: keyof Q13Data; label: string }[] = [
  { id: "salesRevenue", label: "売上高（運送収入等）" },
  { id: "costOfSales", label: "売上原価（運送原価等）" },
  { id: "operatingProfit", label: "営業利益" },
];

// 数値フォーマット
const formatNumber = (value: string): string => {
  const num = parseInt(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

interface Q13PLDataProps {
  className?: string;
}

export function Q13PLData({ className = "" }: Q13PLDataProps) {
  const { data, update } = useQ13();

  const handleChange = (itemId: keyof Q13Data, value: string) => {
    const cleanValue = value.replace(/[^0-9-]/g, "");
    update({ [itemId]: cleanValue });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問13</h2>
          <p className="text-slate-600 text-sm">
            直近の確定申告で提出をした損益計算書（P/L）から、「千円」単位で転記してください。
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Q13_ITEMS.map((item) => {
          const value = data[item.id] || "";
          const numValue = parseInt(value) || 0;
          const isNegative = numValue < 0;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formatNumber(value)}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  className={`w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                    isNegative ? "text-red-600" : ""
                  } ${value ? 'input-filled' : 'flash-green'}`}
                  placeholder="0"
                />
                <span className="text-sm text-slate-500 w-10">千円</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
