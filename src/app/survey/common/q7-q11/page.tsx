"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Building2, Calendar, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

// Q7 選択肢（チェックボックス）
const Q7_OPTIONS = [
  { value: "establishment", label: "設立（過去2年間の新規設立）" },
  { value: "merger", label: "合併" },
  { value: "transfer", label: "事業譲渡・譲受" },
  { value: "none", label: "発生していない" },
  { value: "unknown", label: "把握していない" },
];

// Q8-Q11, Q14 選択肢（ラジオボタン）
const RADIO_OPTIONS = [
  { value: "yes", label: "はい" },
  { value: "no", label: "いいえ" },
  { value: "unknown", label: "把握していない" },
];

interface SurveyData {
  q7: string[]; // 設立・合併等（複数選択可）
  q8: string;   // 決算期変更の有無
  q9: string;   // 営業損益（黒字/赤字）
  q10: string;  // 経常損益（2期連続）
  q11: string;  // 債務超過の有無
}

const initialData: SurveyData = {
  q7: [],
  q8: "",
  q9: "",
  q10: "",
  q11: "",
};

// ダミー保存・読込関数
const saveSurveyData = async (data: SurveyData) => {
  console.log("保存データ:", data);
  localStorage.setItem("survey_q7_q11_draft", JSON.stringify(data));
  return { success: true };
};

const loadSurveyData = (): SurveyData | null => {
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q7_q11_draft");
  return draft ? JSON.parse(draft) : null;
};

export default function SurveyQ7Q11Page() {
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

  // Q7チェックボックス処理
  const handleQ7Toggle = (value: string) => {
    let updated: string[];

    // 「発生していない」「把握していない」は排他的
    if (value === "none" || value === "unknown") {
      if (data.q7.includes(value)) {
        updated = data.q7.filter((v) => v !== value);
      } else {
        updated = [value];
      }
    } else {
      // 他の選択肢の場合
      if (data.q7.includes(value)) {
        updated = data.q7.filter((v) => v !== value);
      } else {
        updated = [...data.q7.filter((v) => v !== "none" && v !== "unknown"), value];
      }
    }

    setData({ ...data, q7: updated });
  };

  // 保存処理
  const handleSave = async () => {
    setSaving(true);
    await saveSurveyData(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ラジオ質問のレンダリング
  const renderRadioQuestion = (
    questionId: keyof SurveyData,
    title: string,
    description: string,
    icon: React.ReactNode,
    iconBg: string
  ) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {RADIO_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
              data[questionId] === option.value
                ? "bg-blue-50 border-blue-300"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={questionId}
              value={option.value}
              checked={data[questionId] === option.value}
              onChange={(e) => setData({ ...data, [questionId]: e.target.value })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/survey/common/q5-q6"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">設問 7-11 / 16</div>
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

        {/* セクションタイトル */}
        <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-bold">
          財務状況に関する設問
        </div>

        {/* 設問7 */}
        <div className="bg-white rounded-b-xl rounded-t-none shadow-sm border border-slate-200 border-t-0 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問7</h2>
              <p className="text-slate-600 text-sm">
                過去2年間に以下に該当するものはありますか？（複数選択可）
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {Q7_OPTIONS.map((option) => {
              const isSelected = data.q7.includes(option.value);
              const isExclusive = option.value === "none" || option.value === "unknown";
              const isDisabled =
                !isExclusive &&
                (data.q7.includes("none") || data.q7.includes("unknown"));

              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                    isSelected
                      ? "bg-blue-50 border-blue-300"
                      : isDisabled
                      ? "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleQ7Toggle(option.value)}
                    disabled={isDisabled && !isSelected}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 設問8 */}
        {renderRadioQuestion(
          "q8",
          "設問8",
          "過去2年間に決算期の変更はありましたか？",
          <Calendar className="w-5 h-5 text-purple-600" />,
          "bg-purple-100"
        )}

        {/* 設問9 */}
        {renderRadioQuestion(
          "q9",
          "設問9",
          "直近の決算期において、営業損益は黒字でしたか？",
          <TrendingUp className="w-5 h-5 text-green-600" />,
          "bg-green-100"
        )}

        {/* 設問10 */}
        {renderRadioQuestion(
          "q10",
          "設問10",
          "直近2期連続で経常損益が赤字でしたか？",
          <TrendingDown className="w-5 h-5 text-red-600" />,
          "bg-red-100"
        )}

        {/* 設問11 */}
        {renderRadioQuestion(
          "q11",
          "設問11",
          "直近の決算期において、債務超過の状態にありますか？",
          <AlertCircle className="w-5 h-5 text-orange-600" />,
          "bg-orange-100"
        )}

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
            href="/survey/common/q12-q14"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            次へ進む（設問12-14）
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
