"use client";

import { useQ26 } from "../SurveyContext";

export function Q26FuelProcurement() {
  const { data, update } = useQ26();

  const handleOtherChange = (field: "selected" | "description", value: string | boolean) => {
    update({
      other: { ...data.other, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問26 燃料調達方法</h3>
        <p className="text-sm text-blue-100 mt-1">
          軽油の主な調達方法についてご回答ください。（複数選択可）
        </p>
      </div>

      <div className="p-4 space-y-3">
        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.cooperative ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.cooperative}
            onChange={(e) => update({ cooperative: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">協同組合での購入</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.gasStation ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.gasStation}
            onChange={(e) => update({ gasStation: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">ガソリンスタンドでの購入</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.lorry ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.lorry}
            onChange={(e) => update({ lorry: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">ローリー調達（インタンク）</span>
        </label>

        {/* その他 */}
        <div className={`p-3 rounded-lg border ${data.other.selected ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.other.selected}
              onChange={(e) => handleOtherChange("selected", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">その他</span>
          </label>
          {data.other.selected && (
            <div className="mt-3 ml-8">
              <input
                type="text"
                value={data.other.description}
                onChange={(e) => handleOtherChange("description", e.target.value)}
                placeholder="具体的にご記入ください"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
