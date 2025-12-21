// 調査票の種類
export type SurveyType =
  | "dryvan"           // ドライバン等
  | "refrigerated"     // 冷蔵車・冷凍車
  | "dump"             // ダンプ車
  | "tank"             // タンク車
  | "bulk"             // バルク車
  | "container"        // コンテナ輸送車
  | "concrete_mixer"   // コンクリートミキサー車
  | "truck_crane"      // トラック搭載型クレーン車
  | "waste"            // 一般廃棄物輸送車
  | "car_carrier"      // 車積載車
  | "heavy"            // 重量物輸送車
  | "other";           // その他

export const SURVEY_TYPE_LABELS: Record<SurveyType, string> = {
  dryvan: "ドライバン等",
  refrigerated: "冷蔵車・冷凍車",
  dump: "ダンプ車",
  tank: "タンク車",
  bulk: "バルク車",
  container: "コンテナ輸送車",
  concrete_mixer: "コンクリートミキサー車",
  truck_crane: "トラック搭載型クレーン車",
  waste: "一般廃棄物輸送車",
  car_carrier: "車積載車（キャリアカー）",
  heavy: "重量物輸送車",
  other: "その他",
};

// 車両サイズ
export const VEHICLE_SIZES = [
  { id: "tractor", label: "牽引車", subLabel: "（ヘッド）" },
  { id: "trailer", label: "被牽引車", subLabel: "（シャーシ）" },
  { id: "large", label: "大型", subLabel: "（10tクラス）" },
  { id: "medium", label: "中型", subLabel: "（4tクラス）" },
  { id: "small", label: "小型", subLabel: "（2tクラス）" },
] as const;

export type VehicleSizeId = typeof VEHICLE_SIZES[number]["id"];

// 車型（ドライバン等）
export const DRYVAN_VEHICLE_TYPES = [
  { id: "van_body", label: "バンボディ" },
  { id: "wing_body", label: "ウィングボディ" },
  { id: "flat_body", label: "平ボディ" },
  { id: "covered_wing", label: "幌ウィング" },
  { id: "van_trailer", label: "バン型（被牽引車）" },
] as const;

// 車型（ドライバン等以外）
export const NON_DRYVAN_VEHICLE_TYPES = [
  { id: "refrigerated", label: "冷蔵車・冷凍車" },
  { id: "dump", label: "ダンプ車" },
  { id: "tank", label: "タンク車" },
  { id: "bulk", label: "バルク車" },
  { id: "container", label: "コンテナ輸送車" },
  { id: "concrete_mixer", label: "コンクリートミキサー車" },
  { id: "truck_crane", label: "トラック搭載型クレーン車" },
  { id: "waste", label: "一般廃棄物輸送車（塵芥車、衛生車等）" },
  { id: "car_carrier", label: "車積載車（キャリアカー）" },
  { id: "heavy", label: "重量物輸送車" },
  { id: "other", label: "その他" },
] as const;

// 運転者カテゴリ
export const DRIVER_CATEGORIES = [
  { id: "tractor", label: "牽引車", subLabel: "（ヘッド）" },
  { id: "large", label: "大型車", subLabel: "（10tクラス）" },
  { id: "medium", label: "中型車", subLabel: "（4tクラス）" },
  { id: "small", label: "小型車", subLabel: "（2tクラス）" },
  { id: "other", label: "その他", subLabel: "" },
] as const;

export type DriverCategoryId = typeof DRIVER_CATEGORIES[number]["id"];

// 運転者指標
export const DRIVER_METRICS = [
  { id: "workDays", label: "月間平均労働日数", unit: "日", min: 0, max: 31 },
  { id: "workHours", label: "月間平均労働時間", unit: "時間", min: 0, max: 400 },
  { id: "monthlyWage", label: "月間平均賃金総額", unit: "万円", min: 0, max: 999 },
  { id: "averageAge", label: "平均年齢", unit: "歳", min: 18, max: 80 },
] as const;

export type DriverMetricId = typeof DRIVER_METRICS[number]["id"];

// ============================================
// 回答データ型
// ============================================

// Q2: 保有車両台数
export interface Q2Data {
  totalVehicles: string;
}

// Q3: 車両詳細
export interface VehicleCounts {
  tractor: string;
  trailer: string;
  large: string;
  medium: string;
  small: string;
}

export interface Q3Data {
  dryvan: {
    vehicles: VehicleCounts;
    vehicleTypes: string[];
  };
  nonDryvan: {
    vehicles: VehicleCounts;
    vehicleTypes: string[];
    vehicleTypesOther: string;
  };
}

// Q4: 運転者情報
export interface DriverMetrics {
  workDays: string;
  workHours: string;
  monthlyWage: string;
  averageAge: string;
}

export interface Q4Data {
  driverCount: Record<DriverCategoryId, string>;
  drivers: Record<DriverCategoryId, DriverMetrics>;
}

// Q5: 行政処分
export interface Q5Data {
  hasAdministrativePenalty: string; // "yes" | "no" | "unknown"
}

// Q6: 災害影響
export interface Q6Data {
  hasDisasterImpact: string; // "yes" | "no" | "unknown"
}

// Q7: 事業変動
export interface Q7Data {
  businessChanges: string[]; // 複数選択
}

// Q8-Q11: 財務確認（ラジオ）
export interface Q8Data {
  hasFiscalYearChange: string;
}

export interface Q9Data {
  hasOperatingProfit: string;
}

export interface Q10Data {
  hasConsecutiveLoss: string;
}

export interface Q11Data {
  hasExcessDebt: string;
}

// Q12: 損益明細表
export interface Q12Data {
  revenue: string;
  facilityUsageFee: string;
  facilityTax: string;
  accidentCompensation: string;
  otherExpenses: string;
  subcontractCost: string;
  adminExpenses: string;
  operatingExpenses: string;
  operatingIncome: string;
  ordinaryIncome: string;
}

// Q13: P/L
export interface Q13Data {
  salesRevenue: string;
  costOfSales: string;
  operatingProfit: string;
}

// Q14: 税理士関与
export interface Q14Data {
  hasTaxAccountant: string;
}

// Q15: 安全経費
export interface SafetyItem {
  checked: boolean;
  hours: string;
  amount: string;
}

export interface Q15Data {
  items: Record<string, SafetyItem>;
  otherDescription: string;
}

// Q16: 事業投資
export interface InvestmentCategoryData {
  enabled: boolean;
  percentage: string;
  amount: string;
  selectedItems: string[];
  otherText: string;
}

export interface Q16Data {
  categories: Record<string, InvestmentCategoryData>;
}

// 全回答データ
export interface SurveyFormData {
  surveyType: SurveyType;
  q2: Q2Data;
  q3: Q3Data;
  q4: Q4Data;
  q5: Q5Data;
  q6: Q6Data;
  q7: Q7Data;
  q8: Q8Data;
  q9: Q9Data;
  q10: Q10Data;
  q11: Q11Data;
  q12: Q12Data;
  q13: Q13Data;
  q14: Q14Data;
  q15: Q15Data;
  q16: Q16Data;
}

// ステップ設定
export interface StepConfig {
  id: string;
  title: string;
  questions: string[]; // e.g., ["q2", "q3"]
  path: string;
}

// 調査票タイプ別のステップ設定
export type SurveyStepsConfig = StepConfig[];
