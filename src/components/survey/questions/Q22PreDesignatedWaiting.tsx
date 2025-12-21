"use client";

import { useQ22 } from "../SurveyContext";

export function Q22PreDesignatedWaiting() {
  const { data, update } = useQ22();

  const handleNotCollectedChange = (field: "selected" | "maxHours", value: string | boolean) => {
    update({
      waitingNotCollected: { ...data.waitingNotCollected, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問22 指定時間前の待機時間</h3>
        <p className="text-sm text-blue-100 mt-1">
          【指定時間前の待機時間】貨物取卸しに指定時間がある場合、到着から取卸し開始までの待機時間が発生することがありますか。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* 発生するが収受できていない */}
        <div className={`p-3 rounded-lg border ${data.waitingNotCollected.selected ? "bg-orange-50 border-orange-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.waitingNotCollected.selected}
              onChange={(e) => handleNotCollectedChange("selected", e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="font-medium text-orange-700">
              指定時間前の待機が発生するが、収受できていない
            </span>
          </label>
          {data.waitingNotCollected.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 1年以内最長で約</span>
              <input
                type="text"
                value={data.waitingNotCollected.maxHours}
                onChange={(e) => handleNotCollectedChange("maxHours", e.target.value)}
                className={`w-20 px-2 py-1 border border-gray-300 rounded text-right ${data.waitingNotCollected.maxHours ? "input-filled" : "flash-green"}`}
              />
              <span className="text-gray-600">時間</span>
            </div>
          )}
        </div>

        {/* 発生し収受している */}
        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.waitingCollected ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.waitingCollected}
            onChange={(e) => update({ waitingCollected: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">指定時間前の待機が発生し、待機時間料を収受している</span>
        </label>

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

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
