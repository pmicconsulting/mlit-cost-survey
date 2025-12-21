"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q33DistanceBands,
  Q34EmptyRunFees,
} from "@/components/survey/questions";

export default function DryvanStep14Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={14}
        stepTitle="運行距離帯・空車回送"
        prevHref="/survey/dryvan/step13"
        nextHref="/survey/dryvan/step15"
        nextLabel="次へ（割引・割増）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q33DistanceBands />
          <Q34EmptyRunFees />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
