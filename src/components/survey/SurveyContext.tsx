"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  SurveyType,
  SurveyFormData,
  Q2Data,
  Q3Data,
  Q4Data,
  Q5Data,
  Q6Data,
  Q7Data,
  Q8Data,
  Q9Data,
  Q10Data,
  Q11Data,
  Q12Data,
  Q13Data,
  Q14Data,
  Q15Data,
  Q16Data,
  DriverMetrics,
  VehicleCounts,
} from "./types";

// 初期値
const emptyVehicleCounts: VehicleCounts = {
  tractor: "",
  trailer: "",
  large: "",
  medium: "",
  small: "",
};

const emptyDriverMetrics: DriverMetrics = {
  workDays: "",
  workHours: "",
  monthlyWage: "",
  averageAge: "",
};

const createInitialFormData = (surveyType: SurveyType): SurveyFormData => ({
  surveyType,
  q2: { totalVehicles: "" },
  q3: {
    dryvan: { vehicles: { ...emptyVehicleCounts }, vehicleTypes: [] },
    nonDryvan: { vehicles: { ...emptyVehicleCounts }, vehicleTypes: [], vehicleTypesOther: "" },
  },
  q4: {
    driverCount: { tractor: "", large: "", medium: "", small: "", other: "" },
    drivers: {
      tractor: { ...emptyDriverMetrics },
      large: { ...emptyDriverMetrics },
      medium: { ...emptyDriverMetrics },
      small: { ...emptyDriverMetrics },
      other: { ...emptyDriverMetrics },
    },
  },
  q5: { hasAdministrativePenalty: "" },
  q6: { hasDisasterImpact: "" },
  q7: { businessChanges: [] },
  q8: { hasFiscalYearChange: "" },
  q9: { hasOperatingProfit: "" },
  q10: { hasConsecutiveLoss: "" },
  q11: { hasExcessDebt: "" },
  q12: {
    revenue: "",
    facilityUsageFee: "",
    facilityTax: "",
    accidentCompensation: "",
    otherExpenses: "",
    subcontractCost: "",
    adminExpenses: "",
    operatingExpenses: "",
    operatingIncome: "",
    ordinaryIncome: "",
  },
  q13: { salesRevenue: "", costOfSales: "", operatingProfit: "" },
  q14: { hasTaxAccountant: "" },
  q15: { items: {}, otherDescription: "" },
  q16: { categories: {} },
});

// コンテキスト型
interface SurveyContextType {
  formData: SurveyFormData;
  currentStep: number;
  totalSteps: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // 更新関数
  updateQ2: (data: Partial<Q2Data>) => void;
  updateQ3: (data: Partial<Q3Data>) => void;
  updateQ4: (data: Partial<Q4Data>) => void;
  updateQ5: (data: Partial<Q5Data>) => void;
  updateQ6: (data: Partial<Q6Data>) => void;
  updateQ7: (data: Partial<Q7Data>) => void;
  updateQ8: (data: Partial<Q8Data>) => void;
  updateQ9: (data: Partial<Q9Data>) => void;
  updateQ10: (data: Partial<Q10Data>) => void;
  updateQ11: (data: Partial<Q11Data>) => void;
  updateQ12: (data: Partial<Q12Data>) => void;
  updateQ13: (data: Partial<Q13Data>) => void;
  updateQ14: (data: Partial<Q14Data>) => void;
  updateQ15: (data: Partial<Q15Data>) => void;
  updateQ16: (data: Partial<Q16Data>) => void;

