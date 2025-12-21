"use client";

import { Building2 } from "lucide-react";
import { useQ7 } from "../SurveyContext";

const OPTIONS = [
  { value: "establishment", label: "設立（過去2年間の新規設立）" },
  { value: "merger", label: "合併" },
  { value: "transfer", label: "事業譲渡・譲受" },
  { value: "none", label: "発生していない" },
  { value: "unknown", label: "把握していない" },
];

interface Q7BusinessChangesProps {
  className?: string;
}

export function Q7BusinessChanges({ className = "" }: Q7BusinessChangesProps) {
  const { data, update } = useQ7();

  const handleToggle = (value: string) => {
    let updated: string[];

    // 「発生していない」「把握していない」は排他的
    if (value === "none" || value === "unknown") {
      if (data.businessChanges.includes(value)) {
        updated = data.businessChanges.filter((v) => v !== value);
      } else {
        updated = [value];
      }
    } else {
      // 他の選択肢の場合
      if (data.businessChanges.includes(value)) {
        updated = data.businessChanges.filter((v) => v !== value);
      } else {
        updated = [...data.businessChanges.filter((v) => v !== "none" && v !== "unknown"), value];
      }
    }

    update({ businessChanges: updated });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問7</h2>
          <p className="text-slate-600 text-sm">
            直近の決算月から過去２年間に、設立、合併、事業譲渡・譲受のいずれかが発生している場合、該当するものをすべて選択してください。
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const isSelected = data.businessChanges.includes(option.value);
          const isExclusive = option.value === "none" || option.value === "unknown";
          const isDisabled =
            !isExclusive &&
            (data.businessChanges.includes("none") || data.businessChanges.includes("unknown"));

          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                isSelected
                  ? "bg-blue-50 border-blue-300"
                  : isDisabled
                  ? "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={isDisabled && !isSelected}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700 font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
