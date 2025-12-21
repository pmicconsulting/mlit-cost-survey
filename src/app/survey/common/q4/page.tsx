"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, Users, CheckCircle } from "lucide-react";

// 運転者カテゴリ
const DRIVER_CATEGORIES = [
  { id: "tractor", label: "牽引車", subLabel: "（ヘッド）" },
  { id: "large", label: "大型車", subLabel: "（10tクラス）" },
  { id: "medium", label: "中型車", subLabel: "（4tクラス）" },
  { id: "small", label: "小型車", subLabel: "（2tクラス）" },
  { id: "other", label: "その他", subLabel: "" },
];

// 入力項目
const DRIVER_METRICS = [
  { id: "workDays", label: "月間平均労働日数", unit: "日", min: 0, max: 31 },
  { id: "workHours", label: "月間平均労働時間", unit: "時間", min: 0, max: 400 },
  { id: "monthlyWage", label: "月間平均賃金総額", unit: "万円", min: 0, max: 999 },
  { id: "averageAge", label: "平均年齢", unit: "歳", min: 18, max: 80 },
];

// データ型定義
interface DriverMetrics {
  workDays: string;
  workHours: string;
  monthlyWage: string;
  averageAge: string;
}

interface SurveyData {
  drivers: {
    tractor: DriverMetrics;
    large: DriverMetrics;
    medium: DriverMetrics;
    small: DriverMetrics;
    other: DriverMetrics;
  };
  driverCount: {
    tractor: string;
    large: string;
    medium: string;
    small: string;
    other: string;
  };
}

const emptyMetrics: DriverMetrics = {
  workDays: "",
  workHours: "",
  monthlyWage: "",
  averageAge: "",
};

const initialData: SurveyData = {
  drivers: {
    tractor: { ...emptyMetrics },
    large: { ...emptyMetrics },
    medium: { ...emptyMetrics },
    small: { ...emptyMetrics },
    other: { ...emptyMetrics },
  },
  driverCount: {
    tractor: "",
    large: "",
    medium: "",
    small: "",
    other: "",
  },
};

// ダミー保存・読込関数
const saveSurveyData = async (data: SurveyData) => {
  console.log("保存データ:", data);
  localStorage.setItem("survey_q4_draft", JSON.stringify(data));
  return { success: true };
};

const loadSurveyData = (): SurveyData | null => {
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q4_draft");
  return draft ? JSON.parse(draft) : null;
};

export default function SurveyQ4Page() {
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

  // 入力ハンドラ
  const handleDriverCountChange = (categoryId: string, value: string) => {
    setData({
      ...data,
      driverCount: { ...data.driverCount, [categoryId]: value },
    });
  };

  const handleMetricChange = (
    categoryId: string,
    metricId: string,
    value: string
  ) => {
    setData({
      ...data,
      drivers: {
        ...data.drivers,
        [categoryId]: {
          ...data.drivers[categoryId as keyof typeof data.drivers],
          [metricId]: value,
        },
      },
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

  // 合計計算
  const totalDrivers = Object.values(data.driverCount).reduce(
    (sum, val) => sum + (parseInt(val) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/survey/common/q2-q3"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">設問 4 / 16</div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ドライバン等 適正原価に関する実態調査
          </h1>
          <p className="text-slate-600 text-sm">
            ※設問2～16は事業全体（全ての営業所を含む）についてご回答ください。
          </p>
        </div>

        {/* 設問4 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問4</h2>
              <p className="text-slate-600 text-sm">
                運転者1人当たり月間平均についてご記入ください（直近1年間の平均）
              </p>
            </div>
          </div>

          {/* 運転者数入力 */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              運転者数（車型別）
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {DRIVER_CATEGORIES.map((cat) => (
                      <th key={cat.id} className="text-center px-2 py-1">
                        <div className="text-sm font-medium text-slate-700">
                          {cat.label}
                        </div>
                        {cat.subLabel && (
                          <div className="text-xs text-slate-500">{cat.subLabel}</div>
                        )}
                      </th>
                    ))}
                    <th className="text-center px-2 py-1">
                      <div className="text-sm font-medium text-slate-900">合計</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {DRIVER_CATEGORIES.map((cat) => (
                      <td key={cat.id} className="text-center px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={data.driverCount[cat.id as keyof typeof data.driverCount]}
                            onChange={(e) =>
                              handleDriverCountChange(cat.id, e.target.value)
                            }
                            className="w-16 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
                            placeholder="0"
                          />
                          <span className="text-xs text-slate-500">人</span>
                        </div>
                      </td>
                    ))}
                    <td className="text-center px-2 py-2">
                      <div className="text-lg font-bold text-blue-600">
                        {totalDrivers}人
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* マトリクステーブル */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700">
                    1ヶ月合計
                  </th>
                  {DRIVER_CATEGORIES.map((cat) => (
                    <th
                      key={cat.id}
                      className="border border-slate-300 px-3 py-2 text-center"
                    >
                      <div className="text-sm font-medium text-slate-700">
                        {cat.label}
                      </div>
                      {cat.subLabel && (
                        <div className="text-xs text-slate-500">{cat.subLabel}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DRIVER_METRICS.map((metric) => (
                  <tr key={metric.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-3 py-3 text-sm font-medium text-slate-700 bg-slate-50">
                      {metric.label}
                    </td>
                    {DRIVER_CATEGORIES.map((cat) => {
                      const hasDrivers =
                        parseInt(
                          data.driverCount[cat.id as keyof typeof data.driverCount]
                        ) > 0;
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
                              value={
                                data.drivers[cat.id as keyof typeof data.drivers][
                                  metric.id as keyof DriverMetrics
                                ]
                              }
                              onChange={(e) =>
                                handleMetricChange(cat.id, metric.id, e.target.value)
                              }
                              className={`w-16 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                                hasDrivers
                                  ? "border-blue-300 bg-white"
                                  : "border-slate-300"
                              }`}
                              placeholder="-"
                            />
                            <span className="text-xs text-slate-500 w-8 text-left">
                              {metric.unit}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 注記 */}
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            <p>
              ※ 運転者数が入力されている車型のセルがハイライトされます。
              <br />
              ※ 賃金総額には基本給、諸手当（時間外手当を含む）、賞与月割額を含みます。
            </p>
          </div>
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
            href="/survey/common/q5-q6"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            次へ進む（設問5-6）
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
