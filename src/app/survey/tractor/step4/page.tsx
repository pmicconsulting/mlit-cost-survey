"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q76TractorCargoHandlingSupplies,
  Q77TractorMonthlyRevenue,
  Q78TractorMonthlyOperations,
} from "@/components/survey/questions";

export default function TractorStep4Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={4}
        stepTitle="荷役・収入"
        prevHref="/survey/tractor/step3"
        nextHref="/survey/tractor/step5"
        nextLabel="次へ（運行データ）"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q76TractorCargoHandlingSupplies />
          <Q77TractorMonthlyRevenue />
          <Q78TractorMonthlyOperations />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
