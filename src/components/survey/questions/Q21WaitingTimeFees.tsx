"use client";

import { useQ21 } from "../SurveyContext";

export function Q21WaitingTimeFees() {
  const { data, update } = useQ21();

  const handleSeparateChange = (field: "selected" | "hourlyRate", value: string | boolean) => {
    update({
      separateCollection: { ...data.separateCollection, [field]: value },
    });
  };

  const handleIncludedChange = (field: "selected" | "hourlyRate", value: string | boolean) => {
    update({
      includedInFare: { ...data.includedInFare, [field]: value },
    });
  };

  const handleNotCollectedChange = (field: "selected" | "lossAmount", value: string | boolean) => {
    update({
      notCollected: { ...data.notCollected, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問21 荷待ち等の待機時間料</h3>
        <p className="text-sm text-blue-100 mt-1">
          荷待ち等の待機時間料を収受できていますか。（荷主等の責任に基づく時間に限定し、指定時間よりも早めに到着した場合の待機時間は対象としません。）
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* 別建てで収受 */}
        <div className={`p-3 rounded-lg border ${data.separateCollection.selected ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.separateCollection.selected}
              onChange={(e) => handleSeparateChange("selected", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">待機時間料として別建てで収受している</span>
          </label>
          {data.separateCollection.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 1時間当たり収受額：</span>
              <input
                type="text"
                value={data.separateCollection.hourlyRate}
                onChange={(e) => handleSeparateChange("hourlyRate", e.target.value)}
                className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data.separateCollection.hourlyRate ? "input-filled" : "flash-green"}`}
              />
              <span className="text-gray-600">円（税込）</span>
            </div>
          )}
        </div>

        {/* 運賃に含めて収受 */}
        <div className={`p-3 rounded-lg border ${data.includedInFare.selected ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includedInFare.selected}
              onChange={(e) => handleIncludedChange("selected", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">運賃に含めて収受している（一定時間分を反映）</span>
          </label>
          {data.includedInFare.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 1時間当たり換算額：</span>
              <input
                type="text"
                value={data.includedInFare.hourlyRate}
                onChange={(e) => handleIncludedChange("hourlyRate", e.target.value)}
                className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data.includedInFare.hourlyRate ? "input-filled" : "flash-green"}`}
              />
              <span className="text-gray-600">円（税込）</span>
            </div>
          )}
        </div>

        {/* 実質的に収受できていない */}
        <div className={`p-3 rounded-lg border ${data.notCollected.selected ? "bg-orange-50 border-orange-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.notCollected.selected}
              onChange={(e) => handleNotCollectedChange("selected", e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="font-medium text-orange-700">実質的に収受できていない</span>
          </label>
          {data.notCollected.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 損失額（年間推計）：</span>
              <input
                type="text"
                value={data.notCollected.lossAmount}
                onChange={(e) => handleNotCollectedChange("lossAmount", e.target.value)}
                className={`w-28 px-2 py-1 border border-gray-300 rounded text-right ${data.notCollected.lossAmount ? "input-filled" : "flash-green"}`}
              />
              <span className="text-gray-600">千円</span>
            </div>
          )}
        </div>

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
