"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q45DistanceRange,
  Q46MainCargo,
  Q47CrewCount,
} from "@/components/survey/questions";

export default function SingleTruckStep2Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={2}
        stepTitle="運行概要"
        prevHref="/survey/single-truck/step1"
        nextHref="/survey/single-truck/step3"
        nextLabel="次へ（税金・保険）"
      >
        {/* セクションヘッダー */}
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          単車調査（1台ごと）
        </div>

        <div className="space-y-6">
          <Q45DistanceRange />
          <Q46MainCargo />
          <Q47CrewCount />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
