"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q55CargoHandlingSupplies,
  Q56MonthlyRevenue,
  Q57MonthlyOperations,
} from "@/components/survey/questions";

export default function SingleTruckStep4Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={4}
        stepTitle="荷役・収入"
        prevHref="/survey/single-truck/step3"
        nextHref="/survey/single-truck/step5"
        nextLabel="次へ（運行データ）"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q55CargoHandlingSupplies />
          <Q56MonthlyRevenue />
          <Q57MonthlyOperations />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
