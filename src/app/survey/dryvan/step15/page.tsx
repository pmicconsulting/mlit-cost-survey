"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q35DiscountFees,
  Q36SurchargeFees,
} from "@/components/survey/questions";

export default function DryvanStep15Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={15}
        stepTitle="割引・割増料金"
        prevHref="/survey/dryvan/step14"
        nextHref="/survey/dryvan/step16"
        nextLabel="次へ（個建運賃）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q35DiscountFees />
          <Q36SurchargeFees />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
