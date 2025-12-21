"use client";

import { useQ55 } from "../SurveyContext";

export function Q55CargoHandlingSupplies() {
  const { data, update } = useQ55();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問55 荷役関連経費</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象車両に係る荷役関連の経費をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              荷役関連の消耗品
              <span className="text-xs text-gray-500 block">（ロープ、シート等）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.cargoHandlingSupplies}
                onChange={(e) => update({ cargoHandlingSupplies: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円/年</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              荷役作業時の昇降設備
              <span className="text-xs text-gray-500 block">（テールゲートリフター等）</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.liftingEquipment}
                onChange={(e) => update({ liftingEquipment: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円/台</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              保護帽（ヘルメット）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.helmet}
                onChange={(e) => update({ helmet: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円/個</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              作業服・安全靴等
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.safetyClothing}
                onChange={(e) => update({ safetyClothing: e.target.value })}
                placeholder=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-600 w-12">円/人</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ 該当しない項目は空欄で構いません
        </p>
      </div>
    </div>
  );
}
