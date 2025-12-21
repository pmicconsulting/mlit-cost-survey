"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, AlertCircle, FileText, Truck, Users, Calculator, Shield, TrendingUp } from "lucide-react";

interface SurveyProgress {
  q2q3: boolean;
  q4: boolean;
  q5q6: boolean;
  q7q11: boolean;
  q12q14: boolean;
  q15: boolean;
  q16: boolean;
}

const SECTIONS = [
  { id: "q2q3", label: "設問2-3: 車両情報", icon: Truck, link: "/survey/common/q2-q3", color: "blue" },
  { id: "q4", label: "設問4: 運転者情報", icon: Users, link: "/survey/common/q4", color: "green" },
  { id: "q5q6", label: "設問5-6: 確認事項", icon: AlertCircle, link: "/survey/common/q5-q6", color: "orange" },
  { id: "q7q11", label: "設問7-11: 財務状況", icon: FileText, link: "/survey/common/q7-q11", color: "purple" },
  { id: "q12q14", label: "設問12-14: 損益明細", icon: Calculator, link: "/survey/common/q12-q14", color: "teal" },
  { id: "q15", label: "設問15: 安全経費", icon: Shield, link: "/survey/common/q15", color: "emerald" },
  { id: "q16", label: "設問16: 事業投資", icon: TrendingUp, link: "/survey/common/q16", color: "indigo" },
];

const checkSectionComplete = (sectionId: string): boolean => {
  if (typeof window === "undefined") return false;
  const storageKey = {
    q2q3: "survey_q2_q3_draft",
    q4: "survey_q4_draft",
    q5q6: "survey_q5_q6_draft",
    q7q11: "survey_q7_q11_draft",
    q12q14: "survey_q12_q14_draft",
    q15: "survey_q15_draft",
    q16: "survey_q16_draft",
  }[sectionId];

  if (!storageKey) return false;
  const data = localStorage.getItem(storageKey);
  return data !== null && data !== "{}";
};

export default function SurveyConfirmPage() {
  const [progress, setProgress] = useState<SurveyProgress>({
    q2q3: false,
    q4: false,
    q5q6: false,
    q7q11: false,
    q12q14: false,
    q15: false,
    q16: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 各セクションの入力状況を確認
    const newProgress: SurveyProgress = {
      q2q3: checkSectionComplete("q2q3"),
      q4: checkSectionComplete("q4"),
      q5q6: checkSectionComplete("q5q6"),
      q7q11: checkSectionComplete("q7q11"),
      q12q14: checkSectionComplete("q12q14"),
      q15: checkSectionComplete("q15"),
      q16: checkSectionComplete("q16"),
    };
    setProgress(newProgress);
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = Object.keys(progress).length;
  const isAllComplete = completedCount === totalCount;

  const handleSubmit = async () => {
    if (!isAllComplete) return;

    setSubmitting(true);
    // TODO: 実際のSubmit処理（Supabase連携時に実装）
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            調査票を提出しました
          </h1>
          <p className="text-slate-600 mb-8">
            ご回答いただきありがとうございます。
            <br />
            調査票は正常に受理されました。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/survey/common/q16"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">確認・提出</div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            回答内容の確認
          </h1>
          <p className="text-slate-600">
            入力内容を確認し、提出してください
          </p>
        </div>

        {/* 進捗サマリー */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">入力状況</h2>
            <div className="text-sm">
              <span className={`font-bold ${isAllComplete ? "text-green-600" : "text-orange-600"}`}>
                {completedCount}
              </span>
              <span className="text-slate-500"> / {totalCount} セクション完了</span>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-500 ${
                isAllComplete ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>

          {/* セクション一覧 */}
          <div className="space-y-3">
            {SECTIONS.map((section) => {
              const isComplete = progress[section.id as keyof SurveyProgress];
              const Icon = section.icon;

              return (
                <Link
                  key={section.id}
                  href={section.link}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    isComplete
                      ? "bg-green-50 border-green-200 hover:border-green-300"
                      : "bg-orange-50 border-orange-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete ? "bg-green-100" : "bg-orange-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isComplete ? "text-green-600" : "text-orange-600"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-slate-700">{section.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">入力済み</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-orange-600 font-medium">未入力</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-amber-800 mb-2">提出前のご確認</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>・ 全てのセクションの入力が完了していることをご確認ください</li>
            <li>・ 提出後は内容の修正ができません</li>
            <li>・ 不明点がある場合は「お問い合わせ」よりご連絡ください</li>
          </ul>
        </div>

        {/* 提出ボタン */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isAllComplete || submitting}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-colors ${
              isAllComplete
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                調査票を提出する
              </>
            )}
          </button>
        </div>

        {!isAllComplete && (
          <p className="text-center text-sm text-orange-600 mt-4">
            ※ 全てのセクションを入力してから提出してください
          </p>
        )}

        {/* ダッシュボードへ戻る */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
