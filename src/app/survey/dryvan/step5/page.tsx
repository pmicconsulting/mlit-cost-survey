"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q15SafetyExpenses } from "@/components/survey/questions";

export default function DryvanStep5Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={5}
        stepTitle="安全確保経費"
        prevHref="/survey/dryvan/step4"
        nextHref="/survey/dryvan/step6"
        nextLabel="次へ（事業投資）"
      >
        <Q15SafetyExpenses />
      </SurveyLayout>
    </SurveyProvider>
  );
}
