"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q39TransportDetails } from "@/components/survey/questions";

export default function DryvanStep17Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={17}
        stepTitle="主な輸送詳細"
        prevHref="/survey/dryvan/step16"
        nextHref="/survey/confirm"
        nextLabel="確認画面へ"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <Q39TransportDetails />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            これで料金収受実態調査の全設問は終了です。
            「確認画面へ」ボタンを押して、入力内容をご確認ください。
          </p>
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
