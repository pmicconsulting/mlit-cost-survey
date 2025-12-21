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
      description="直近の決算月から過去２年間に、災害等の影響による営業収益・費用の一時的かつ大きな変動がありましたか。（該当するもの１つ選択）"
      icon={CloudLightning}
      iconBgColor="bg-purple-100"
      iconColor="text-purple-600"
      value={data.hasDisasterImpact}
      onChange={(value) => update({ hasDisasterImpact: value })}
      className={className}
    />
  );
}
