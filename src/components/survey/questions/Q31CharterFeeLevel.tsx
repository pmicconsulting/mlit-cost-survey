"use client";

import { useQ31 } from "../SurveyContext";
import { CharterFeeLevel } from "../types";

const OPTIONS: { key: keyof ReturnType<typeof useQ31>["data"]; label: string; unit: string }[] = [
  { key: "deductPercentage", label: "運賃に一定率を乗じた額を差し引いて協力会社等に支払い", unit: "%" },
  { key: "addPercentage", label: "運賃に一定率を乗じた額を加算して荷主等に請求", unit: "%" },
  { key: "deductFixed", label: "運賃額に関係なく定額を差し引いて協力会社等に支払い", unit: "円" },
  { key: "addFixed", label: "運賃額に関係なく定額を加算して荷主等に請求", unit: "円" },
];

export function Q31CharterFeeLevel() {
  const { data, update } = useQ31();

  const handleOptionChange = (
    key: keyof typeof data,
    field: keyof CharterFeeLevel,
    value: string | boolean
  ) => {
    update({
      [key]: { ...data[key], [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問31 利用運送手数料の水準</h3>
        <p className="text-sm text-blue-100 mt-1">
          利用運送手数料（傭車手配の手数料）の平均的な水準をご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {OPTIONS.map(({ key, label, unit }) => (
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
                onChange={(e) => handleOptionChange(key, "selected", e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium flex-1">{label}</span>
            </label>
            {data[key].selected && (
              <div className="mt-3 ml-8 flex items-center gap-2">
                <span className="text-gray-600">→</span>
                <input
                  type="text"
                  value={data[key].value}
                  onChange={(e) => handleOptionChange(key, "value", e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"
                />
                <span className="text-gray-600">{unit}</span>
              </div>
            )}
          </div>
        ))}

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
