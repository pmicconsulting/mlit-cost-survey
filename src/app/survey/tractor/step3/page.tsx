"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q69TractorTaxes,
  Q70TractorInsurance,
  Q71TractorFuelEfficiency,
  Q72TractorOilCosts,
  Q73TractorTireCosts,
  Q74TractorUreaCosts,
  Q75TractorMaintenanceCosts,
} from "@/components/survey/questions";

export default function TractorStep3Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={3}
        stepTitle="税金・保険・消耗品"
        prevHref="/survey/tractor/step2"
        nextHref="/survey/tractor/step4"
        nextLabel="次へ（荷役・収入）"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q69TractorTaxes />
          <Q70TractorInsurance />
          <Q71TractorFuelEfficiency />
          <Q72TractorOilCosts />
          <Q73TractorTireCosts />
          <Q74TractorUreaCosts />
          <Q75TractorMaintenanceCosts />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
