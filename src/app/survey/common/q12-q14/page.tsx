"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Calculator, FileText } from "lucide-react";

// Q12 損益明細表の項目
const Q12_ITEMS = [
  { id: "revenue", label: "営業収益（合計）", category: "収益" },
  { id: "facilityUsageFee", label: "施設使用料", category: "費用" },
  { id: "facilityTax", label: "施設賦課税", category: "費用" },
  { id: "accidentCompensation", label: "事故賠償費", category: "費用" },
  { id: "otherExpenses", label: "その他", category: "費用" },
  { id: "subcontractCost", label: "傭車費用", category: "費用" },
  { id: "adminExpenses", label: "一般管理費（合計）", category: "費用" },
  { id: "operatingExpenses", label: "営業費用（合計）", category: "費用" },
  { id: "operatingIncome", label: "営業損益", category: "損益" },
  { id: "ordinaryIncome", label: "経常損益", category: "損益" },
];

// Q13 P/Lの項目
const Q13_ITEMS = [
  { id: "salesRevenue", label: "売上高（運送収入等）" },
  { id: "costOfSales", label: "売上原価（運送原価等）" },
  { id: "operatingProfit", label: "営業利益" },
];

// ラジオ選択肢
const RADIO_OPTIONS = [
  { value: "yes", label: "はい" },
  { value: "no", label: "いいえ" },
  { value: "unknown", label: "把握していない" },
];

interface SurveyData {
  q12: { [key: string]: string };
  q13: { [key: string]: string };
  q14: string;
}

const initialData: SurveyData = {
  q12: Q12_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: "" }), {}),
  q13: Q13_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: "" }), {}),
  q14: "",
};

// ダミー保存・読込関数
const saveSurveyData = async (data: SurveyData) => {
  console.log("保存データ:", data);
  localStorage.setItem("survey_q12_q14_draft", JSON.stringify(data));
  return { success: true };
};

const loadSurveyData = (): SurveyData | null => {
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q12_q14_draft");
  return draft ? JSON.parse(draft) : null;
};

// 数値フォーマット（カンマ区切り）
const formatNumber = (value: string): string => {
  const num = parseInt(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

export default function SurveyQ12Q14Page() {
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
  const handleQ12Change = (itemId: string, value: string) => {
    // 数字とマイナス記号のみ許可
    const cleanValue = value.replace(/[^0-9-]/g, "");
    setData({
      ...data,
      q12: { ...data.q12, [itemId]: cleanValue },
    });
  };

  const handleQ13Change = (itemId: string, value: string) => {
    const cleanValue = value.replace(/[^0-9-]/g, "");
    setData({
      ...data,
      q13: { ...data.q13, [itemId]: cleanValue },
    });
  };

  // 合計計算
  const q12Total = useMemo(() => {
    const revenue = parseInt(data.q12.revenue) || 0;
    const expenses = Object.entries(data.q12)
      .filter(([key]) => !["revenue", "operatingIncome", "ordinaryIncome"].includes(key))
      .reduce((sum, [, val]) => sum + (parseInt(val) || 0), 0);
    return { revenue, expenses, diff: revenue - expenses };
  }, [data.q12]);

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
              href="/survey/common/q7-q11"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">設問 12-14 / 16</div>
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

        {/* 設問12 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問12</h2>
              <p className="text-slate-600 text-sm">
                一般貨物自動車運送事業損益明細表の数値をご記入ください（単位：千円）
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700 w-1/2">
                    項目
                  </th>
                  <th className="border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700">
                    金額（千円）
                  </th>
                </tr>
              </thead>
              <tbody>
                {Q12_ITEMS.map((item, index) => {
                  const isIncome = item.category === "損益";
                  const value = data.q12[item.id] || "";
                  const numValue = parseInt(value) || 0;
                  const isNegative = numValue < 0;

                  return (
                    <tr
                      key={item.id}
                      className={`${
                        isIncome ? "bg-blue-50" : index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td
                        className={`border border-slate-300 px-4 py-3 text-sm ${
                          isIncome ? "font-bold text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {item.label}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="text"
                            value={formatNumber(value)}
                            onChange={(e) => handleQ12Change(item.id, e.target.value)}
                            className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                              isNegative ? "text-red-600" : ""
                            } ${
                              isIncome ? "border-blue-300 bg-white" : "border-slate-300"
                            }`}
                            placeholder="0"
                          />
                          <span className="text-sm text-slate-500 w-10">千円</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">入力された営業収益:</span>
              <span className="font-medium">{q12Total.revenue.toLocaleString()} 千円</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            ※ 損益（営業損益・経常損益）は赤字の場合マイナス値で入力してください。
          </div>
        </div>

        {/* 設問13 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問13</h2>
              <p className="text-slate-600 text-sm">
                損益計算書（P/L）の数値をご記入ください（単位：千円）
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Q13_ITEMS.map((item) => {
              const value = data.q13[item.id] || "";
              const numValue = parseInt(value) || 0;
              const isNegative = numValue < 0;

              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <label className="text-sm font-medium text-slate-700">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formatNumber(value)}
                      onChange={(e) => handleQ13Change(item.id, e.target.value)}
                      className={`w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                        isNegative ? "text-red-600" : ""
                      }`}
                      placeholder="0"
                    />
                    <span className="text-sm text-slate-500 w-10">千円</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 設問14 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問14</h2>
              <p className="text-slate-600 text-sm">
                決算書類の作成に税理士が関与していますか？
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {RADIO_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
                  data.q14 === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="q14"
                  value={option.value}
                  checked={data.q14 === option.value}
                  onChange={(e) => setData({ ...data, q14: e.target.value })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">{option.label}</span>
              </label>
            ))}
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
            href="/survey/common/q15"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            次へ進む（設問15）
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
