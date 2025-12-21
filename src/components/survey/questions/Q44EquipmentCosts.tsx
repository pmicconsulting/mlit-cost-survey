"use client";

import { useQ44 } from "../SurveyContext";

export function Q44EquipmentCosts() {
  const { data, update } = useQ44();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問44 車両付属備品等の費用</h3>
        <p className="text-sm text-purple-100 mt-1">
          車両の付属備品等の費用のうち輸送の安全確保のために必要な経費をご記入ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              車両の付属備品等の費用
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.accessoryCost}
                onChange={(e) => update({ accessoryCost: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.accessoryCost ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">万円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              運行記録計（デジタコ）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.digitalTacho}
                onChange={(e) => update({ digitalTacho: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.digitalTacho ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">万円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ドライブレコーダー
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.driveRecorder}
                onChange={(e) => update({ driveRecorder: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.driveRecorder ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">万円</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ASV（先進安全自動車）装置
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.asv}
                onChange={(e) => update({ asv: e.target.value })}
                placeholder=""
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.asv ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600 w-12">万円</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              上記以外で輸送の安全確保のために必要な経費
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.otherSafetyCost}
                onChange={(e) => update({ otherSafetyCost: e.target.value })}
                placeholder=""
                className={`w-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent ${data.otherSafetyCost ? 'input-filled' : 'flash-pink'}`}
              />
              <span className="text-gray-600">万円</span>
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
