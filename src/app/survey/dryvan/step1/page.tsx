"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q2VehicleCount, Q3VehicleDetails } from "@/components/survey/questions";

export default function DryvanStep1Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={6}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={1}
        stepTitle="車両情報"
        nextHref="/survey/dryvan/step2"
        nextLabel="次へ（運転者情報）"
      >
        <Q2VehicleCount />
        <Q3VehicleDetails />
      </SurveyLayout>
    </SurveyProvider>
  );
}
