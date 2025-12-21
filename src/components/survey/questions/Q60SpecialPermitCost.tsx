"use client";

import { useQ60 } from "../SurveyContext";

export function Q60SpecialPermitCost() {
  const { data, update } = useQ60();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問60 特殊車両通行許可費用</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象車両の特殊車両通行許可申請の費用をご記入ください。
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
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
