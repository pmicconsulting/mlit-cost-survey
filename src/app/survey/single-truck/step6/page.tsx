"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q61OperationDetails } from "@/components/survey/questions";

export default function SingleTruckStep6Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={6}
        stepTitle="運行詳細"
        prevHref="/survey/single-truck/step5"
        nextHref="/survey/confirm"
        nextLabel="確認画面へ"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <Q61OperationDetails />

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-purple-800 text-sm">
            これで単車調査の全設問は終了です。
            「確認画面へ」ボタンを押して、入力内容をご確認ください。
          </p>
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
