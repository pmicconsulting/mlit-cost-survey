"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q4DriverInfo } from "@/components/survey/questions";

export default function DryvanStep2Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={2}
        stepTitle="運転者情報"
        prevHref="/survey/dryvan/step1"
        nextHref="/survey/dryvan/step3"
        nextLabel="次へ（確認事項）"
      >
        <Q4DriverInfo />
      </SurveyLayout>
    </SurveyProvider>
  );
}
