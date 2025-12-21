"use client";

import { useQ37 } from "../SurveyContext";

export function Q37FareBasis() {
  const { data, update } = useQ37();

  const handleOtherChange = (field: "selected" | "description", value: string | boolean) => {
    update({
      other: { ...data.other, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問37 個建運賃の算定基準</h3>
        <p className="text-sm text-blue-100 mt-1">
          「個建運賃」を適用している場合、ご回答ください。どのような基準により設定していますか。
        </p>
      </div>

      <div className="p-4 space-y-3">
        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.weight ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.weight}
            onChange={(e) => update({ weight: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">重量（重さ）</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.volume ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.volume}
            onChange={(e) => update({ volume: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">容量（体積）</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.quantity ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.quantity}
            onChange={(e) => update({ quantity: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">個数（ケース数）</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.weightAndVolume ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.weightAndVolume}
            onChange={(e) => update({ weightAndVolume: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">重量と容積等の複数要因</span>
        </label>

        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.pallet ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.pallet}
            onChange={(e) => update({ pallet: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">パレット（ラック）単位</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg flash-pink"
              />
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
