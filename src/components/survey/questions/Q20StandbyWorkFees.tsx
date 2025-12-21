"use client";

import { useQ20 } from "../SurveyContext";
import { Q20Status } from "../types";

const OPTIONS: { value: Q20Status; label: string; hasInput?: boolean }[] = [
  { value: "collecting", label: "積込・取卸時の立会い・積付作業に係る料金を収受", hasInput: true },
  { value: "included_in_fare", label: "運賃に含めて収受（一定時間分を反映）" },
  { value: "not_collected", label: "実質的に収受できていない" },
  { value: "unknown", label: "把握していない" },
];

export function Q20StandbyWorkFees() {
  const { data, update } = useQ20();

  const handleStatusChange = (status: Q20Status) => {
    update({ status, hourlyRate: status === "collecting" ? data.hourlyRate : "" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問20 運転者立会い・積付作業の時間費用</h3>
        <p className="text-sm text-blue-100 mt-1">
          運転者が積込・取卸作業をしない場合（荷主・倉庫業者等が作業する場合）、
          積込・取卸時における「運転者の立会い及び積付作業（養生・固縛等）の時間費用」を収受していますか。
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {OPTIONS.map((option) => (
            <div key={option.value}>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${data.status === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="q20_status"
                  value={option.value}
                  checked={data.status === option.value}
                  onChange={() => handleStatusChange(option.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>

              {/* 条件付き入力欄 */}
              {option.hasInput && data.status === option.value && (
                <div className="ml-10 mt-2 flex items-center gap-2">
                  <span className="text-gray-600">→ 1時間：</span>
                  <input
                    type="text"
                    value={data.hourlyRate}
                    onChange={(e) => update({ hourlyRate: e.target.value })}
                    className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data.hourlyRate ? "input-filled" : "flash-green"}`}
                  />
                  <span className="text-gray-600">円（税込）</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500 text-right">（該当するもの1つ選択）</p>
      </div>
    </div>
  );
}
