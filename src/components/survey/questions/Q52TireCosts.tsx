"use client";

import { useQ52 } from "../SurveyContext";

export function Q52TireCosts() {
  const { data, update } = useQ52();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問52 タイヤ関連費用</h3>
        <p className="text-sm text-purple-100 mt-1">
          【年間】この車両のタイヤ単価、必要本数、交換工賃等をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              タイヤ単価
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.tireUnitPrice}
                onChange={(e) => update({ tireUnitPrice: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.tireUnitPrice ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">円/本</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              タイヤの必要本数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.tireCount}
                onChange={(e) => update({ tireCount: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.tireCount ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">本/両</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              タイヤ交換の工賃
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.tireChangeLaborCost}
                onChange={(e) => update({ tireChangeLaborCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.tireChangeLaborCost ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">円/回</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              タイヤ1交換当たり走行距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.tireChangeDistance}
                onChange={(e) => update({ tireChangeDistance: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.tireChangeDistance ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-12">km/回</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
