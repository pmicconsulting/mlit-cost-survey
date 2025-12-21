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
  Q17Data,
  Q18Data,
  Q19Data,
  Q20Data,
  Q21Data,
  Q22Data,
  Q23Data,
  Q24Data,
  Q25Data,
  Q26Data,
  Q27Data,
  Q28Data,
  Q29Data,
  Q30Data,
  Q31Data,
  Q32Data,
  Q33Data,
  Q34Data,
  Q35Data,
  Q36Data,
  Q37Data,
  Q38Data,
  Q39Data,
  // 単車調査 Q40-Q61
  Q40Data,
  Q41Data,
  Q42Data,
  Q43Data,
  Q44Data,
  Q45Data,
  Q46Data,
  Q47Data,
  Q48Data,
  Q49Data,
  Q50Data,
  Q51Data,
  Q52Data,
  Q53Data,
  Q54Data,
  Q55Data,
  Q56Data,
  Q57Data,
  Q58Data,
  Q59Data,
  Q60Data,
  Q61Data,
  // トラクター調査 Q62-Q82
  Q62Data,
  Q63Data,
  Q64Data,
  Q65Data,
  Q66Data,
  Q67Data,
  Q68Data,
  Q69Data,
  Q70Data,
  Q71Data,
  Q72Data,
  Q73Data,
  Q74Data,
  Q75Data,
  Q76Data,
  Q77Data,
  Q78Data,
  Q79Data,
  Q80Data,
  Q81Data,
  Q82Data,
  DriverMetrics,
  VehicleCounts,
  ANCILLARY_WORK_ITEMS,
  CANCELLATION_TIMINGS,
  DISTANCE_BANDS,
  DISCOUNT_ITEMS,
  SURCHARGE_ITEMS,
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

// Q17初期値生成
const createEmptyAncillaryWorkItem = () => ({
  selected: false,
  hourlyRate: "",
  includedInFare: false,
  lossAmount: "",
});

const createInitialQ17 = (): Q17Data => ({
  items: Object.fromEntries(
    ANCILLARY_WORK_ITEMS.map((item) => [item.id, createEmptyAncillaryWorkItem()])
  ),
  otherDescription: "",
  notPerforming: false,
});

// Q32初期値生成
const createInitialQ32 = (): Q32Data => ({
  rows: Object.fromEntries(
    CANCELLATION_TIMINGS.map((timing) => [
      timing.id,
      { useFixedAmount: false, useFareRatio: false, fixedAmount: "", fareRatio: "", frequency: "" },
    ])
  ),
});

// Q33初期値生成
const createInitialQ33 = (): Q33Data => ({
  rows: Object.fromEntries(
    DISTANCE_BANDS.map((band) => [
      band.id,
      { averageDistance: "", returnLoadRatio: "", returnFareRatio: "" },
    ])
  ),
});

// Q35初期値生成
const createInitialQ35 = (): Q35Data => ({
  items: Object.fromEntries(
    DISCOUNT_ITEMS.map((item) => [item.id, { selected: false, fixedAmount: "", percentage: "" }])
  ),
  otherDescription: "",
});

// Q36初期値生成
const createInitialQ36 = (): Q36Data => ({
  items: Object.fromEntries(
    SURCHARGE_ITEMS.map((item) => [item.id, { selected: false, fixedAmount: "", percentage: "" }])
  ),
  otherDescription: "",
});

// Q39初期値生成
const createInitialQ39 = (): Q39Data => ({
  rows: Array(5).fill(null).map(() => ({
    vehicleSize: "",
    actualDistance: "",
    constraintHours: "",
    constraintMinutes: "",
    averageFare: "",
    averageFee: "",
  })),
});

