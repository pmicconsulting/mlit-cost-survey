"use client";

import { useQ70 } from "../SurveyContext";

export function Q70TractorInsurance() {
  const { data, update } = useQ70();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問70 保険料</h3>
        <p className="text-sm text-orange-100 mt-1">
          対象トラクターに係る年間の保険料をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              自賠責保険料
              <span className="text-xs text-gray-500 block">（年額相当）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.compulsoryInsurance}
                onChange={(e) => update({ compulsoryInsurance: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              任意保険料
              <span className="text-xs text-gray-500 block">（年額）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.voluntaryInsurance}
                onChange={(e) => update({ voluntaryInsurance: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
