"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q62ChassisTypes,
  Q63TractorSpecs,
  Q64TractorProcurementMethod,
  Q65TractorProcurementDetails,
  Q66TractorEquipmentCosts,
} from "@/components/survey/questions";

export default function TractorStep1Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={1}
        stepTitle="トラクター基本情報"
        prevHref="/survey/dryvan/step17"
        nextHref="/survey/tractor/step2"
        nextLabel="次へ（運行概要）"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q62ChassisTypes />
          <Q63TractorSpecs />
          <Q64TractorProcurementMethod />
          <Q65TractorProcurementDetails />
          <Q66TractorEquipmentCosts />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
