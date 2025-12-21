"use client";

import { useQ64 } from "../SurveyContext";
import { ProcurementMethod } from "../types";

const PROCUREMENT_OPTIONS: { id: ProcurementMethod; label: string }[] = [
  { id: "purchase", label: "購入による調達" },
  { id: "lease", label: "リースによる調達" },
  { id: "other", label: "その他" },
];

export function Q64TractorProcurementMethod() {
  const { data, update } = useQ64();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問64 調達方法</h3>
        <p className="text-sm text-orange-100 mt-1">
          記入対象の車両は、どのように調達しましたか、購入、リースのいずれか選択してください。（該当するものを１つ選択）
        </p>
      </div>

      <div className="p-4 space-y-3">
        {PROCUREMENT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-colors ${
              data.method === option.id
                ? "bg-orange-50 border-orange-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="tractorProcurementMethod"
              value={option.id}
              checked={data.method === option.id}
              onChange={() => update({ method: option.id })}
              className="w-5 h-5 text-orange-600 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
