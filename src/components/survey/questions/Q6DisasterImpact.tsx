"use client";

import { CloudLightning } from "lucide-react";
import { useQ6 } from "../SurveyContext";
import { RadioQuestion } from "./RadioQuestion";

interface Q6DisasterImpactProps {
  className?: string;
}

export function Q6DisasterImpact({ className = "" }: Q6DisasterImpactProps) {
  const { data, update } = useQ6();

  return (
    <RadioQuestion
      questionNumber="q6"
      title="設問6"
      description="過去2年間に自然災害等により事業に大きな影響がありましたか？"
      icon={CloudLightning}
      iconBgColor="bg-purple-100"
      iconColor="text-purple-600"
      value={data.hasDisasterImpact}
      onChange={(value) => update({ hasDisasterImpact: value })}
      note="※ 対象となる災害：地震、台風、豪雨、洪水、土砂災害、大雪、その他自然災害"
      showNoteWhen="yes"
      className={className}
    />
  );
}
