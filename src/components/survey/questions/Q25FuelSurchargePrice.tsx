"use client";

import { useQ25 } from "../SurveyContext";

export function Q25FuelSurchargePrice() {
  const { data, update } = useQ25();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問25 燃料サーチャージ基準価格</h3>
        <p className="text-sm text-blue-100 mt-1">
          燃料サーチャージを導入している場合の基準価格と購入価格をご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 w-40">燃料サーチャージ基準価格</label>
          <input
            type="text"
            value={data.basePrice}
            onChange={(e) => update({ basePrice: e.target.value })}
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-right"
            placeholder=""
          />
          <span className="text-gray-600">円/L</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 w-40">軽油購入価格（税込）</label>
          <input
            type="text"
            value={data.purchasePrice}
            onChange={(e) => update({ purchasePrice: e.target.value })}
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-right"
            placeholder=""
          />
          <span className="text-gray-600">円/L</span>
        </div>

        <p className="text-xs text-gray-500">
          ※ 燃料サーチャージを導入していない場合は未記入で構いません
        </p>
      </div>
    </div>
  );
}