  // ナビゲーション
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // 保存
  saveToLocal: () => void;
  loadFromLocal: () => boolean;
  clearLocal: () => void;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

// ストレージキー生成
const getStorageKey = (surveyType: SurveyType) => `survey_${surveyType}_draft`;

// Provider
interface SurveyProviderProps {
  children: ReactNode;
  surveyType: SurveyType;
  totalSteps?: number;
}

export function SurveyProvider({ children, surveyType, totalSteps = 6 }: SurveyProviderProps) {
  const [formData, setFormData] = useState<SurveyFormData>(() => createInitialFormData(surveyType));
  const [currentStep, setCurrentStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ローカルストレージから読み込み
  const loadFromLocal = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    const key = getStorageKey(surveyType);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData({ ...createInitialFormData(surveyType), ...parsed.formData });
        setCurrentStep(parsed.currentStep || 1);
        setLastSaved(parsed.lastSaved ? new Date(parsed.lastSaved) : null);
        return true;
      } catch (e) {
        console.error("Failed to load survey data:", e);
      }
    }
    return false;
  }, [surveyType]);

  // ローカルストレージに保存
  const saveToLocal = useCallback(() => {
    if (typeof window === "undefined") return;
    setIsSaving(true);
    const key = getStorageKey(surveyType);
    const now = new Date();
    localStorage.setItem(
      key,
      JSON.stringify({
        formData,
        currentStep,
        lastSaved: now.toISOString(),
      })
    );
    setLastSaved(now);
    setIsDirty(false);
    setIsSaving(false);
  }, [formData, currentStep, surveyType]);

  // ローカルストレージをクリア
  const clearLocal = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = getStorageKey(surveyType);
    localStorage.removeItem(key);
    setFormData(createInitialFormData(surveyType));
    setCurrentStep(1);
    setLastSaved(null);
    setIsDirty(false);
  }, [surveyType]);

  // 初回読み込み
  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  // 自動保存（5秒ごと、変更がある場合）
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      saveToLocal();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isDirty, saveToLocal]);

  // 汎用更新関数
  const createUpdater = <K extends keyof SurveyFormData>(key: K) => {
    return (data: Partial<SurveyFormData[K]>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: { ...(prev[key] as object), ...(data as object) },
      }));
      setIsDirty(true);
    };
  };

  // ナビゲーション
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const value: SurveyContextType = {
    formData,
    currentStep,
    totalSteps,
    isDirty,
    isSaving,
    lastSaved,
    updateQ2: createUpdater("q2"),
    updateQ3: createUpdater("q3"),
    updateQ4: createUpdater("q4"),
    updateQ5: createUpdater("q5"),
    updateQ6: createUpdater("q6"),
    updateQ7: createUpdater("q7"),
    updateQ8: createUpdater("q8"),
    updateQ9: createUpdater("q9"),
    updateQ10: createUpdater("q10"),
    updateQ11: createUpdater("q11"),
    updateQ12: createUpdater("q12"),
    updateQ13: createUpdater("q13"),
    updateQ14: createUpdater("q14"),
    updateQ15: createUpdater("q15"),
    updateQ16: createUpdater("q16"),
    setCurrentStep,
    nextStep,
    prevStep,
    saveToLocal,
    loadFromLocal,
    clearLocal,
  };

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

// カスタムフック
export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
}

// 個別設問用フック
export function useQ2() {
  const { formData, updateQ2 } = useSurvey();
  return { data: formData.q2, update: updateQ2 };
}

export function useQ3() {
  const { formData, updateQ3 } = useSurvey();
  return { data: formData.q3, update: updateQ3 };
}

export function useQ4() {
  const { formData, updateQ4 } = useSurvey();
  return { data: formData.q4, update: updateQ4 };
}

export function useQ5() {
  const { formData, updateQ5 } = useSurvey();
  return { data: formData.q5, update: updateQ5 };
}

export function useQ6() {
  const { formData, updateQ6 } = useSurvey();
  return { data: formData.q6, update: updateQ6 };
}

export function useQ7() {
  const { formData, updateQ7 } = useSurvey();
  return { data: formData.q7, update: updateQ7 };
}

export function useQ8() {
  const { formData, updateQ8 } = useSurvey();
  return { data: formData.q8, update: updateQ8 };
}

export function useQ9() {
  const { formData, updateQ9 } = useSurvey();
  return { data: formData.q9, update: updateQ9 };
}

export function useQ10() {
  const { formData, updateQ10 } = useSurvey();
  return { data: formData.q10, update: updateQ10 };
}

export function useQ11() {
  const { formData, updateQ11 } = useSurvey();
  return { data: formData.q11, update: updateQ11 };
}

export function useQ12() {
  const { formData, updateQ12 } = useSurvey();
  return { data: formData.q12, update: updateQ12 };
}

export function useQ13() {
  const { formData, updateQ13 } = useSurvey();
  return { data: formData.q13, update: updateQ13 };
}

export function useQ14() {
  const { formData, updateQ14 } = useSurvey();
  return { data: formData.q14, update: updateQ14 };
}

export function useQ15() {
  const { formData, updateQ15 } = useSurvey();
  return { data: formData.q15, update: updateQ15 };
}

export function useQ16() {
  const { formData, updateQ16 } = useSurvey();
  return { data: formData.q16, update: updateQ16 };
}
