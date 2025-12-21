"use client";

import { useQ80 } from "../SurveyContext";

export function Q80TractorVehicleWashing() {
  const { data, update } = useQ80();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問80 車両洗浄</h3>
        <p className="text-sm text-orange-100 mt-1">
          【月間】この車両を洗浄するための所要時間、費用をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              車両洗浄の所要時間
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.washingTime}
                onChange={(e) => update({ washingTime: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.washingTime ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">時間/月</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              車両洗浄の費用
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.washingCost}
                onChange={(e) => update({ washingCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.washingCost ? 'input-filled' : 'flash-green'}`}
              />
              <span className="text-gray-600 w-16">円/月</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ 洗車機利用料、洗剤代等を含みます
        </p>
      </div>
    </div>
  );
}
