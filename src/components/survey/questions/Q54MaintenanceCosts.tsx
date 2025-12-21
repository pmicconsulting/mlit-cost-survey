"use client";

import { useQ54 } from "../SurveyContext";

export function Q54MaintenanceCosts() {
  const { data, update } = useQ54();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問54 車検・修理費用</h3>
        <p className="text-sm text-purple-100 mt-1">
          【年間】この車両の車検整備費用、定期点検・一般修理費等をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              車検整備費用
              <span className="text-xs text-gray-500 block">（年額相当）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.inspectionCost}
                onChange={(e) => update({ inspectionCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.inspectionCost ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">円/年</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              定期点検・一般修理費用
              <span className="text-xs text-gray-500 block">（年額）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.maintenanceCost}
                onChange={(e) => update({ maintenanceCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.maintenanceCost ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">円/年</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
