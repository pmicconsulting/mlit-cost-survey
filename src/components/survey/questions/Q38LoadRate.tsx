"use client";

import { useQ38 } from "../SurveyContext";

export function Q38LoadRate() {
  const { data, update } = useQ38();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問38 個建運賃の積載率と主な輸送品</h3>
        <p className="text-sm text-blue-100 mt-1">
          個建運賃における、【年間】「平均積載率」と「その主な輸送品」をご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 w-32">平均積載率</label>
          <input
            type="text"
            value={data.averageLoadRate}
            onChange={(e) => update({ averageLoadRate: e.target.value })}
            className={`w-24 px-3 py-2 border border-gray-300 rounded-lg text-right ${data.averageLoadRate ? 'input-filled' : 'flash-pink'}`}
            placeholder=""
          />
          <span className="text-gray-600">%</span>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">主な輸送品目</label>
          <input
            type="text"
            value={data.mainCargoItems}
            onChange={(e) => update({ mainCargoItems: e.target.value })}
            placeholder="例：食品、日用品、機械部品など"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${data.mainCargoItems ? 'input-filled' : 'flash-pink'}`}
          />
        </div>

        <p className="text-xs text-gray-500">
          ※ 個建運賃での輸送を行っていない場合は空欄で構いません
        </p>
      </div>
    </div>
  );
}
