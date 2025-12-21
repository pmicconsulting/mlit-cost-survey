"use client";

import { useQ29 } from "../SurveyContext";
import { TransactionTier } from "../types";

const TIERS: { key: keyof Omit<ReturnType<typeof useQ29>["data"], "unknown">; label: string }[] = [
  { key: "directDeal", label: "真荷主と直取引（元請の立場で受注）" },
  { key: "firstTier", label: "（元請から見て）1次請け" },
  { key: "secondTier", label: "（元請から見て）2次請け" },
  { key: "thirdOrMore", label: "（元請から見て）3次請け以上" },
];

export function Q29TransactionTiers() {
  const { data, update } = useQ29();

  const handleTierChange = (
    key: keyof Omit<typeof data, "unknown">,
    field: keyof TransactionTier,
    value: string | boolean
  ) => {
    update({
      [key]: { ...data[key], [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問29 取引次数と比率</h3>
        <p className="text-sm text-blue-100 mt-1">
          主な取引次数（元請、1次、2次、３次以上）と取引比率をご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {TIERS.map(({ key, label }) => (
          <div
            key={key}
            className={`p-3 rounded-lg border ${
              data[key].selected ? "bg-blue-50 border-blue-200" : "border-gray-200"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data[key].selected}
                onChange={(e) => handleTierChange(key, "selected", e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium flex-1">{label}</span>
              {data[key].selected && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data[key].ratio}
                    onChange={(e) => handleTierChange(key, "ratio", e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-right flash-green"
                    placeholder=""
                  />
                  <span className="text-gray-600">割</span>
                </div>
              )}
            </label>
          </div>
        ))}

        {/* 把握していない */}
        <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            checked={data.unknown}
            onChange={(e) => update({ unknown: e.target.checked })}
            className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
          />
          <span className="text-gray-700">把握していない</span>
        </label>

        <p className="text-xs text-gray-500">
          ※ 合計が10割になるようにご記入ください（例：直取引3割、1次請け5割、2次請け2割）
        </p>
      </div>
    </div>
  );
}
