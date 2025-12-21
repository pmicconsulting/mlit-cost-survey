"use client";

import { useQ81 } from "../SurveyContext";

export function Q81TractorSpecialPermitCost() {
  const { data, update } = useQ81();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問81 特殊車両通行許可費用</h3>
        <p className="text-sm text-orange-100 mt-1">
          【年間】この車両が特殊車両通行許可を得ている場合、平均の申請手数料等をご記入ください。
        </p>
      </div>

      <div className="p-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            特殊車両通行許可申請平均費用
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={data.specialPermitCost}
              onChange={(e) => update({ specialPermitCost: e.target.value })}
              placeholder=""
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-gray-600">円/年</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          ※ 特殊車両通行許可が不要な車両の場合は空欄で構いません
        </p>
      </div>
    </div>
  );
}