const createInitialFormData = (surveyType: SurveyType): SurveyFormData => ({
  surveyType,
  // Q2-Q16: 共通調査
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
  // Q17-Q39: 料金収受実態調査
  q17: createInitialQ17(),
  q18: {
    manualWork: { selected: false, hourlyRate: "" },
    mechanicalWork: { selected: false, hourlyRate: "" },
    notCollectedIncluded: false,
    notCollectedActually: false,
    notPerforming: false,
  },
  q19: { status: "" },
  q20: { status: "", hourlyRate: "" },
  q21: {
    separateCollection: { selected: false, hourlyRate: "" },
    includedInFare: { selected: false, hourlyRate: "" },
    notCollected: { selected: false, lossAmount: "" },
    unknown: false,
  },
  q22: {
    waitingNotCollected: { selected: false, maxHours: "" },
    waitingCollected: false,
    unknown: false,
  },
  q23: { hasFuelSurchargeNegotiation: "" },
  q24: { status: "", percentage: "" },
  q25: { basePrice: "", purchasePrice: "" },
  q26: {
    cooperative: false,
    gasStation: false,
    lorry: false,
    other: { selected: false, description: "" },
  },
  q27: { highwayRate: "", ferryRate: "" },
  q28: { basis: "" },
  q29: {
    directDeal: { selected: false, ratio: "" },
    firstTier: { selected: false, ratio: "" },
    secondTier: { selected: false, ratio: "" },
    thirdOrMore: { selected: false, ratio: "" },
    unknown: false,
  },
  q30: {
    addToShipper: false,
    deductFromPartner: false,
    notPerforming: false,
    unknown: false,
  },
  q31: {
    deductPercentage: { selected: false, value: "" },
    addPercentage: { selected: false, value: "" },
    deductFixed: { selected: false, value: "" },
    addFixed: { selected: false, value: "" },
  },
  q32: createInitialQ32(),
  q33: createInitialQ33(),
  q34: {
    isCollecting: false,
    calculationMethods: {
      hourly: { selected: false, rate: "" },
      distance: { selected: false, rate: "" },
      fareRatio: { selected: false, ratio: "" },
    },
    other: { selected: false, description: "" },
    notCollected: false,
    unknown: false,
  },
  q35: createInitialQ35(),
  q36: createInitialQ36(),
  q37: {
    weight: false,
    volume: false,
    quantity: false,
    weightAndVolume: false,
    pallet: false,
    other: { selected: false, description: "" },
  },
  q38: { averageLoadRate: "", mainCargoItems: "" },
  q39: createInitialQ39(),
  // Q40-Q61: 単車調査
  q40: { shape: "" },
  q41: {
    officeName: "",
    maxLoadCapacity: "",
    grossVehicleWeight: "",
    displacement: "",
    axleCount: "",
    registrationYear: "",
    plannedUsageYears: "",
  },
  q42: { method: "" },
  q43: {
    purchase: { condition: "", price: "" },
    lease: { condition: "", price: "", monthlyFee: "", contractYears: "", contractMonths: "", buyoutPrice: "" },
  },
  q44: { accessoryCost: "", digitalTacho: "", driveRecorder: "", asv: "", otherSafetyCost: "" },
  q45: { distanceRange: "" },
  q46: { mainCargo: "" },
  q47: { averageCrewCount: "" },
  q48: { environmentTax: "", vehicleTax: "", weightTax: "" },
  q49: { compulsoryInsurance: "", voluntaryInsurance: "" },
  q50: { fuelEfficiency: "" },
  q51: { oilUnitPrice: "", oilChangeVolume: "", oilChangeDistance: "", oilChangeLaborCost: "" },
  q52: { tireUnitPrice: "", tireCount: "", tireChangeLaborCost: "", tireChangeDistance: "" },
  q53: { ureaUnitPrice: "", ureaDistancePerLiter: "" },
  q54: { inspectionCost: "", maintenanceCost: "" },
  q55: { cargoHandlingSupplies: "", liftingEquipment: "", helmet: "", safetyClothing: "" },
  q56: { monthlyRevenue: "", highwayFee: "", ferryFee: "", relayFacilityFee: "", otherFee: "" },
  q57: { loadRate: "", totalDistance: "", actualDistance: "", workingDays: "", transportTonnage: "", dailyWorkingHours: "" },
  q58: { averageTransportDistance: "", averageRoundCount: "" },
  q59: { washingTime: "", washingCost: "" },
  q60: { specialPermitCost: "" },
  q61: {
    cargoItem: "",
    preDepartureTime: "",
    toLoadingLocationTime: "",
    toLoadingLocationDistance: "",
    loadingWaitTime: "",
    loadingAncillaryTime: "",
    loadingWorkTime: "",
    loadingWorker: "",
    loadingSecuringTime: "",
    transitTimeHours: "",
    transitTimeMinutes: "",
    transitDistance: "",
    unloadingWaitTime: "",
    unloadingWorkTime: "",
    unloadingWorker: "",
    unloadingAncillaryTime: "",
    returnToGarageTime: "",
    returnToGarageDistance: "",
    postArrivalTime: "",
  },
  // Q62-Q82: トラクター調査
  q62: { chassisTypes: [] },
  q63: {
    officeName: "",
    maxLoadCapacity: "",
    grossVehicleWeight: "",
    displacement: "",
    axleCount: "",
    registrationYear: "",
    plannedUsageYears: "",
  },
  q64: { method: "" },
  q65: {
    purchase: { condition: "", price: "" },
    lease: { condition: "", price: "", monthlyFee: "", contractYears: "", contractMonths: "", buyoutPrice: "" },
  },
  q66: { accessoryCost: "", digitalTacho: "", driveRecorder: "", asv: "", otherSafetyCost: "" },
  q67: { distanceRange: "" },
  q68: { averageCrewCount: "" },
  q69: { environmentTax: "", vehicleTax: "", weightTax: "" },
  q70: { compulsoryInsurance: "", voluntaryInsurance: "" },
  q71: { fuelEfficiency: "" },
  q72: { oilUnitPrice: "", oilChangeVolume: "", oilChangeDistance: "", oilChangeLaborCost: "" },
  q73: { tireUnitPrice: "", tireCount: "", tireChangeLaborCost: "", tireChangeDistance: "" },
  q74: { ureaUnitPrice: "", ureaDistancePerLiter: "" },
  q75: { inspectionCost: "", maintenanceCost: "" },
  q76: { cargoHandlingSupplies: "", liftingEquipment: "", helmet: "", safetyClothing: "" },
  q77: { monthlyRevenue: "", highwayFee: "", ferryFee: "", relayFacilityFee: "", otherFee: "" },
  q78: { loadRate: "", totalDistance: "", actualDistance: "", workingDays: "", transportTonnage: "", dailyWorkingHours: "" },
  q79: { averageTransportDistance: "", averageRoundCount: "" },
  q80: { washingTime: "", washingCost: "" },
  q81: { specialPermitCost: "" },
  q82: {
    cargoItem: "",
    preDepartureTime: "",
    toLoadingLocationTime: "",
    toLoadingLocationDistance: "",
    loadingWaitTime: "",
    loadingAncillaryTime: "",
    loadingWorkTime: "",
    loadingWorker: "",
    loadingSecuringTime: "",
    transitTimeHours: "",
    transitTimeMinutes: "",
    transitDistance: "",
    unloadingWaitTime: "",
    unloadingWorkTime: "",
    unloadingWorker: "",
    unloadingAncillaryTime: "",
    returnToGarageTime: "",
    returnToGarageDistance: "",
    postArrivalTime: "",
  },
});

