"use client";

import { useQ28 } from "../SurveyContext";
import { Q28Basis } from "../types";

const OPTIONS: { value: Q28Basis; label: string }[] = [
  { value: "basic", label: "正規料金（割引なし）" },
  { value: "time_discount", label: "時間帯割引適用後の料金" },
  { value: "volume_discount", label: "大口・多頻度割引適用後の料金" },
];

export function Q28HighwayRateBasis() {
  const { data, update } = useQ28();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問28 高速道路利用料金の収受基準</h3>
        <p className="text-sm text-blue-100 mt-1">
          高速道路利用料金の請求額で、基準としている主な料金をご回答ください。
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${data.basis === option.value
                  ? "bg-blue-50 border-blue-300"
                  : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="q28_basis"
                value={option.value}
                checked={data.basis === option.value}
                onChange={() => update({ basis: option.value })}
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
