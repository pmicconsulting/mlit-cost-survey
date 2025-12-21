"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q21WaitingTimeFees,
  Q22PreDesignatedWaiting,
} from "@/components/survey/questions";

export default function DryvanStep9Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={9}
        stepTitle="待機時間料"
        prevHref="/survey/dryvan/step8"
        nextHref="/survey/dryvan/step10"
        nextLabel="次へ（燃料サーチャージ）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q21WaitingTimeFees />
          <Q22PreDesignatedWaiting />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
