"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q40VehicleShape,
  Q41VehicleSpecs,
  Q42ProcurementMethod,
  Q43ProcurementDetails,
  Q44EquipmentCosts,
} from "@/components/survey/questions";

export default function SingleTruckStep1Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={1}
        stepTitle="車両基本情報"
        prevHref="/survey/dryvan/step17"
        nextHref="/survey/single-truck/step2"
        nextLabel="次へ（運行概要）"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q40VehicleShape />
          <Q41VehicleSpecs />
          <Q42ProcurementMethod />
          <Q43ProcurementDetails />
          <Q44EquipmentCosts />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
