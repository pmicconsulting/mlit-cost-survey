"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q27HighwayFerryRates,
  Q28HighwayRateBasis,
} from "@/components/survey/questions";

export default function DryvanStep11Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={11}
        stepTitle="高速道路・フェリー"
        prevHref="/survey/dryvan/step10"
        nextHref="/survey/dryvan/step12"
        nextLabel="次へ（取引関係）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q27HighwayFerryRates />
          <Q28HighwayRateBasis />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
