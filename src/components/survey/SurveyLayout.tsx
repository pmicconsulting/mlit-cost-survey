"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2 } from "lucide-react";
import { useSurvey } from "./SurveyContext";
import { SURVEY_TYPE_LABELS, SurveyType } from "./types";

interface SurveyLayoutProps {
  children: ReactNode;
  surveyType: SurveyType;
  stepNumber: number;
  stepTitle: string;
  prevHref?: string;
  nextHref?: string;
  nextLabel?: string;
  isLastStep?: boolean;
}

export function SurveyLayout({
  children,
  surveyType,
  stepNumber,
  stepTitle,
  prevHref,
  nextHref,
  nextLabel = "次へ進む",
  isLastStep = false,
}: SurveyLayoutProps) {
  const { totalSteps, isDirty, isSaving, lastSaved, saveToLocal } = useSurvey();

  const handleSave = () => {
    saveToLocal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/mlit_logo.png"
                alt="国土交通省"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500">
                ステップ {stepNumber} / {totalSteps}
              </div>
              {lastSaved && (
                <div className="text-xs text-slate-400">
                  最終保存: {lastSaved.toLocaleTimeString("ja-JP")}
                </div>
              )}
              {isDirty && <div className="w-2 h-2 bg-orange-400 rounded-full" title="未保存の変更があります" />}
              {/* 開発用：確認画面へスキップ */}
              <Link
                href="/survey/confirm"
                className="text-xs text-slate-400 hover:text-blue-600 underline"
              >
                確認画面へ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* プログレスバー */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {SURVEY_TYPE_LABELS[surveyType]} 適正原価に関する実態調査
          </h1>
          <p className="text-slate-600 text-sm">
            ステップ{stepNumber}: {stepTitle}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="space-y-6">{children}</div>

        {/* ナビゲーションボタン */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {prevHref && (
              <Link
                href={prevHref}
                className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                前へ戻る
              </Link>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  保存中...
                </>
              ) : !isDirty && lastSaved ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  保存済み
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  一時保存
                </>
              )}
            </button>
          </div>

          {nextHref && (
            <Link
              href={nextHref}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isLastStep
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {nextLabel}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
