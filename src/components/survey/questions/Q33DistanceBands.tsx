"use client";

import { useQ33 } from "../SurveyContext";
import { DISTANCE_BANDS, DistanceBandRow } from "../types";

export function Q33DistanceBands() {
  const { data, update } = useQ33();

  const handleRowChange = (
    bandId: string,
    field: keyof DistanceBandRow,
    value: string
  ) => {
    update({
      rows: {
        ...data.rows,
        [bandId]: { ...data.rows[bandId], [field]: value },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問33 運行距離帯別の状況</h3>
        <p className="text-sm text-blue-100 mt-1">
          距離帯別の平均運行距離、復荷確保割合、復荷運賃水準についてご回答ください。
        </p>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-medium">
                距離帯
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium">
                平均運行距離（km）
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium">
                復荷確保割合（割）
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium">
                復荷運賃水準（割）
              </th>
            </tr>
          </thead>
          <tbody>
            {DISTANCE_BANDS.map((band) => {
              const row = data.rows[band.id];
              return (
                <tr key={band.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">
                    <div className="font-medium text-gray-700">{band.label}</div>
                    <div className="text-xs text-gray-500">{band.subLabel}</div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={row?.averageDistance ?? ""}
                      onChange={(e) => handleRowChange(band.id, "averageDistance", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-right"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={row?.returnLoadRatio ?? ""}
                      onChange={(e) => handleRowChange(band.id, "returnLoadRatio", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-right"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={row?.returnFareRatio ?? ""}
                      onChange={(e) => handleRowChange(band.id, "returnFareRatio", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-right"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-3 text-xs text-gray-500">
          ※ 復荷確保割合・復荷運賃水準は1割～10割でご記入ください
        </p>
      </div>
    </div>
  );
}
