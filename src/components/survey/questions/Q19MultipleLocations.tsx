"use client";

import { useQ19 } from "../SurveyContext";
import { Q19Status } from "../types";

const OPTIONS: { value: Q19Status; label: string }[] = [
  { value: "each_location", label: "それぞれの箇所での作業料金を収受" },
  { value: "included_in_one", label: "1箇所での作業料金に含まれている" },
  { value: "included_in_fare", label: "作業料金として収受していない（運賃に含められている）" },
  { value: "not_collected", label: "作業料金を実質的に収受できていない" },
  { value: "not_performing", label: "作業を自社で行っていない" },
];

export function Q19MultipleLocations() {
  const { data, update } = useQ19();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問19 複数箇所での収受実態</h3>
        <p className="text-sm text-blue-100 mt-1">
          複数箇所で積込・取卸・附帯作業を行う場合の収受実態についてご回答ください。
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${data.status === option.value
                  ? "bg-blue-50 border-blue-300"
                  : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="q19_status"
                value={option.value}
                checked={data.status === option.value}
                onChange={() => update({ status: option.value })}
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
