"use client";

import { useQ39 } from "../SurveyContext";
import { TransportDetailRow, VehicleSizeSelection } from "../types";

const VEHICLE_SIZE_OPTIONS: { value: VehicleSizeSelection; label: string }[] = [
  { value: "", label: "選択してください" },
  { value: "small", label: "小型車（2t）" },
  { value: "medium", label: "中型車（4t）" },
  { value: "large", label: "大型車（10t）" },
  { value: "trailer", label: "トレーラ" },
];

export function Q39TransportDetails() {
  const { data, update } = useQ39();

  const handleRowChange = (
    index: number,
    field: keyof TransportDetailRow,
    value: string
  ) => {
    const newRows = [...data.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    update({ rows: newRows });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問39 主な輸送の詳細</h3>
        <p className="text-sm text-blue-100 mt-1">
          主な輸送について、実車距離、平均拘束時間、平均運賃額、平均料金額をご回答ください。（平均料金額は作業料、待機時間料、割増料等とします）
        </p>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-8">
                No.
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-36">
                車両サイズ
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-28">
                実車距離(km)
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium" colSpan={2}>
                平均拘束時間
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-32">
                平均運賃額(円)
              </th>
              <th className="border border-gray-300 px-2 py-2 text-center font-medium w-32">
                平均料金額(円)
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300"></th>
              <th className="border border-gray-300"></th>
              <th className="border border-gray-300"></th>
              <th className="border border-gray-300 px-2 py-1 text-center font-normal text-xs text-gray-500 w-20">
                時間
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center font-normal text-xs text-gray-500 w-16">
                分
              </th>
              <th className="border border-gray-300"></th>
              <th className="border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-2 text-center text-gray-600">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <select
                    value={row.vehicleSize}
                    onChange={(e) => handleRowChange(index, "vehicleSize", e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded"
                  >
                    {VEHICLE_SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <input
                    type="text"
                    value={row.actualDistance}
                    onChange={(e) => handleRowChange(index, "actualDistance", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row.actualDistance ? 'input-filled' : 'flash-green'}`}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <input
                    type="text"
                    value={row.constraintHours}
                    onChange={(e) => handleRowChange(index, "constraintHours", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row.constraintHours ? 'input-filled' : 'flash-green'}`}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <input
                    type="text"
                    value={row.constraintMinutes}
                    onChange={(e) => handleRowChange(index, "constraintMinutes", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row.constraintMinutes ? 'input-filled' : 'flash-green'}`}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <input
                    type="text"
                    value={row.averageFare}
                    onChange={(e) => handleRowChange(index, "averageFare", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row.averageFare ? 'input-filled' : 'flash-green'}`}
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <input
                    type="text"
                    value={row.averageFee}
                    onChange={(e) => handleRowChange(index, "averageFee", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row.averageFee ? 'input-filled' : 'flash-green'}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-3 text-xs text-gray-500">
          ※ 運賃額：基本運賃、料金額：附帯作業料・待機時間料等の合計
        </p>
      </div>
    </div>
  );
}
