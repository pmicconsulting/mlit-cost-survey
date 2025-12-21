"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q48Taxes,
  Q49Insurance,
  Q50FuelEfficiency,
  Q51OilCosts,
  Q52TireCosts,
  Q53UreaCosts,
  Q54MaintenanceCosts,
} from "@/components/survey/questions";

export default function SingleTruckStep3Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={3}
        stepTitle="税金・保険・消耗品"
        prevHref="/survey/single-truck/step2"
        nextHref="/survey/single-truck/step4"
        nextLabel="次へ（荷役・収入）"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q48Taxes />
          <Q49Insurance />
          <Q50FuelEfficiency />
          <Q51OilCosts />
          <Q52TireCosts />
          <Q53UreaCosts />
          <Q54MaintenanceCosts />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
