"use client";

import { useQ32 } from "../SurveyContext";
import { CANCELLATION_TIMINGS, CancellationRow } from "../types";

export function Q32CancellationFees() {
  const { data, update } = useQ32();

  const handleRowChange = (
    timingId: string,
    field: keyof CancellationRow,
    value: string | boolean
  ) => {
    update({
      rows: {
        ...data.rows,
        [timingId]: { ...data.rows[timingId], [field]: value },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問32 キャンセル料の収受</h3>
        <p className="text-sm text-blue-100 mt-1">
          キャンセル料について、ご回答ください。
        </p>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 text-left font-medium w-40">
                キャンセル時期
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-24">
                定額
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-28">
                金額（円）
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-24">
                運賃比率
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-24">
                比率（%）
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-28">
                頻度（%）
              </th>
            </tr>
          </thead>
          <tbody>
            {CANCELLATION_TIMINGS.map((timing) => {
              const row = data.rows[timing.id];
              return (
                <tr key={timing.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 text-gray-700">
                    {timing.label}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={row?.useFixedAmount ?? false}
                      onChange={(e) => handleRowChange(timing.id, "useFixedAmount", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-1 py-1">
                    <input
                      type="text"
                      value={row?.fixedAmount ?? ""}
                      onChange={(e) => handleRowChange(timing.id, "fixedAmount", e.target.value)}
                      disabled={!row?.useFixedAmount}
                      className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFixedAmount ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={row?.useFareRatio ?? false}
                      onChange={(e) => handleRowChange(timing.id, "useFareRatio", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-1 py-1">
                    <input
                      type="text"
                      value={row?.fareRatio ?? ""}
                      onChange={(e) => handleRowChange(timing.id, "fareRatio", e.target.value)}
                      disabled={!row?.useFareRatio}
                      className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFareRatio ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                    />
                  </td>
                  <td className="border border-gray-300 px-1 py-1">
                    <input
                      type="text"
                      value={row?.frequency ?? ""}
                      onChange={(e) => handleRowChange(timing.id, "frequency", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-right"
                      placeholder=""
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-3 text-xs text-gray-500">
          ※ 定額または運賃比率のいずれか、または両方を選択してください
        </p>
      </div>
    </div>
  );
}