// コンテキスト型
interface SurveyContextType {
  formData: SurveyFormData;
  currentStep: number;
  totalSteps: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // 更新関数 Q2-Q16
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

  // 更新関数 Q17-Q39
  updateQ17: (data: Partial<Q17Data>) => void;
  updateQ18: (data: Partial<Q18Data>) => void;
  updateQ19: (data: Partial<Q19Data>) => void;
  updateQ20: (data: Partial<Q20Data>) => void;
  updateQ21: (data: Partial<Q21Data>) => void;
  updateQ22: (data: Partial<Q22Data>) => void;
  updateQ23: (data: Partial<Q23Data>) => void;
  updateQ24: (data: Partial<Q24Data>) => void;
  updateQ25: (data: Partial<Q25Data>) => void;
  updateQ26: (data: Partial<Q26Data>) => void;
  updateQ27: (data: Partial<Q27Data>) => void;
  updateQ28: (data: Partial<Q28Data>) => void;
  updateQ29: (data: Partial<Q29Data>) => void;
  updateQ30: (data: Partial<Q30Data>) => void;
  updateQ31: (data: Partial<Q31Data>) => void;
  updateQ32: (data: Partial<Q32Data>) => void;
  updateQ33: (data: Partial<Q33Data>) => void;
  updateQ34: (data: Partial<Q34Data>) => void;
  updateQ35: (data: Partial<Q35Data>) => void;
  updateQ36: (data: Partial<Q36Data>) => void;
  updateQ37: (data: Partial<Q37Data>) => void;
  updateQ38: (data: Partial<Q38Data>) => void;
  updateQ39: (data: Partial<Q39Data>) => void;

