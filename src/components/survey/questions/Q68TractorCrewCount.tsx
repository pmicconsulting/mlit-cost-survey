"use client";

import { useQ68 } from "../SurveyContext";

export function Q68TractorCrewCount() {
  const { data, update } = useQ68();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問68 乗務人数</h3>
        <p className="text-sm text-orange-100 mt-1">
          この車両には、１日当たり何名の運転者が乗務しますか。（二交代→2名・三交代→3名）
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.averageCrewCount}
            onChange={(e) => update({ averageCrewCount: e.target.value })}
            placeholder=""
            className={`w-24 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.averageCrewCount ? 'input-filled' : 'flash-pink'}`}
          />
          <span className="text-gray-600">人</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※ 2人乗務の場合は「2」とご記入ください
        </p>
      </div>
    </div>
  );
}
