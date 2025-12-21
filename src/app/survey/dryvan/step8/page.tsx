"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q18LoadingUnloadingFees,
  Q19MultipleLocations,
  Q20StandbyWorkFees,
} from "@/components/survey/questions";

export default function DryvanStep8Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={8}
        stepTitle="積込・取卸作業"
        prevHref="/survey/dryvan/step7"
        nextHref="/survey/dryvan/step9"
        nextLabel="次へ（待機時間）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q18LoadingUnloadingFees />
          <Q19MultipleLocations />
          <Q20StandbyWorkFees />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
