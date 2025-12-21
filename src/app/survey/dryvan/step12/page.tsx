"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q29TransactionTiers,
  Q30CharterFeePayment,
  Q31CharterFeeLevel,
} from "@/components/survey/questions";

export default function DryvanStep12Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={12}
        stepTitle="取引関係"
        prevHref="/survey/dryvan/step11"
        nextHref="/survey/dryvan/step13"
        nextLabel="次へ（キャンセル料）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>

        <div className="space-y-6">
          <Q29TransactionTiers />
          <Q30CharterFeePayment />
          <Q31CharterFeeLevel />
        </div>
      </SurveyLayout>
    </SurveyProvider>
  );
}
