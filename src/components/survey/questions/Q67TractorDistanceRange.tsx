"use client";

import { useQ67 } from "../SurveyContext";
import { DistanceRange } from "../types";

const DISTANCE_RANGE_OPTIONS: { id: DistanceRange; label: string; subLabel: string }[] = [
  { id: "short", label: "近距離帯", subLabel: "(200km未満)" },
  { id: "medium", label: "中距離帯", subLabel: "(200km以上～450km未満)" },
  { id: "long", label: "長距離帯", subLabel: "(450km以上)" },
];

export function Q67TractorDistanceRange() {
  const { data, update } = useQ67();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問67 主な運行距離帯</h3>
        <p className="text-sm text-orange-100 mt-1">
          対象トラクターの主な運行距離帯を選択してください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {DISTANCE_RANGE_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-colors ${
              data.distanceRange === option.id
                ? "bg-orange-50 border-orange-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="tractorDistanceRange"
              value={option.id}
              checked={data.distanceRange === option.id}
              onChange={() => update({ distanceRange: option.id })}
              className="w-5 h-5 text-orange-600 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-800">
              {option.label}
              <span className="text-gray-500 ml-1">{option.subLabel}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
