"use client";

import { useQ41 } from "../SurveyContext";

export function Q41VehicleSpecs() {
  const { data, update } = useQ41();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問41 車両の形状等</h3>
        <p className="text-sm text-purple-100 mt-1">
          記入する車両の形状等についてご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* 所属営業所名 */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            所属営業所名
          </label>
          <input
            type="text"
            value={data.officeName}
            onChange={(e) => update({ officeName: e.target.value })}
            placeholder="例：東京営業所"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.officeName ? 'input-filled' : 'flash-green'}`}
          />
        </div>

        {/* 車両諸元 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              最大積載量
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.maxLoadCapacity}
                onChange={(e) => update({ maxLoadCapacity: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.maxLoadCapacity ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">トン</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              車両総重量
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.grossVehicleWeight}
                onChange={(e) => update({ grossVehicleWeight: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.grossVehicleWeight ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">トン</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              排気量
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.displacement}
                onChange={(e) => update({ displacement: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.displacement ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">リットル</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              軸数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.axleCount}
                onChange={(e) => update({ axleCount: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.axleCount ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">本</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              新規登録年
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.registrationYear}
                onChange={(e) => update({ registrationYear: e.target.value })}
                placeholder="例：2020"
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.registrationYear ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">年</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              使用予定年数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.plannedUsageYears}
                onChange={(e) => update({ plannedUsageYears: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.plannedUsageYears ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">年</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
