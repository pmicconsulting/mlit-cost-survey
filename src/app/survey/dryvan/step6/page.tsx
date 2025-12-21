"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q16BusinessInvestment } from "@/components/survey/questions";

export default function DryvanStep6Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={6}
        stepTitle="事業継続投資"
        prevHref="/survey/dryvan/step5"
        nextHref="/survey/dryvan/confirm"
        nextLabel="確認画面へ"
        isLastStep
      >
        <Q16BusinessInvestment />
      </SurveyLayout>
    </SurveyProvider>
  );
}
