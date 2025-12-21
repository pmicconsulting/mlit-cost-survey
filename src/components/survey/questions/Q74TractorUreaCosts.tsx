"use client";

import { useQ74 } from "../SurveyContext";

export function Q74TractorUreaCosts() {
  const { data, update } = useQ74();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問74 尿素水（AdBlue等）費用</h3>
        <p className="text-sm text-orange-100 mt-1">
          対象トラクターの尿素水関連費用をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              尿素水の単価
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.ureaUnitPrice}
                onChange={(e) => update({ ureaUnitPrice: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円/L</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              1リットル当たり走行可能距離
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.ureaDistancePerLiter}
                onChange={(e) => update({ ureaDistancePerLiter: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">km/L</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ 尿素水を使用しない車両の場合は空欄で構いません
        </p>
      </div>
    </div>
  );
}