  // 更新関数 Q40-Q61（単車調査）
  updateQ40: (data: Partial<Q40Data>) => void;
  updateQ41: (data: Partial<Q41Data>) => void;
  updateQ42: (data: Partial<Q42Data>) => void;
  updateQ43: (data: Partial<Q43Data>) => void;
  updateQ44: (data: Partial<Q44Data>) => void;
  updateQ45: (data: Partial<Q45Data>) => void;
  updateQ46: (data: Partial<Q46Data>) => void;
  updateQ47: (data: Partial<Q47Data>) => void;
  updateQ48: (data: Partial<Q48Data>) => void;
  updateQ49: (data: Partial<Q49Data>) => void;
  updateQ50: (data: Partial<Q50Data>) => void;
  updateQ51: (data: Partial<Q51Data>) => void;
  updateQ52: (data: Partial<Q52Data>) => void;
  updateQ53: (data: Partial<Q53Data>) => void;
  updateQ54: (data: Partial<Q54Data>) => void;
  updateQ55: (data: Partial<Q55Data>) => void;
  updateQ56: (data: Partial<Q56Data>) => void;
  updateQ57: (data: Partial<Q57Data>) => void;
  updateQ58: (data: Partial<Q58Data>) => void;
  updateQ59: (data: Partial<Q59Data>) => void;
  updateQ60: (data: Partial<Q60Data>) => void;
  updateQ61: (data: Partial<Q61Data>) => void;

