"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, Truck, AlertTriangle, CheckCircle } from "lucide-react";

// 車型の選択肢
const DRYVAN_VEHICLE_TYPES = [
  { id: "van_body", label: "バンボディ" },
  { id: "wing_body", label: "ウィングボディ" },
  { id: "flat_body", label: "平ボディ" },
  { id: "covered_wing", label: "幌ウィング" },
  { id: "van_trailer", label: "バン型（被牽引車）" },
];

const NON_DRYVAN_VEHICLE_TYPES = [
  { id: "refrigerated", label: "冷蔵車・冷凍車" },
  { id: "dump", label: "ダンプ車" },
  { id: "tank", label: "タンク車" },
  { id: "bulk", label: "バルク車" },
  { id: "container", label: "コンテナ輸送車" },
  { id: "concrete_mixer", label: "コンクリートミキサー車" },
  { id: "truck_crane", label: "トラック搭載型クレーン車" },
  { id: "waste", label: "一般廃棄物輸送車（塵芥車、衛生車等）" },
  { id: "car_carrier", label: "車積載車（キャリアカー）" },
  { id: "heavy", label: "重量物輸送車" },
  { id: "other", label: "その他" },
];

// 車両サイズの定義
const VEHICLE_SIZES = [
  { id: "tractor", label: "牽引車", subLabel: "（ヘッド）" },
  { id: "trailer", label: "被牽引車", subLabel: "（シャーシ）" },
  { id: "large", label: "大型", subLabel: "（10tクラス）" },
  { id: "medium", label: "中型", subLabel: "（4tクラス）" },
  { id: "small", label: "小型", subLabel: "（2tクラス）" },
];

// データ型定義
interface VehicleCounts {
  tractor: string;
  trailer: string;
  large: string;
  medium: string;
  small: string;
}

interface SurveyData {
  totalVehicles: string;
  dryvan: {
    vehicles: VehicleCounts;
    vehicleTypes: string[];
  };
  nonDryvan: {
    vehicles: VehicleCounts;
    vehicleTypes: string[];
    vehicleTypesOther: string;
  };
}

const initialData: SurveyData = {
  totalVehicles: "",
  dryvan: {
    vehicles: { tractor: "", trailer: "", large: "", medium: "", small: "" },
    vehicleTypes: [],
  },
  nonDryvan: {
    vehicles: { tractor: "", trailer: "", large: "", medium: "", small: "" },
    vehicleTypes: [],
    vehicleTypesOther: "",
  },
};

// ダミー保存関数
const saveSurveyData = async (data: SurveyData) => {
  // TODO: Supabase連携時に実装
  console.log("保存データ:", data);
  localStorage.setItem("survey_q2_q3_draft", JSON.stringify(data));
  return { success: true };
};

// ダミー読込関数
const loadSurveyData = (): SurveyData | null => {
  // TODO: Supabase連携時に実装
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q2_q3_draft");
  return draft ? JSON.parse(draft) : null;
};

export default function SurveyQ2Q3Page() {
  const [data, setData] = useState<SurveyData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 初回読み込み
  useEffect(() => {
    const savedData = loadSurveyData();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  // 合計計算
  const dryvanTotal = useMemo(() => {
    const v = data.dryvan.vehicles;
    return (
      (parseInt(v.tractor) || 0) +
      (parseInt(v.trailer) || 0) +
      (parseInt(v.large) || 0) +
      (parseInt(v.medium) || 0) +
      (parseInt(v.small) || 0)
    );
  }, [data.dryvan.vehicles]);

  const nonDryvanTotal = useMemo(() => {
    const v = data.nonDryvan.vehicles;
    return (
      (parseInt(v.tractor) || 0) +
      (parseInt(v.trailer) || 0) +
      (parseInt(v.large) || 0) +
      (parseInt(v.medium) || 0) +
      (parseInt(v.small) || 0)
    );
  }, [data.nonDryvan.vehicles]);

  const q3Total = dryvanTotal + nonDryvanTotal;
  const q2Total = parseInt(data.totalVehicles) || 0;
  const isMatching = q2Total === q3Total;

  // ハイライト判定
  const shouldHighlightDryvan = dryvanTotal > 0;
  const shouldHighlightNonDryvan = nonDryvanTotal > 0;
  const dryvanNeedsSelection = shouldHighlightDryvan && data.dryvan.vehicleTypes.length === 0;
  const nonDryvanNeedsSelection = shouldHighlightNonDryvan && data.nonDryvan.vehicleTypes.length === 0;

  // 入力ハンドラ
  const handleTotalChange = (value: string) => {
    setData({ ...data, totalVehicles: value });
  };

  const handleDryvanVehicleChange = (key: keyof VehicleCounts, value: string) => {
    setData({
      ...data,
      dryvan: {
        ...data.dryvan,
        vehicles: { ...data.dryvan.vehicles, [key]: value },
      },
    });
  };

  const handleNonDryvanVehicleChange = (key: keyof VehicleCounts, value: string) => {
    setData({
      ...data,
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
    setData({
      ...data,
      dryvan: { ...data.dryvan, vehicleTypes: updated },
    });
  };

  const handleNonDryvanTypeToggle = (typeId: string) => {
    const current = data.nonDryvan.vehicleTypes;
    const updated = current.includes(typeId)
      ? current.filter((t) => t !== typeId)
      : [...current, typeId];
    setData({
      ...data,
      nonDryvan: { ...data.nonDryvan, vehicleTypes: updated },
    });
  };

  const handleOtherTextChange = (value: string) => {
    setData({
      ...data,
      nonDryvan: { ...data.nonDryvan, vehicleTypesOther: value },
    });
  };

  // 保存処理
  const handleSave = async () => {
    setSaving(true);
    await saveSurveyData(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードに戻る
            </Link>
            <div className="text-sm text-slate-500">設問 2-3 / 16</div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ドライバン等 適正原価に関する実態調査
          </h1>
          <p className="text-slate-600 text-sm">
            ※設問2～16は事業全体（全ての営業所を含む）についてご回答ください。
          </p>
        </div>

        {/* 設問2 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            設問2
          </h2>
          <p className="text-slate-700 mb-4">
            【全ての営業所】で保有する車両台数についてご記入ください。
          </p>
          <div className="flex items-center gap-3">
            <label className="text-slate-700 font-medium">保有車両台数</label>
            <input
              type="number"
              min="0"
              value={data.totalVehicles}
              onChange={(e) => handleTotalChange(e.target.value)}
              className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              placeholder="0"
            />
            <span className="text-slate-700">両</span>
          </div>
        </div>

        {/* 設問3 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            設問3
          </h2>
          <p className="text-slate-700 mb-6">
            【全ての営業所】で保有する車両についてご記入ください。
          </p>

          {/* ドライバン等 */}
          <div
            className={`rounded-xl border-2 p-5 mb-6 transition-colors ${
              dryvanNeedsSelection
                ? "border-orange-300 bg-orange-50"
                : shouldHighlightDryvan
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

            {/* 車両台数 */}
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
                : shouldHighlightNonDryvan
                ? "border-blue-300 bg-blue-50"
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

            {/* 車両台数 */}
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
        </div>

        {/* 合計確認 */}
        <div
          className={`rounded-xl border-2 p-5 mb-6 ${
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

        {/* ボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>保存中...</>
            ) : saved ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                保存しました
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                一時保存
              </>
            )}
          </button>
          <Link
            href="/survey/common/q4"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            次へ進む（設問4）
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
