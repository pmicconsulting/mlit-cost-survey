"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import {
  Q5AdministrativePenalty,
  Q6DisasterImpact,
  Q7BusinessChanges,
  Q8FiscalYearChange,
  Q9OperatingProfit,
  Q10ConsecutiveLoss,
  Q11ExcessDebt,
} from "@/components/survey/questions";

export default function DryvanStep3Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={3}
        stepTitle="確認事項・財務状況"
        prevHref="/survey/dryvan/step2"
        nextHref="/survey/dryvan/step4"
        nextLabel="次へ（財務データ）"
      >
        {/* セクション: 確認事項 */}
        <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-bold -mb-2">
          確認事項
        </div>
        <Q5AdministrativePenalty />
        <Q6DisasterImpact />

        {/* セクション: 財務状況 */}
        <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-bold -mb-2 mt-8">
          財務状況に関する設問
        </div>
        <Q7BusinessChanges />
        <Q8FiscalYearChange />
        <Q9OperatingProfit />
        <Q10ConsecutiveLoss />
        <Q11ExcessDebt />
      </SurveyLayout>
    </SurveyProvider>
  );
}
