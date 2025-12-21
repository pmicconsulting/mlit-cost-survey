"use client";

import { useQ48 } from "../SurveyContext";

export function Q48Taxes() {
  const { data, update } = useQ48();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問48 税金</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象車両に係る年間の税金をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              環境性能割
              <span className="text-xs text-gray-500 block">（旧・自動車取得税）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.environmentTax}
                onChange={(e) => update({ environmentTax: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              自動車税
              <span className="text-xs text-gray-500 block">（年額）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.vehicleTax}
                onChange={(e) => update({ vehicleTax: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              自動車重量税
              <span className="text-xs text-gray-500 block">（年額）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.weightTax}
                onChange={(e) => update({ weightTax: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ 環境性能割は取得時のみ発生します。発生していない場合は空欄で構いません。
        </p>
      </div>
    </div>
  );
}
