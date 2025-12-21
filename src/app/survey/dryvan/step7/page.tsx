"use client";

import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { Q17AncillaryWorkFees } from "@/components/survey/questions";

export default function DryvanStep7Page() {
  return (
    <SurveyProvider surveyType="dryvan" totalSteps={17}>
      <SurveyLayout
        surveyType="dryvan"
        stepNumber={7}
        stepTitle="附帯作業料"
        prevHref="/survey/dryvan/step6"
        nextHref="/survey/dryvan/step8"
        nextLabel="次へ（積込・取卸）"
      >
        {/* セクションヘッダー */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
          料金収受実態調査（営業所単位）
        </div>
        <p className="text-sm text-gray-600 mb-4">
          設問17以降：営業所として、契約、料金収受等の実態をご回答ください。
          <br />
          個別ケースではなく、営業所全体の傾向をご回答下さい。
        </p>

        <Q17AncillaryWorkFees />
      </SurveyLayout>
    </SurveyProvider>
  );
}
