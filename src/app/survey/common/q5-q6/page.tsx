"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, CheckCircle, AlertTriangle, CloudLightning } from "lucide-react";

// 選択肢
const OPTIONS = {
  q5: [
    { value: "yes", label: "はい" },
    { value: "no", label: "いいえ" },
    { value: "unknown", label: "把握していない" },
  ],
  q6: [
    { value: "yes", label: "はい" },
    { value: "no", label: "いいえ" },
    { value: "unknown", label: "把握していない" },
  ],
};

interface SurveyData {
  q5: string; // 行政処分の有無
  q6: string; // 災害影響の有無
}

const initialData: SurveyData = {
  q5: "",
  q6: "",
};

// ダミー保存・読込関数
const saveSurveyData = async (data: SurveyData) => {
  console.log("保存データ:", data);
  localStorage.setItem("survey_q5_q6_draft", JSON.stringify(data));
  return { success: true };
};

const loadSurveyData = (): SurveyData | null => {
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q5_q6_draft");
  return draft ? JSON.parse(draft) : null;
};

export default function SurveyQ5Q6Page() {
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
              href="/survey/common/q4"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">設問 5-6 / 16</div>
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

        {/* 設問5 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問5</h2>
              <p className="text-slate-600 text-sm">
                過去2年間に行政処分を受けたことはありますか？
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {OPTIONS.q5.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                  data.q5 === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="q5"
                  value={option.value}
                  checked={data.q5 === option.value}
                  onChange={(e) => setData({ ...data, q5: e.target.value })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>

          {data.q5 === "yes" && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
              ※ 行政処分を受けた場合、詳細は別途確認させていただく場合があります。
            </div>
          )}
        </div>

        {/* 設問6 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <CloudLightning className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問6</h2>
              <p className="text-slate-600 text-sm">
                過去2年間に自然災害等により事業に大きな影響がありましたか？
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {OPTIONS.q6.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                  data.q6 === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="q6"
                  value={option.value}
                  checked={data.q6 === option.value}
                  onChange={(e) => setData({ ...data, q6: e.target.value })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>

          {data.q6 === "yes" && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
              ※ 対象となる災害：地震、台風、豪雨、洪水、土砂災害、大雪、その他自然災害
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
            href="/survey/common/q7-q11"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            次へ進む（設問7-11）
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
