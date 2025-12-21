"use client";

import { useQ42, useQ43 } from "../SurveyContext";
import { VehicleCondition } from "../types";

const CONDITION_OPTIONS: { id: VehicleCondition; label: string }[] = [
  { id: "new", label: "新車" },
  { id: "used", label: "中古車" },
];

export function Q43ProcurementDetails() {
  const { data: q42Data } = useQ42();
  const { data, update } = useQ43();

  const updatePurchase = (field: string, value: string) => {
    update({
      purchase: { ...data.purchase, [field]: value },
    });
  };

  const updateLease = (field: string, value: string) => {
    update({
      lease: { ...data.lease, [field]: value },
    });
  };

  if (q42Data.method === "") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問43 調達詳細</h3>
        <p className="text-sm text-purple-100 mt-1">
          {q42Data.method === "purchase" && "購入に関する詳細をご記入ください。"}
          {q42Data.method === "lease" && "リースに関する詳細をご記入ください。"}
          {q42Data.method === "other" && "調達方法の詳細をご記入ください。"}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* 購入の場合 */}
        {q42Data.method === "purchase" && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                新車・中古車の区分
              </label>
              <div className="flex gap-4">
                {CONDITION_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg border ${
                      data.purchase.condition === option.id
                        ? "bg-purple-50 border-purple-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="purchaseCondition"
                      value={option.id}
                      checked={data.purchase.condition === option.id}
                      onChange={() => updatePurchase("condition", option.id)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                車両本体購入価格（税込）
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.purchase.price}
                  onChange={(e) => updatePurchase("price", e.target.value)}
                  placeholder=""
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="text-gray-600">万円</span>
              </div>
            </div>
          </>
        )}

        {/* リースの場合 */}
        {q42Data.method === "lease" && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                新車・中古車の区分
              </label>
              <div className="flex gap-4">
                {CONDITION_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg border ${
                      data.lease.condition === option.id
                        ? "bg-purple-50 border-purple-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="leaseCondition"
                      value={option.id}
                      checked={data.lease.condition === option.id}
                      onChange={() => updateLease("condition", option.id)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  車両本体価格
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.lease.price}
                    onChange={(e) => updateLease("price", e.target.value)}
                    placeholder=""
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-600 w-12">万円</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  平均月額リース料金
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.lease.monthlyFee}
                    onChange={(e) => updateLease("monthlyFee", e.target.value)}
                    placeholder=""
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-600 w-12">円</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  契約期間
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.lease.contractYears}
                    onChange={(e) => updateLease("contractYears", e.target.value)}
                    placeholder=""
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">年</span>
                  <input
                    type="text"
                    value={data.lease.contractMonths}
                    onChange={(e) => updateLease("contractMonths", e.target.value)}
                    placeholder=""
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">ヶ月</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  契約終了時買取価格
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.lease.buyoutPrice}
                    onChange={(e) => updateLease("buyoutPrice", e.target.value)}
                    placeholder=""
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-600 w-12">万円</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* その他の場合 */}
        {q42Data.method === "other" && (
          <p className="text-gray-600">
            その他の調達方法の場合は、次の設問にお進みください。
          </p>
        )}
      </div>
    </div>
  );
}
