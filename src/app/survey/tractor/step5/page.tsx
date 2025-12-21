"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q79TractorAveragePerOperation,
  Q80TractorVehicleWashing,
  Q81TractorSpecialPermitCost,
} from "@/components/survey/questions";

export default function TractorStep5Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={5}
        stepTitle="運行データ"
        prevHref="/survey/tractor/step4"
        nextHref="/survey/tractor/step6"
        nextLabel="次へ（運行詳細）"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q79TractorAveragePerOperation />
          <Q80TractorVehicleWashing />
          <Q81TractorSpecialPermitCost />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
