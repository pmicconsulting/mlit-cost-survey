"use client";

import { useQ58 } from "../SurveyContext";

export function Q58AveragePerOperation() {
  const { data, update } = useQ58();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問58 1運行当たり平均</h3>
        <p className="text-sm text-purple-100 mt-1">
          この車両の【１運行】当たりの平均的な輸送距離（片道）、ラウンド回数（輸送回数）をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              1運行の平均輸送距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.averageTransportDistance}
                onChange={(e) => update({ averageTransportDistance: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">km</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              1日当たりの平均ラウンド回数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.averageRoundCount}
                onChange={(e) => update({ averageRoundCount: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">回/日</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ ラウンドとは、車庫を出発してから帰着するまでの1サイクルを指します
        </p>
      </div>
    </div>
  );
}
