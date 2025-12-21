"use client";

import { useQ72 } from "../SurveyContext";

export function Q72TractorOilCosts() {
  const { data, update } = useQ72();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問72 オイル関連費用</h3>
        <p className="text-sm text-orange-100 mt-1">
          【年間】この車両のオイル単価、オイル交換量、オイル交換１回当たりの走行距離、工賃等をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              オイル単価
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.oilUnitPrice}
                onChange={(e) => update({ oilUnitPrice: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.oilUnitPrice ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">円/L</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              オイル交換量
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.oilChangeVolume}
                onChange={(e) => update({ oilChangeVolume: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.oilChangeVolume ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">L/回</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              オイル交換1回当たり走行距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.oilChangeDistance}
                onChange={(e) => update({ oilChangeDistance: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.oilChangeDistance ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">km</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              オイル交換の工賃
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.oilChangeLaborCost}
                onChange={(e) => update({ oilChangeLaborCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.oilChangeLaborCost ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">円/回</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
