"use client";

import { useMemo } from "react";
import { Truck, CheckCircle, AlertTriangle } from "lucide-react";
import { useQ2, useQ3 } from "../SurveyContext";
import { VEHICLE_SIZES, DRYVAN_VEHICLE_TYPES, NON_DRYVAN_VEHICLE_TYPES, VehicleCounts } from "../types";

interface Q3VehicleDetailsProps {
  className?: string;
  showTotalCheck?: boolean;
}

export function Q3VehicleDetails({ className = "", showTotalCheck = true }: Q3VehicleDetailsProps) {
  const { data: q2Data } = useQ2();
  const { data, update } = useQ3();

  // 合計計算
  const dryvanTotal = useMemo(() => {
    const v = data.dryvan.vehicles;
    return Object.values(v).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  }, [data.dryvan.vehicles]);

  const nonDryvanTotal = useMemo(() => {
    const v = data.nonDryvan.vehicles;
    return Object.values(v).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  }, [data.nonDryvan.vehicles]);

  const q3Total = dryvanTotal + nonDryvanTotal;
  const q2Total = parseInt(q2Data.totalVehicles) || 0;
  const isMatching = q2Total === q3Total;

  // ハイライト判定
  const dryvanNeedsSelection = dryvanTotal > 0 && data.dryvan.vehicleTypes.length === 0;
  const nonDryvanNeedsSelection = nonDryvanTotal > 0 && data.nonDryvan.vehicleTypes.length === 0;

  // ハンドラ
  const handleDryvanVehicleChange = (key: keyof VehicleCounts, value: string) => {
    update({
      dryvan: {
        ...data.dryvan,
        vehicles: { ...data.dryvan.vehicles, [key]: value },
      },
    });
  };

  const handleNonDryvanVehicleChange = (key: keyof VehicleCounts, value: string) => {
    update({
      nonDryvan: {
        ...data.nonDryvan,
        vehicles: { ...data.nonDryvan.vehicles, [key]: value },
      },
    });
  };

  const handleDryvanTypeToggle = (typeId: string) => {
    const current = data.dryvan.vehicleTypes;
    const updated = current.includes(typeId)
      ? current.filter((t) => t !== typeId)
      : [...current, typeId];
    update({
      dryvan: { ...data.dryvan, vehicleTypes: updated },
    });
  };

  const handleNonDryvanTypeToggle = (typeId: string) => {
    const current = data.nonDryvan.vehicleTypes;
    const updated = current.includes(typeId)
      ? current.filter((t) => t !== typeId)
      : [...current, typeId];
    update({
      nonDryvan: { ...data.nonDryvan, vehicleTypes: updated },
    });
  };

  const handleOtherTextChange = (value: string) => {
    update({
      nonDryvan: { ...data.nonDryvan, vehicleTypesOther: value },
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問3</h2>
          <p className="text-slate-600 text-sm">
            【全ての営業所】で保有する車両についてご記入ください。
          </p>
        </div>
      </div>

      {/* ドライバン等 */}
      <div
        className={`rounded-xl border-2 p-5 mb-6 transition-colors ${
          dryvanNeedsSelection
            ? "border-orange-300 bg-orange-50"
            : dryvanTotal > 0
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">ドライバン等</h3>
          </div>
          <div className="text-sm font-medium text-slate-600">
            小計: <span className="text-blue-600 font-bold">{dryvanTotal}</span> 両
          </div>
        </div>

        {/* 車両台数テーブル */}
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-700 mb-3">車両台数</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {VEHICLE_SIZES.map((size) => (
                    <th key={size.id} className="text-center px-2 py-1">
                      <div className="text-sm font-medium text-slate-700">{size.label}</div>
                      <div className="text-xs text-slate-500">{size.subLabel}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {VEHICLE_SIZES.map((size) => (
                    <td key={size.id} className="text-center px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={data.dryvan.vehicles[size.id as keyof VehicleCounts]}
                          onChange={(e) =>
                            handleDryvanVehicleChange(size.id as keyof VehicleCounts, e.target.value)
                          }
                          className="w-16 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
                          placeholder="0"
                        />
                        <span className="text-xs text-slate-500">両</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 車型選択 */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">
            車型（該当するものを全て選択）
            {dryvanNeedsSelection && (
              <span className="ml-2 text-orange-600 text-xs">※ 車両台数がある場合は選択してください</span>
            )}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DRYVAN_VEHICLE_TYPES.map((type) => (
              <label
                key={type.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  data.dryvan.vehicleTypes.includes(type.id)
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-white border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.dryvan.vehicleTypes.includes(type.id)}
                  onChange={() => handleDryvanTypeToggle(type.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ドライバン等以外 */}
      <div
        className={`rounded-xl border-2 p-5 transition-colors ${
          nonDryvanNeedsSelection
            ? "border-orange-300 bg-orange-50"
            : nonDryvanTotal > 0
            ? "border-green-300 bg-green-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-slate-900">ドライバン等以外</h3>
          </div>
          <div className="text-sm font-medium text-slate-600">
            小計: <span className="text-green-600 font-bold">{nonDryvanTotal}</span> 両
          </div>
        </div>

        {/* 車両台数テーブル */}
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-700 mb-3">車両台数</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {VEHICLE_SIZES.map((size) => (
                    <th key={size.id} className="text-center px-2 py-1">
                      <div className="text-sm font-medium text-slate-700">{size.label}</div>
                      <div className="text-xs text-slate-500">{size.subLabel}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {VEHICLE_SIZES.map((size) => (
                    <td key={size.id} className="text-center px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={data.nonDryvan.vehicles[size.id as keyof VehicleCounts]}
                          onChange={(e) =>
                            handleNonDryvanVehicleChange(size.id as keyof VehicleCounts, e.target.value)
                          }
                          className="w-16 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
                          placeholder="0"
                        />
                        <span className="text-xs text-slate-500">両</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 車型選択 */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">
            車型（該当するものを全て選択）
            {nonDryvanNeedsSelection && (
              <span className="ml-2 text-orange-600 text-xs">※ 車両台数がある場合は選択してください</span>
            )}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {NON_DRYVAN_VEHICLE_TYPES.map((type) => (
              <label
                key={type.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  data.nonDryvan.vehicleTypes.includes(type.id)
                    ? "bg-green-100 border border-green-300"
                    : "bg-white border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.nonDryvan.vehicleTypes.includes(type.id)}
                  onChange={() => handleNonDryvanTypeToggle(type.id)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-slate-700">{type.label}</span>
              </label>
            ))}
          </div>
          {/* その他テキスト入力 */}
          {data.nonDryvan.vehicleTypes.includes("other") && (
            <div className="mt-3">
              <input
                type="text"
                value={data.nonDryvan.vehicleTypesOther}
                onChange={(e) => handleOtherTextChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="その他の車型を入力してください"
              />
            </div>
          )}
        </div>
      </div>

      {/* 合計確認 */}
      {showTotalCheck && (
        <div
          className={`mt-6 rounded-xl border-2 p-5 ${
            q2Total > 0 && !isMatching
              ? "border-orange-300 bg-orange-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            {isMatching && q2Total > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : q2Total > 0 && !isMatching ? (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            ) : null}
            合計確認
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-700">設問2 保有車両台数</span>
              <span className="font-bold text-slate-900">{q2Total} 両</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 ml-4">設問3 ドライバン等</span>
              <span className="text-blue-600">{dryvanTotal} 両</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 ml-4">設問3 ドライバン等以外</span>
              <span className="text-green-600">{nonDryvanTotal} 両</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200">
              <span className="text-slate-700">設問3 合計</span>
              <span className={`font-bold ${isMatching ? "text-green-600" : "text-orange-600"}`}>
                {q3Total} 両 {isMatching && q2Total > 0 && "✓ 一致"}
              </span>
            </div>
          </div>
          {q2Total > 0 && !isMatching && (
            <div className="mt-4 p-3 bg-orange-100 rounded-lg">
              <p className="text-sm text-orange-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                設問2の保有車両台数（{q2Total}両）と設問3の合計（{q3Total}両）が一致しません。
                入力内容をご確認ください。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
