"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q23FuelSurchargeNegotiation,
  Q24FuelSurchargeIntroduction,
  Q25FuelSurchargePrice,
  Q26FuelProcurement,
} from "@/components/survey/questions";

export default function DryvanStep10Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={10}
        stepTitle="燃料サーチャージ"
        prevHref="/survey/dryvan/step9"
        nextHref="/survey/dryvan/step11"
        nextLabel="次へ（高速道路・フェリー）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q23FuelSurchargeNegotiation />
          <Q24FuelSurchargeIntroduction />
          <Q25FuelSurchargePrice />
          <Q26FuelProcurement />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
