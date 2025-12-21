"use client";

import { AlertTriangle } from "lucide-react";
import { useQ5 } from "../SurveyContext";

const OPTIONS = [
  { value: "yes", label: "はい" },
  { value: "no", label: "いいえ" },
  { value: "unknown", label: "把握していない" },
];

interface Q5AdministrativePenaltyProps {
  className?: string;
}

export function Q5AdministrativePenalty({ className = "" }: Q5AdministrativePenaltyProps) {
  const { data, update } = useQ5();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問5</h2>
          <p className="text-slate-600 text-sm">
            過去2年間に行政処分を受けたことはありますか？
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
              data.hasAdministrativePenalty === option.value
                ? "bg-blue-50 border-blue-300"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="q5"
              value={option.value}
              checked={data.hasAdministrativePenalty === option.value}
              onChange={(e) => update({ hasAdministrativePenalty: e.target.value })}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {data.hasAdministrativePenalty === "yes" && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
          ※ 行政処分を受けた場合、詳細は別途確認させていただく場合があります。
        </div>
      )}
    </div>
  );
}
