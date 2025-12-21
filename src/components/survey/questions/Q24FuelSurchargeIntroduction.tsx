"use client";

import { useQ24 } from "../SurveyContext";
import { Q24Status } from "../types";

const OPTIONS: { value: Q24Status; label: string; hasInput?: boolean }[] = [
  { value: "introduced", label: "燃料サーチャージを導入している", hasInput: true },
  { value: "not_introduced", label: "燃料サーチャージを導入していない" },
  { value: "unknown", label: "把握していない" },
];

export function Q24FuelSurchargeIntroduction() {
  const { data, update } = useQ24();

  const handleStatusChange = (status: Q24Status) => {
    update({ status, percentage: status === "introduced" ? data.percentage : "" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問24 燃料サーチャージの導入状況</h3>
        <p className="text-sm text-blue-100 mt-1">
          燃料サーチャージの導入状況についてご回答ください。
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {OPTIONS.map((option) => (
            <div key={option.value}>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${data.status === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="q24_status"
                  value={option.value}
                  checked={data.status === option.value}
                  onChange={() => handleStatusChange(option.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>

              {/* 条件付き入力欄 */}
              {option.hasInput && data.status === option.value && (
                <div className="ml-10 mt-2 flex items-center gap-2">
                  <span className="text-gray-600">→ 導入している荷主の割合：</span>
                  <input
                    type="text"
                    value={data.percentage}
                    onChange={(e) => update({ percentage: e.target.value })}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                  <span className="text-gray-600">%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500 text-right">（該当するもの1つ選択）</p>
      </div>
    </div>
  );
}
