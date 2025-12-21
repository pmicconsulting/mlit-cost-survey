"use client";

import { useQ42 } from "../SurveyContext";
import { ProcurementMethod } from "../types";

const PROCUREMENT_OPTIONS: { id: ProcurementMethod; label: string }[] = [
  { id: "purchase", label: "自社で購入" },
  { id: "lease", label: "リース" },
  { id: "other", label: "その他" },
];

export function Q42ProcurementMethod() {
  const { data, update } = useQ42();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問42 車両の調達方法</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象車両の調達方法を選択してください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {PROCUREMENT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-colors ${
              data.method === option.id
                ? "bg-purple-50 border-purple-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="procurementMethod"
              value={option.id}
              checked={data.method === option.id}
              onChange={() => update({ method: option.id })}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
