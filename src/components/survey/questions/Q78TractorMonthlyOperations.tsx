"use client";

import { useQ78 } from "../SurveyContext";

export function Q78TractorMonthlyOperations() {
  const { data, update } = useQ78();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問78 月間運行データ</h3>
        <p className="text-sm text-orange-100 mt-1">
          対象トラクターの月間の運行データをご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              平均積載率
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.loadRate}
                onChange={(e) => update({ loadRate: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">%/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              平均総走行距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.totalDistance}
                onChange={(e) => update({ totalDistance: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">km/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              平均実車距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.actualDistance}
                onChange={(e) => update({ actualDistance: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">km/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              平均実働日数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.workingDays}
                onChange={(e) => update({ workingDays: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">日/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              平均輸送トン数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.transportTonnage}
                onChange={(e) => update({ transportTonnage: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">トン/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              1日平均実働時間
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.dailyWorkingHours}
                onChange={(e) => update({ dailyWorkingHours: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">時間/日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
