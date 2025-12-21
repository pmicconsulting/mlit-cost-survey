"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q67TractorDistanceRange,
  Q68TractorCrewCount,
} from "@/components/survey/questions";

export default function TractorStep2Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={2}
        stepTitle="運行概要"
        prevHref="/survey/tractor/step1"
        nextHref="/survey/tractor/step3"
        nextLabel="次へ（税金・保険）"
      >
        {/* セクションヘッダー */}
        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          トラクター調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q67TractorDistanceRange />
          <Q68TractorCrewCount />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
