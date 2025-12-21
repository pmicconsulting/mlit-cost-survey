"use client";

import { useQ18 } from "../SurveyContext";

export function Q18LoadingUnloadingFees() {
  const { data, update } = useQ18();

  const handleManualWorkChange = (field: "selected" | "hourlyRate", value: string | boolean) => {
    update({
      manualWork: { ...data.manualWork, [field]: value },
    });
  };

  const handleMechanicalWorkChange = (field: "selected" | "hourlyRate", value: string | boolean) => {
    update({
      mechanicalWork: { ...data.mechanicalWork, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問18 積込・取卸作業料の収受実態</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* 手荷役作業 */}
        <div className={`p-3 rounded-lg border ${data.manualWork.selected ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.manualWork.selected}
              onChange={(e) => handleManualWorkChange("selected", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">主に手荷役作業</span>
          </label>
          {data.manualWork.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 1時間当たり収受額：</span>
              <input
                type="text"
                value={data.manualWork.hourlyRate}
                onChange={(e) => handleManualWorkChange("hourlyRate", e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
              />
              <span className="text-gray-600">円（税込）</span>
            </div>
          )}
        </div>

        {/* フォーク・クレーン作業 */}
        <div className={`p-3 rounded-lg border ${data.mechanicalWork.selected ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.mechanicalWork.selected}
              onChange={(e) => handleMechanicalWorkChange("selected", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">主にフォークリフト、クレーン等作業</span>
          </label>
          {data.mechanicalWork.selected && (
            <div className="mt-3 ml-8 flex items-center gap-2">
              <span className="text-gray-600">→ 1時間当たり収受額：</span>
              <input
                type="text"
                value={data.mechanicalWork.hourlyRate}
                onChange={(e) => handleMechanicalWorkChange("hourlyRate", e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
              />
              <span className="text-gray-600">円（税込）</span>
            </div>
          )}
        </div>

        {/* その他の選択肢 */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={data.notCollectedIncluded}
              onChange={(e) => update({ notCollectedIncluded: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">積込・取卸作業料金として収受していない（運賃に含められている）</span>
          </label>

          <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={data.notCollectedActually}
              onChange={(e) => update({ notCollectedActually: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">積込・取卸作業料金を実質的に収受できていない</span>
          </label>

          <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={data.notPerforming}
              onChange={(e) => update({ notPerforming: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">積込・取卸作業を自社で行っていない</span>
          </label>
        </div>

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
