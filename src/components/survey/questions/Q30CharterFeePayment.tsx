"use client";

import { useQ30 } from "../SurveyContext";

export function Q30CharterFeePayment() {
  const { data, update } = useQ30();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問30 利用運送手数料の請求・支払い</h3>
        <p className="text-sm text-blue-100 mt-1">
          利用運送手数料（傭車手配の手数料）の請求、支払いについてご回答ください。
        </p>
      </div>

      <div className="p-4 space-y-3">
        <label
          className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${
            data.addToShipper ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="checkbox"
            checked={data.addToShipper}
            onChange={(e) => update({ addToShipper: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">主に運賃に加算して荷主等に請求</span>
        </label>

        <label
          className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${
            data.deductFromPartner ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="checkbox"
            checked={data.deductFromPartner}
            onChange={(e) => update({ deductFromPartner: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">主に運賃から差し引いて協力会社等に支払い</span>
        </label>

        <label
          className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${
            data.notPerforming ? "bg-gray-50 border-gray-300" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="checkbox"
            checked={data.notPerforming}
            onChange={(e) => update({ notPerforming: e.target.checked })}
            className="w-5 h-5 text-gray-600 rounded focus:ring-gray-500"
          />
          <span className="text-gray-700">傭車手配を行っていない</span>
        </label>

        <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            checked={data.unknown}
            onChange={(e) => update({ unknown: e.target.checked })}
            className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
          />
          <span className="text-gray-700">把握していない</span>
        </label>

        <p className="text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
