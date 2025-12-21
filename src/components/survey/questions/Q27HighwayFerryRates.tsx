"use client";

import { useQ27 } from "../SurveyContext";

export function Q27HighwayFerryRates() {
  const { data, update } = useQ27();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問27 高速道路・フェリー利用料金の収受率</h3>
        <p className="text-sm text-blue-100 mt-1">
          高速道路やフェリーを利用した場合、当該利用料金を実質的に収受している割合をご回答ください（運賃に含められている場合を含めます）。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 w-48">高速道路利用料金の収受率</label>
          <input
            type="text"
            value={data.highwayRate}
            onChange={(e) => update({ highwayRate: e.target.value })}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
            placeholder=""
          />
          <span className="text-gray-600">%</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 w-48">フェリー利用料金の収受率</label>
          <input
            type="text"
            value={data.ferryRate}
            onChange={(e) => update({ ferryRate: e.target.value })}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
            placeholder=""
          />
          <span className="text-gray-600">%</span>
        </div>

        <p className="text-xs text-gray-500">
          ※ 利用がない場合は空欄で構いません。100%の場合は「100」とご記入ください。
        </p>
      </div>
    </div>
  );
}
