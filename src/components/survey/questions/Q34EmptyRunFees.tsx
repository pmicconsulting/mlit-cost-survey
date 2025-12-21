"use client";

import { useQ34 } from "../SurveyContext";

export function Q34EmptyRunFees() {
  const { data, update } = useQ34();

  const handleMethodChange = (
    method: "hourly" | "distance" | "fareRatio",
    field: "selected" | "rate" | "ratio",
    value: string | boolean
  ) => {
    update({
      calculationMethods: {
        ...data.calculationMethods,
        [method]: { ...data.calculationMethods[method], [field]: value },
      },
    });
  };

  const handleOtherChange = (field: "selected" | "description", value: string | boolean) => {
    update({
      other: { ...data.other, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問34 空車走行回送料金</h3>
        <p className="text-sm text-blue-100 mt-1">
          復荷（帰り荷）がなく、復路等を「空車走行」する場合、空車の移動費用（回送料金）の収受状況、計算方法をご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* 収受している */}
        <div className={`p-3 rounded-lg border ${data.isCollecting ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isCollecting}
              onChange={(e) => update({ isCollecting: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">空車走行回送料金を収受している</span>
          </label>

          {data.isCollecting && (
            <div className="mt-4 ml-8 space-y-3">
              {/* 所要時間から計算 */}
              <div className={`p-2 rounded border ${data.calculationMethods.hourly.selected ? "bg-white border-blue-200" : "border-gray-200"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.calculationMethods.hourly.selected}
                    onChange={(e) => handleMethodChange("hourly", "selected", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">所要時間から計算</span>
                  {data.calculationMethods.hourly.selected && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="text"
                        value={data.calculationMethods.hourly.rate}
                        onChange={(e) => handleMethodChange("hourly", "rate", e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-green"
                      />
                      <span className="text-gray-600 text-sm">円/時間</span>
                    </div>
                  )}
                </label>
              </div>

              {/* 走行距離から計算 */}
              <div className={`p-2 rounded border ${data.calculationMethods.distance.selected ? "bg-white border-blue-200" : "border-gray-200"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.calculationMethods.distance.selected}
                    onChange={(e) => handleMethodChange("distance", "selected", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">走行距離から計算</span>
                  {data.calculationMethods.distance.selected && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="text"
                        value={data.calculationMethods.distance.rate}
                        onChange={(e) => handleMethodChange("distance", "rate", e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-green"
                      />
                      <span className="text-gray-600 text-sm">円/km</span>
                    </div>
                  )}
                </label>
              </div>

              {/* 往路運賃比率 */}
              <div className={`p-2 rounded border ${data.calculationMethods.fareRatio.selected ? "bg-white border-blue-200" : "border-gray-200"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.calculationMethods.fareRatio.selected}
                    onChange={(e) => handleMethodChange("fareRatio", "selected", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">往路運賃に対する比率</span>
                  {data.calculationMethods.fareRatio.selected && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="text"
                        value={data.calculationMethods.fareRatio.ratio}
                        onChange={(e) => handleMethodChange("fareRatio", "ratio", e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-right flash-green"
                      />
                      <span className="text-gray-600 text-sm">割</span>
                    </div>
                  )}
                </label>
              </div>

              {/* その他 */}
              <div className={`p-2 rounded border ${data.other.selected ? "bg-white border-blue-200" : "border-gray-200"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.other.selected}
                    onChange={(e) => handleOtherChange("selected", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">その他</span>
                </label>
                {data.other.selected && (
                  <input
                    type="text"
                    value={data.other.description}
                    onChange={(e) => handleOtherChange("description", e.target.value)}
                    placeholder="具体的にご記入ください"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded flash-green"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 収受していない */}
        <label className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${data.notCollected ? "bg-orange-50 border-orange-200" : "border-gray-200 hover:bg-gray-50"}`}>
          <input
            type="checkbox"
            checked={data.notCollected}
            onChange={(e) => update({ notCollected: e.target.checked })}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <span className="text-orange-700">空車走行回送料金を収受していない</span>
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
      </div>
    </div>
  );
}
