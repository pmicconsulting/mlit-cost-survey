"use client";

import { useQ76 } from "../SurveyContext";

export function Q76TractorCargoHandlingSupplies() {
  const { data, update } = useQ76();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問76 荷役関連経費</h3>
        <p className="text-sm text-orange-100 mt-1">
          【年間】この車両に必要な荷役関連の経費（税込・平均）について、ご記入ください。
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
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.cargoHandlingSupplies ? 'input-filled' : 'flash-pink'}`}
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
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.liftingEquipment ? 'input-filled' : 'flash-pink'}`}
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
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.helmet ? 'input-filled' : 'flash-pink'}`}
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
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.safetyClothing ? 'input-filled' : 'flash-pink'}`}
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
