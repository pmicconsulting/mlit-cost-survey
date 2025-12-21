"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q58AveragePerOperation,
  Q59VehicleWashing,
  Q60SpecialPermitCost,
} from "@/components/survey/questions";

export default function SingleTruckStep5Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={5}
        stepTitle="運行データ"
        prevHref="/survey/single-truck/step4"
        nextHref="/survey/single-truck/step6"
        nextLabel="次へ（運行詳細）"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q58AveragePerOperation />
          <Q59VehicleWashing />
          <Q60SpecialPermitCost />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
