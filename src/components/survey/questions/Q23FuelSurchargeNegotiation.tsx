"use client";

import { useQ23 } from "../SurveyContext";
import { YesNoUnknown } from "../types";

const OPTIONS: { value: YesNoUnknown; label: string }[] = [
  { value: "yes", label: "はい、交渉した" },
  { value: "no", label: "いいえ、交渉していない" },
  { value: "unknown", label: "把握していない" },
];

export function Q23FuelSurchargeNegotiation() {
  const { data, update } = useQ23();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問23 燃料サーチャージの交渉</h3>
        <p className="text-sm text-blue-100 mt-1">
          荷主等に燃料サーチャージの導入に向けた交渉をしたことがありますか。
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${data.hasFuelSurchargeNegotiation === option.value
                  ? "bg-blue-50 border-blue-300"
                  : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="q23_status"
                value={option.value}
                checked={data.hasFuelSurchargeNegotiation === option.value}
                onChange={() => update({ hasFuelSurchargeNegotiation: option.value })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500 text-right">（該当するもの1つ選択）</p>
      </div>
    </div>
  );
}
