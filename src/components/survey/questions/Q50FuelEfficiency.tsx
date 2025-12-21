"use client";

import { useQ50 } from "../SurveyContext";

export function Q50FuelEfficiency() {
  const { data, update } = useQ50();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問50 平均燃費</h3>
        <p className="text-sm text-purple-100 mt-1">
          【年間】この車両の平均的な燃費をご記入ください。
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.fuelEfficiency}
            onChange={(e) => update({ fuelEfficiency: e.target.value })}
            placeholder=""
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="text-gray-600">km/L</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※ 積載時・空車時を通じた平均値でお答えください
        </p>
      </div>
    </div>
  );
}
