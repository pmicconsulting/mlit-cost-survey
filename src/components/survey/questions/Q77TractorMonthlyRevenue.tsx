"use client";

import { useQ77 } from "../SurveyContext";

export function Q77TractorMonthlyRevenue() {
  const { data, update } = useQ77();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問77 月間収入・料金</h3>
        <p className="text-sm text-orange-100 mt-1">
          【月間】この車両における収入額（運賃+作業料金、待機料金等）、高速道路料金等の各種料金をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              月間収入額
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.monthlyRevenue}
                onChange={(e) => update({ monthlyRevenue: e.target.value })}
                placeholder=""
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600">万円/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              高速道路利用料金
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.highwayFee}
                onChange={(e) => update({ highwayFee: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">万円/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              フェリー利用料金
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.ferryFee}
                onChange={(e) => update({ ferryFee: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">万円/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              中継輸送実施に伴う施設使用料
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.relayFacilityFee}
                onChange={(e) => update({ relayFacilityFee: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">万円/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              その他料金
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.otherFee}
                onChange={(e) => update({ otherFee: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-16">万円/月</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
