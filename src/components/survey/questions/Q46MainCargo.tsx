"use client";

import { useQ46 } from "../SurveyContext";

export function Q46MainCargo() {
  const { data, update } = useQ46();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問46 主な輸送品</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象車両で主に輸送している品目をご記入ください。
        </p>
      </div>

      <div className="p-4">
        <input
          type="text"
          value={data.mainCargo}
          onChange={(e) => update({ mainCargo: e.target.value })}
          placeholder="例：食品、日用品、機械部品など"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
