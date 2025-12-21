"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q37FareBasis,
  Q38LoadRate,
} from "@/components/survey/questions";

export default function DryvanStep16Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={16}
        stepTitle="個建運賃"
        prevHref="/survey/dryvan/step15"
        nextHref="/survey/dryvan/step17"
        nextLabel="次へ（輸送詳細）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q37FareBasis />
          <Q38LoadRate />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
