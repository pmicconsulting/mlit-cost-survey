"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q82TractorOperationDetails } from "@/components/survey/questions";

export default function TractorStep6Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={6}
        stepTitle="運行詳細"
        prevHref="/survey/tractor/step5"
        nextHref="/survey/confirm"
        nextLabel="確認画面へ"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <Q82TractorOperationDetails />

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800 text-sm">
            これでトラクター調査の全設問は終了です。
            「確認画面へ」ボタンを押して、入力内容をご確認ください。
          </p>
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
