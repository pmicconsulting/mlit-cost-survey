"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q32CancellationFees } from "@/components/survey/questions";

export default function DryvanStep13Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={13}
        stepTitle="キャンセル料"
        prevHref="/survey/dryvan/step12"
        nextHref="/survey/dryvan/step14"
        nextLabel="次へ（運行距離帯）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <Q32CancellationFees />
      </SurveyLayout>
    </SurveyProvider>
  );
}
