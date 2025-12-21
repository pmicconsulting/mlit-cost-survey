"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q12FinancialStatement, Q13PLData, Q14TaxAccountant } from "@/components/survey/questions";

export default function DryvanStep4Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={4}
        stepTitle="財務データ入力"
        prevHref="/survey/dryvan/step3"
        nextHref="/survey/dryvan/step5"
        nextLabel="次へ（安全経費）"
      >
        <Q12FinancialStatement />
        <Q13PLData />
        <Q14TaxAccountant />
      </SurveyLayout>
    </SurveyProvider>
  );
}