  // 更新関数 Q62-Q82（トラクター調査）
  updateQ62: (data: Partial<Q62Data>) => void;
  updateQ63: (data: Partial<Q63Data>) => void;
  updateQ64: (data: Partial<Q64Data>) => void;
  updateQ65: (data: Partial<Q65Data>) => void;
  updateQ66: (data: Partial<Q66Data>) => void;
  updateQ67: (data: Partial<Q67Data>) => void;
  updateQ68: (data: Partial<Q68Data>) => void;
  updateQ69: (data: Partial<Q69Data>) => void;
  updateQ70: (data: Partial<Q70Data>) => void;
  updateQ71: (data: Partial<Q71Data>) => void;
  updateQ72: (data: Partial<Q72Data>) => void;
  updateQ73: (data: Partial<Q73Data>) => void;
  updateQ74: (data: Partial<Q74Data>) => void;
  updateQ75: (data: Partial<Q75Data>) => void;
  updateQ76: (data: Partial<Q76Data>) => void;
  updateQ77: (data: Partial<Q77Data>) => void;
  updateQ78: (data: Partial<Q78Data>) => void;
  updateQ79: (data: Partial<Q79Data>) => void;
  updateQ80: (data: Partial<Q80Data>) => void;
  updateQ81: (data: Partial<Q81Data>) => void;
  updateQ82: (data: Partial<Q82Data>) => void;

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
    // Q2-Q16
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
    // Q17-Q39
    updateQ17: createUpdater("q17"),
    updateQ18: createUpdater("q18"),
    updateQ19: createUpdater("q19"),
    updateQ20: createUpdater("q20"),
    updateQ21: createUpdater("q21"),
    updateQ22: createUpdater("q22"),
    updateQ23: createUpdater("q23"),
    updateQ24: createUpdater("q24"),
    updateQ25: createUpdater("q25"),
    updateQ26: createUpdater("q26"),
    updateQ27: createUpdater("q27"),
    updateQ28: createUpdater("q28"),
    updateQ29: createUpdater("q29"),
    updateQ30: createUpdater("q30"),
    updateQ31: createUpdater("q31"),
    updateQ32: createUpdater("q32"),
    updateQ33: createUpdater("q33"),
    updateQ34: createUpdater("q34"),
    updateQ35: createUpdater("q35"),
    updateQ36: createUpdater("q36"),
    updateQ37: createUpdater("q37"),
    updateQ38: createUpdater("q38"),
    updateQ39: createUpdater("q39"),
    // Q40-Q61: 単車調査
    updateQ40: createUpdater("q40"),
    updateQ41: createUpdater("q41"),
    updateQ42: createUpdater("q42"),
    updateQ43: createUpdater("q43"),
    updateQ44: createUpdater("q44"),
    updateQ45: createUpdater("q45"),
    updateQ46: createUpdater("q46"),
    updateQ47: createUpdater("q47"),
    updateQ48: createUpdater("q48"),
    updateQ49: createUpdater("q49"),
    updateQ50: createUpdater("q50"),
    updateQ51: createUpdater("q51"),
    updateQ52: createUpdater("q52"),
    updateQ53: createUpdater("q53"),
    updateQ54: createUpdater("q54"),
    updateQ55: createUpdater("q55"),
    updateQ56: createUpdater("q56"),
    updateQ57: createUpdater("q57"),
    updateQ58: createUpdater("q58"),
    updateQ59: createUpdater("q59"),
    updateQ60: createUpdater("q60"),
    updateQ61: createUpdater("q61"),
    // Q62-Q82: トラクター調査
    updateQ62: createUpdater("q62"),
    updateQ63: createUpdater("q63"),
    updateQ64: createUpdater("q64"),
    updateQ65: createUpdater("q65"),
    updateQ66: createUpdater("q66"),
    updateQ67: createUpdater("q67"),
    updateQ68: createUpdater("q68"),
    updateQ69: createUpdater("q69"),
    updateQ70: createUpdater("q70"),
    updateQ71: createUpdater("q71"),
    updateQ72: createUpdater("q72"),
    updateQ73: createUpdater("q73"),
    updateQ74: createUpdater("q74"),
    updateQ75: createUpdater("q75"),
    updateQ76: createUpdater("q76"),
    updateQ77: createUpdater("q77"),
    updateQ78: createUpdater("q78"),
    updateQ79: createUpdater("q79"),
    updateQ80: createUpdater("q80"),
    updateQ81: createUpdater("q81"),
    updateQ82: createUpdater("q82"),
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

// Q17-Q39: 料金収受実態調査
export function useQ17() {
  const { formData, updateQ17 } = useSurvey();
  return { data: formData.q17, update: updateQ17 };
}

export function useQ18() {
  const { formData, updateQ18 } = useSurvey();
  return { data: formData.q18, update: updateQ18 };
}

export function useQ19() {
  const { formData, updateQ19 } = useSurvey();
  return { data: formData.q19, update: updateQ19 };
}

export function useQ20() {
  const { formData, updateQ20 } = useSurvey();
  return { data: formData.q20, update: updateQ20 };
}

export function useQ21() {
  const { formData, updateQ21 } = useSurvey();
  return { data: formData.q21, update: updateQ21 };
}

export function useQ22() {
  const { formData, updateQ22 } = useSurvey();
  return { data: formData.q22, update: updateQ22 };
}

export function useQ23() {
  const { formData, updateQ23 } = useSurvey();
  return { data: formData.q23, update: updateQ23 };
}

export function useQ24() {
  const { formData, updateQ24 } = useSurvey();
  return { data: formData.q24, update: updateQ24 };
}

export function useQ25() {
  const { formData, updateQ25 } = useSurvey();
  return { data: formData.q25, update: updateQ25 };
}

export function useQ26() {
  const { formData, updateQ26 } = useSurvey();
  return { data: formData.q26, update: updateQ26 };
}

export function useQ27() {
  const { formData, updateQ27 } = useSurvey();
  return { data: formData.q27, update: updateQ27 };
}

export function useQ28() {
  const { formData, updateQ28 } = useSurvey();
  return { data: formData.q28, update: updateQ28 };
}

export function useQ29() {
  const { formData, updateQ29 } = useSurvey();
  return { data: formData.q29, update: updateQ29 };
}

export function useQ30() {
  const { formData, updateQ30 } = useSurvey();
  return { data: formData.q30, update: updateQ30 };
}

export function useQ31() {
  const { formData, updateQ31 } = useSurvey();
  return { data: formData.q31, update: updateQ31 };
}

export function useQ32() {
  const { formData, updateQ32 } = useSurvey();
  return { data: formData.q32, update: updateQ32 };
}

export function useQ33() {
  const { formData, updateQ33 } = useSurvey();
  return { data: formData.q33, update: updateQ33 };
}

export function useQ34() {
  const { formData, updateQ34 } = useSurvey();
  return { data: formData.q34, update: updateQ34 };
}

export function useQ35() {
  const { formData, updateQ35 } = useSurvey();
  return { data: formData.q35, update: updateQ35 };
}

export function useQ36() {
  const { formData, updateQ36 } = useSurvey();
  return { data: formData.q36, update: updateQ36 };
}

export function useQ37() {
  const { formData, updateQ37 } = useSurvey();
  return { data: formData.q37, update: updateQ37 };
}

export function useQ38() {
  const { formData, updateQ38 } = useSurvey();
  return { data: formData.q38, update: updateQ38 };
}

export function useQ39() {
  const { formData, updateQ39 } = useSurvey();
  return { data: formData.q39, update: updateQ39 };
}

// 単車調査用フック Q40-Q61
export function useQ40() {
  const { formData, updateQ40 } = useSurvey();
  return { data: formData.q40, update: updateQ40 };
}

export function useQ41() {
  const { formData, updateQ41 } = useSurvey();
  return { data: formData.q41, update: updateQ41 };
}

export function useQ42() {
  const { formData, updateQ42 } = useSurvey();
  return { data: formData.q42, update: updateQ42 };
}

export function useQ43() {
  const { formData, updateQ43 } = useSurvey();
  return { data: formData.q43, update: updateQ43 };
}

export function useQ44() {
  const { formData, updateQ44 } = useSurvey();
  return { data: formData.q44, update: updateQ44 };
}

export function useQ45() {
  const { formData, updateQ45 } = useSurvey();
  return { data: formData.q45, update: updateQ45 };
}

export function useQ46() {
  const { formData, updateQ46 } = useSurvey();
  return { data: formData.q46, update: updateQ46 };
}

export function useQ47() {
  const { formData, updateQ47 } = useSurvey();
  return { data: formData.q47, update: updateQ47 };
}

export function useQ48() {
  const { formData, updateQ48 } = useSurvey();
  return { data: formData.q48, update: updateQ48 };
}

export function useQ49() {
  const { formData, updateQ49 } = useSurvey();
  return { data: formData.q49, update: updateQ49 };
}

export function useQ50() {
  const { formData, updateQ50 } = useSurvey();
  return { data: formData.q50, update: updateQ50 };
}

export function useQ51() {
  const { formData, updateQ51 } = useSurvey();
  return { data: formData.q51, update: updateQ51 };
}

export function useQ52() {
  const { formData, updateQ52 } = useSurvey();
  return { data: formData.q52, update: updateQ52 };
}

export function useQ53() {
  const { formData, updateQ53 } = useSurvey();
  return { data: formData.q53, update: updateQ53 };
}

export function useQ54() {
  const { formData, updateQ54 } = useSurvey();
  return { data: formData.q54, update: updateQ54 };
}

export function useQ55() {
  const { formData, updateQ55 } = useSurvey();
  return { data: formData.q55, update: updateQ55 };
}

export function useQ56() {
  const { formData, updateQ56 } = useSurvey();
  return { data: formData.q56, update: updateQ56 };
}

export function useQ57() {
  const { formData, updateQ57 } = useSurvey();
  return { data: formData.q57, update: updateQ57 };
}

export function useQ58() {
  const { formData, updateQ58 } = useSurvey();
  return { data: formData.q58, update: updateQ58 };
}

export function useQ59() {
  const { formData, updateQ59 } = useSurvey();
  return { data: formData.q59, update: updateQ59 };
}

export function useQ60() {
  const { formData, updateQ60 } = useSurvey();
  return { data: formData.q60, update: updateQ60 };
}

export function useQ61() {
  const { formData, updateQ61 } = useSurvey();
  return { data: formData.q61, update: updateQ61 };
}

// トラクター調査用フック Q62-Q82
export function useQ62() {
  const { formData, updateQ62 } = useSurvey();
  return { data: formData.q62, update: updateQ62 };
}

export function useQ63() {
  const { formData, updateQ63 } = useSurvey();
  return { data: formData.q63, update: updateQ63 };
}

export function useQ64() {
  const { formData, updateQ64 } = useSurvey();
  return { data: formData.q64, update: updateQ64 };
}

export function useQ65() {
  const { formData, updateQ65 } = useSurvey();
  return { data: formData.q65, update: updateQ65 };
}

export function useQ66() {
  const { formData, updateQ66 } = useSurvey();
  return { data: formData.q66, update: updateQ66 };
}

export function useQ67() {
  const { formData, updateQ67 } = useSurvey();
  return { data: formData.q67, update: updateQ67 };
}

export function useQ68() {
  const { formData, updateQ68 } = useSurvey();
  return { data: formData.q68, update: updateQ68 };
}

export function useQ69() {
  const { formData, updateQ69 } = useSurvey();
  return { data: formData.q69, update: updateQ69 };
}

export function useQ70() {
  const { formData, updateQ70 } = useSurvey();
  return { data: formData.q70, update: updateQ70 };
}

export function useQ71() {
  const { formData, updateQ71 } = useSurvey();
  return { data: formData.q71, update: updateQ71 };
}

export function useQ72() {
  const { formData, updateQ72 } = useSurvey();
  return { data: formData.q72, update: updateQ72 };
}

export function useQ73() {
  const { formData, updateQ73 } = useSurvey();
  return { data: formData.q73, update: updateQ73 };
}

export function useQ74() {
  const { formData, updateQ74 } = useSurvey();
  return { data: formData.q74, update: updateQ74 };
}

export function useQ75() {
  const { formData, updateQ75 } = useSurvey();
  return { data: formData.q75, update: updateQ75 };
}

export function useQ76() {
  const { formData, updateQ76 } = useSurvey();
  return { data: formData.q76, update: updateQ76 };
}

export function useQ77() {
  const { formData, updateQ77 } = useSurvey();
  return { data: formData.q77, update: updateQ77 };
}

export function useQ78() {
  const { formData, updateQ78 } = useSurvey();
  return { data: formData.q78, update: updateQ78 };
}

export function useQ79() {
  const { formData, updateQ79 } = useSurvey();
  return { data: formData.q79, update: updateQ79 };
}

export function useQ80() {
  const { formData, updateQ80 } = useSurvey();
  return { data: formData.q80, update: updateQ80 };
}

export function useQ81() {
  const { formData, updateQ81 } = useSurvey();
  return { data: formData.q81, update: updateQ81 };
}

export function useQ82() {
  const { formData, updateQ82 } = useSurvey();
  return { data: formData.q82, update: updateQ82 };
}
