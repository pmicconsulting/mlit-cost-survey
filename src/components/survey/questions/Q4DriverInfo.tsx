"use client";

import { Users } from "lucide-react";
import { useQ4 } from "../SurveyContext";
import { DRIVER_CATEGORIES, DRIVER_METRICS, DriverCategoryId, DriverMetricId, DriverMetrics } from "../types";

interface Q4DriverInfoProps {
  className?: string;
}

export function Q4DriverInfo({ className = "" }: Q4DriverInfoProps) {
  const { data, update } = useQ4();

  // 運転者数入力
  const handleDriverCountChange = (categoryId: DriverCategoryId, value: string) => {
    update({
      driverCount: { ...data.driverCount, [categoryId]: value },
    });
  };

  // 指標入力
  const handleMetricChange = (categoryId: DriverCategoryId, metricId: DriverMetricId, value: string) => {
    update({
      drivers: {
        ...data.drivers,
        [categoryId]: {
          ...data.drivers[categoryId],
          [metricId]: value,
        },
      },
    });
  };

  // 合計計算
  const totalDrivers = Object.values(data.driverCount).reduce(
    (sum, val) => sum + (parseInt(val) || 0),
    0
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問4</h2>
          <p className="text-slate-600 text-sm">
            【全ての営業所】における「運転者」について、以下ご記入ください。
          </p>
        </div>
      </div>

      {/* 統合マトリクステーブル */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700">
                1ヶ月合計
              </th>
              {DRIVER_CATEGORIES.map((cat) => (
                <th key={cat.id} className="border border-slate-300 px-3 py-2 text-center">
                  <div className="text-sm font-medium text-slate-700">{cat.label}</div>
                  {cat.subLabel && <div className="text-xs text-slate-500">{cat.subLabel}</div>}
                </th>
              ))}
              <th className="border border-slate-300 px-3 py-2 text-center">
                <div className="text-sm font-medium text-slate-900">合計</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* 運転者数（1行目） */}
            <tr className="bg-blue-50">
              <td className="border border-slate-300 px-3 py-3 text-sm font-bold text-slate-800 bg-blue-100">
                運転者数
              </td>
              {DRIVER_CATEGORIES.map((cat) => (
                <td key={cat.id} className="border border-slate-300 px-2 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={data.driverCount[cat.id]}
                      onChange={(e) => handleDriverCountChange(cat.id, e.target.value)}
                      className="w-16 px-2 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm bg-white"
                      placeholder="0"
                    />
                    <span className="text-xs text-slate-500">人</span>
                  </div>
                </td>
              ))}
              <td className="border border-slate-300 px-2 py-2 text-center bg-blue-100">
                <div className="text-lg font-bold text-blue-600">{totalDrivers}人</div>
              </td>
            </tr>
            {/* 指標データ */}
            {DRIVER_METRICS.map((metric) => (
              <tr key={metric.id} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-3 py-3 text-sm font-medium text-slate-700 bg-slate-50">
                  {metric.label}
                </td>
                {DRIVER_CATEGORIES.map((cat) => {
                  const hasDrivers = parseInt(data.driverCount[cat.id]) > 0;
                  return (
                    <td
                      key={cat.id}
                      className={`border border-slate-300 px-2 py-2 text-center ${
                        hasDrivers ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={metric.min}
                          max={metric.max}
                          value={data.drivers[cat.id][metric.id as keyof DriverMetrics]}
                          onChange={(e) =>
                            handleMetricChange(cat.id, metric.id as DriverMetricId, e.target.value)
                          }
                          className={`w-16 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                            hasDrivers ? "border-blue-300 bg-white" : "border-slate-300"
                          }`}
                          placeholder="-"
                        />
                        <span className="text-xs text-slate-500 w-8 text-left">{metric.unit}</span>
                      </div>
                    </td>
                  );
                })}
                <td className="border border-slate-300 px-2 py-2 text-center bg-slate-50">
                  {/* 合計列は空欄 */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
        <p>
          ※ 運転者数が入力されている車型のセルがハイライトされます。
          <br />
          ※ 賃金総額には基本給、諸手当（時間外手当を含む）、賞与月割額を含みます。
        </p>
      </div>
    </div>
  );
}
