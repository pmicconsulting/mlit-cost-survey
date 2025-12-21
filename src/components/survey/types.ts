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

// ============================================
// Q17-Q39: 料金収受実態調査（営業所単位）
// ============================================

// Q17: 附帯作業料の収受実態
export const ANCILLARY_WORK_ITEMS = [
  { id: "picking", label: "ピッキング、荷揃え作業" },
  { id: "seal", label: "シール貼付作業" },
  { id: "installation", label: "家電、機械等の設置、据付作業" },
  { id: "warehouse", label: "倉庫格納作業（棚入れ含む）" },
  { id: "collection", label: "代金回収作業" },
  { id: "pallet_return", label: "空パレット、空ラック等の回収作業" },
  { id: "cleaning", label: "清掃作業、梱包資材の回収作業" },
  { id: "inspection", label: "数量検品作業（品質チェックも含む）" },
  { id: "other", label: "その他" },
] as const;

export interface AncillaryWorkItem {
  selected: boolean;
  hourlyRate: string;         // 1時間当たり収受額
  includedInFare: boolean;    // 運賃に含まれている
  lossAmount: string;         // 収入損失額
}

export interface Q17Data {
  items: Record<string, AncillaryWorkItem>;
  otherDescription: string;   // その他の説明
  notPerforming: boolean;     // 附帯作業を自社で行っていない
}

// Q18: 積込・取卸作業料の収受実態
export interface Q18Data {
  manualWork: { selected: boolean; hourlyRate: string };      // 手荷役作業
  mechanicalWork: { selected: boolean; hourlyRate: string };  // フォーク・クレーン等
  notCollectedIncluded: boolean;   // 運賃に含まれている
  notCollectedActually: boolean;   // 実質的に収受できていない
  notPerforming: boolean;          // 自社で行っていない
}

// Q19: 複数箇所での収受実態
export type Q19Status =
  | "each_location"      // それぞれの箇所で収受
  | "included_in_one"    // 1箇所に含まれている
  | "included_in_fare"   // 運賃に含まれている
  | "not_collected"      // 実質的に収受できていない
  | "not_performing"     // 自社で行っていない
  | "";

export interface Q19Data {
  status: Q19Status;
}

// Q20: 運転者立会い・積付作業の時間費用
export type Q20Status =
  | "collecting"         // 料金を収受
  | "included_in_fare"   // 運賃に含めて収受
  | "not_collected"      // 実質的に収受できていない
  | "unknown"            // 把握していない
  | "";

export interface Q20Data {
  status: Q20Status;
  hourlyRate: string;    // status="collecting"時のみ
}

// Q21: 荷待ち等の待機時間料
export interface Q21Data {
  separateCollection: { selected: boolean; hourlyRate: string };  // 別建てで収受
  includedInFare: { selected: boolean; hourlyRate: string };      // 運賃に含めて収受
  notCollected: { selected: boolean; lossAmount: string };        // 実質的に収受できていない
  unknown: boolean;                                                // 把握していない
}

// Q22: 指定時間前の待機時間
export interface Q22Data {
  waitingNotCollected: { selected: boolean; maxHours: string };  // 発生するが収受できない
  waitingCollected: boolean;                                      // 発生し収受している
  unknown: boolean;                                               // 把握していない
}

// Q23: 燃料サーチャージ交渉
export type YesNoUnknown = "yes" | "no" | "unknown" | "";

export interface Q23Data {
  hasFuelSurchargeNegotiation: YesNoUnknown;
}

// Q24: 燃料サーチャージ導入
export type Q24Status = "introduced" | "not_introduced" | "unknown" | "";

export interface Q24Data {
  status: Q24Status;
  percentage: string;  // introduced時のみ
}

// Q25: 燃料サーチャージ価格
export interface Q25Data {
  basePrice: string;      // 基準価格 円/L
  purchasePrice: string;  // 購入価格 円/L
}

// Q26: 燃料調達方法
export interface Q26Data {
  cooperative: boolean;    // 協同組合購入
  gasStation: boolean;     // スタンド購入
  lorry: boolean;          // ローリー調達（インタンク）
  other: { selected: boolean; description: string };
}

// Q27: 高速道路・フェリー利用料金収受率
export interface Q27Data {
  highwayRate: string;  // 高速道路収受率 %
  ferryRate: string;    // フェリー収受率 %
}

// Q28: 高速道路利用料金基準
export type Q28Basis = "basic" | "time_discount" | "volume_discount" | "";

export interface Q28Data {
  basis: Q28Basis;
}

// Q29: 取引次数と比率
export interface TransactionTier {
  selected: boolean;
  ratio: string;  // 割（1-10）
}

export interface Q29Data {
  directDeal: TransactionTier;   // 真荷主と直取引
  firstTier: TransactionTier;    // 1次請け
  secondTier: TransactionTier;   // 2次請け
  thirdOrMore: TransactionTier;  // 3次請け以上
  unknown: boolean;
}

// Q30: 利用運送手数料の請求・支払い
export interface Q30Data {
  addToShipper: boolean;           // 荷主等に請求
  deductFromPartner: boolean;      // 協力会社等から差し引き
  notPerforming: boolean;          // 傭車手配を行っていない
  unknown: boolean;                // 把握していない
}

// Q31: 利用運送手数料の水準
export interface CharterFeeLevel {
  selected: boolean;
  value: string;  // % or 円
}

export interface Q31Data {
  deductPercentage: CharterFeeLevel;   // 運賃に一定率を乗じて差し引き
  addPercentage: CharterFeeLevel;      // 運賃に一定率を乗じて加算
  deductFixed: CharterFeeLevel;        // 定額を差し引き
  addFixed: CharterFeeLevel;           // 定額を加算
}

// Q32: キャンセル料
export const CANCELLATION_TIMINGS = [
  { id: "day_after_departure", label: "輸送当日：出庫後" },
  { id: "day_before_departure", label: "輸送当日：出庫前" },
  { id: "one_day_before", label: "輸送前日" },
  { id: "two_days_before", label: "輸送２日前" },
  { id: "three_days_before", label: "輸送３日前" },
  { id: "four_days_before", label: "輸送４日前" },
] as const;

export interface CancellationRow {
  useFixedAmount: boolean;
  useFareRatio: boolean;
  fixedAmount: string;
  fareRatio: string;
  frequency: string;  // キャンセル頻度 %
}

export interface Q32Data {
  rows: Record<string, CancellationRow>;
}

// Q33: 運行距離帯別
export const DISTANCE_BANDS = [
  { id: "short", label: "近距離帯", subLabel: "(200km未満)" },
  { id: "medium", label: "中距離帯", subLabel: "(200km以上～450km未満)" },
  { id: "long", label: "長距離帯", subLabel: "(450km以上)" },
] as const;

export interface DistanceBandRow {
  averageDistance: string;      // 平均運行距離 km
  returnLoadRatio: string;      // 復荷確保割合（割）
  returnFareRatio: string;      // 復荷運賃水準（割）
}

export interface Q33Data {
  rows: Record<string, DistanceBandRow>;
}

// Q34: 空車走行回送料金
export interface Q34Data {
  isCollecting: boolean;
  calculationMethods: {
    hourly: { selected: boolean; rate: string };      // 所要時間から計算 円/時間
    distance: { selected: boolean; rate: string };    // 走行距離から計算 円/km
    fareRatio: { selected: boolean; ratio: string };  // 往路運賃比率 割
  };
  other: { selected: boolean; description: string };
  notCollected: boolean;
  unknown: boolean;
}

// Q35: 割引料金
export const DISCOUNT_ITEMS = [
  { id: "long_term", label: "長期契約割引" },
  { id: "round_trip", label: "往復割引" },
  { id: "monthly", label: "月極割引（月間で、一定日数以上の稼働で割引）" },
  { id: "consolidation", label: "積合せ割引（積合せする場合、割引）" },
  { id: "volume", label: "積載個数割引（個建運賃で一定数量以上を割引）" },
  { id: "other", label: "その他" },
] as const;

export interface FeeItem {
  selected: boolean;
  fixedAmount: string;  // 定額 円
  percentage: string;   // 割引/割増率 %
}

export interface Q35Data {
  items: Record<string, FeeItem>;
  otherDescription: string;
}

// Q36: 割増料金
export const SURCHARGE_ITEMS = [
  { id: "night_early", label: "深夜・早朝割増料" },
  { id: "holiday", label: "休日割増料" },
  { id: "express", label: "速達割増料（到着時間を前倒しする割増）" },
  { id: "general_road", label: "一般道利用割増料" },
  { id: "item_specific", label: "品目別割増料" },
  { id: "oversized", label: "特大品割増料" },
  { id: "winter", label: "冬期割増料" },
  { id: "rough_road", label: "悪路割増料" },
  { id: "area", label: "地区割増料" },
  { id: "arrival_time", label: "到着（納品）時間指定に係る割増料" },
  { id: "overnight", label: "宵積み割増料（当日積込、翌日運送・取卸）" },
  { id: "condition_change", label: "運行条件変更割増料（当日・前日の変更等）" },
  { id: "multiple_locations", label: "複数個所の積込・取卸割増料" },
  { id: "worker_assignment", label: "作業員配置　割増料" },
  { id: "other", label: "その他" },
] as const;

export interface Q36Data {
  items: Record<string, FeeItem>;
  otherDescription: string;
}

// Q37: 個建運賃基準
export interface Q37Data {
  weight: boolean;           // 重量（重さ）
  volume: boolean;           // 容量（体積）
  quantity: boolean;         // 個数（ケース数）
  weightAndVolume: boolean;  // 重量と容積等の複数要因
  pallet: boolean;           // パレット（ラック）単位
  other: { selected: boolean; description: string };
}

// Q38: 個建運賃積載率
export interface Q38Data {
  averageLoadRate: string;   // 平均積載率 %
  mainCargoItems: string;    // 主な輸送品
}

// Q39: 主な輸送詳細
export type VehicleSizeSelection = "small" | "medium" | "large" | "trailer" | "";

export interface TransportDetailRow {
  vehicleSize: VehicleSizeSelection;
  actualDistance: string;      // 実車距離 km
  constraintHours: string;     // 平均拘束時間（時間）
  constraintMinutes: string;   // 平均拘束時間（分）
  averageFare: string;         // 平均運賃額 円
  averageFee: string;          // 平均料金額 円
}

export interface Q39Data {
  rows: TransportDetailRow[];  // 5行
}

// ==========================================
// 単車調査 Q40-Q61
// ==========================================

// Q40: 車両形状選択
export const VEHICLE_SHAPES = [
  { id: "dryvan_van", label: "ドライバン等（バンボディ）" },
  { id: "dryvan_wing", label: "ドライバン等（ウィングボディ）" },
  { id: "dryvan_flat", label: "ドライバン等（平ボディ）" },
  { id: "dryvan_horo", label: "ドライバン等（幌ウィング）" },
  { id: "refrigerated", label: "冷蔵車・冷凍車" },
  { id: "dump", label: "ダンプ車" },
  { id: "tank", label: "タンク車" },
  { id: "bulk", label: "バルク車" },
  { id: "container", label: "海上コンテナ輸送車" },
  { id: "mixer", label: "コンクリートミキサー車" },
  { id: "crane", label: "トラック搭載型クレーン車" },
  { id: "hearse", label: "霊柩車" },
  { id: "waste", label: "一般廃棄物輸送車（塵芥車、衛生車等）" },
  { id: "carrier", label: "車積載車（キャリアカー）" },
  { id: "heavy", label: "重量物輸送車" },
  { id: "other", label: "その他" },
] as const;

export type VehicleShape = typeof VEHICLE_SHAPES[number]["id"];

export interface Q40Data {
  shape: VehicleShape | "";
}

// Q41: 車両形状詳細
export interface Q41Data {
  officeName: string;           // 所属営業所名
  maxLoadCapacity: string;      // 最大積載量（トン）
  grossVehicleWeight: string;   // 車両総重量（トン）
  displacement: string;         // 排気量（リットル）
  axleCount: string;            // 軸数（本）
  registrationYear: string;     // 新規登録年
  plannedUsageYears: string;    // 使用予定年数
}

// Q42: 車両調達方法
export type ProcurementMethod = "purchase" | "lease" | "other" | "";

export interface Q42Data {
  method: ProcurementMethod;
}

// Q43: 購入/リース詳細
export type VehicleCondition = "new" | "used" | "";

export interface PurchaseDetails {
  condition: VehicleCondition;
  price: string;  // 万円（税込）
}

export interface LeaseDetails {
  condition: VehicleCondition;
  price: string;           // 車両本体価格 万円
  monthlyFee: string;      // 平均月額リース料金 円
  contractYears: string;   // 契約期間（年）
  contractMonths: string;  // 契約期間（ヶ月）
  buyoutPrice: string;     // 契約終了時買取価格 万円
}

export interface Q43Data {
  purchase: PurchaseDetails;
  lease: LeaseDetails;
}

// Q44: 車両付属備品費用
export interface Q44Data {
  accessoryCost: string;      // 車両の付属備品等の費用 万円
  digitalTacho: string;       // 運行記録計（デジタコ）万円
  driveRecorder: string;      // ドライブレコーダー 万円
  asv: string;                // ASV 万円
  otherSafetyCost: string;    // 上記以外で輸送の安全確保のために必要な経費 万円
}

// Q45: 主な運行距離帯
export type DistanceRange = "short" | "medium" | "long" | "";

export interface Q45Data {
  distanceRange: DistanceRange;
}

// Q46: 主な輸送品
export interface Q46Data {
  mainCargo: string;
}

// Q47: 1日当たり平均乗務人数
export interface Q47Data {
  averageCrewCount: string;
}

// Q48: 税金（環境性能割、自動車税、重量税）
export interface Q48Data {
  environmentTax: string;     // 環境性能割（旧・自動車取得税）円
  vehicleTax: string;         // 自動車税 円
  weightTax: string;          // 自動車重量税 円
}

// Q49: 保険（自賠責、任意）
export interface Q49Data {
  compulsoryInsurance: string;  // 自賠責保険 円
  voluntaryInsurance: string;   // 任意保険 円
}

// Q50: 平均燃費
export interface Q50Data {
  fuelEfficiency: string;  // km/L
}

// Q51: オイル関連
export interface Q51Data {
  oilUnitPrice: string;       // オイル単価 円/L
  oilChangeVolume: string;    // オイル交換量 L/回
  oilChangeDistance: string;  // オイル交換1回当たり走行距離 km
  oilChangeLaborCost: string; // オイル交換の工賃 円/回
}

// Q52: タイヤ関連
export interface Q52Data {
  tireUnitPrice: string;       // タイヤ単価 円/本
  tireCount: string;           // タイヤの必要本数 本/両
  tireChangeLaborCost: string; // タイヤ交換の工賃 円/回
  tireChangeDistance: string;  // タイヤ1交換当たり走行距離 km/回
}

// Q53: 尿素水
export interface Q53Data {
  ureaUnitPrice: string;      // 尿素水の単価 円/L
  ureaDistancePerLiter: string; // 1リットル当たり走行可能距離 km/L
}

// Q54: 車検・修理費用
export interface Q54Data {
  inspectionCost: string;   // 車検整備費用 円/年
  maintenanceCost: string;  // 定期点検・一般修理費用 円/年
}

// Q55: 荷役関連経費
export interface Q55Data {
  cargoHandlingSupplies: string;  // 荷役関連の消耗品 円/年
  liftingEquipment: string;       // 荷役作業時の昇降設備 円/台
  helmet: string;                 // 保護帽（ヘルメット）円/個
  safetyClothing: string;         // 作業服・安全靴等 円/人
}

// Q56: 月間収入・料金
export interface Q56Data {
  monthlyRevenue: string;       // 月間収入額 万円/月
  highwayFee: string;           // 高速道路利用料金 万円/月
  ferryFee: string;             // フェリー利用料金 万円/月
  relayFacilityFee: string;     // 中継輸送実施に伴う施設使用料 万円/月
  otherFee: string;             // その他料金 万円/月
}

// Q57: 月間運行データ
export interface Q57Data {
  loadRate: string;             // 平均積載率 %/月
  totalDistance: string;        // 平均総走行距離 km/月
  actualDistance: string;       // 平均実車距離 km/月
  workingDays: string;          // 平均実働日数 日/月
  transportTonnage: string;     // 平均輸送トン数 トン/月
  dailyWorkingHours: string;    // 1日平均実働時間 時間/日
}

// Q58: 1運行当たり平均
export interface Q58Data {
  averageTransportDistance: string;  // 1運行の平均輸送距離 km
  averageRoundCount: string;         // 1日当たりの平均ラウンド回数 回/日
}

// Q59: 車両洗浄
export interface Q59Data {
  washingTime: string;   // 車両洗浄の所要時間 時間/月
  washingCost: string;   // 車両洗浄の費用 円/月
}

// Q60: 特殊車両通行許可費用
export interface Q60Data {
  specialPermitCost: string;  // 特殊車両通行許可申請平均費用 円/年
}

// Q61: 運行詳細（時間・距離テーブル）
export type WorkerType = "driver" | "shipper" | "other" | "";

export interface Q61Data {
  cargoItem: string;                     // 輸送品目
  preDepartureTime: string;              // 出社から運行開始までの所要時間 分
  toLoadingLocationTime: string;         // 車庫から指定場所までの所要時間 分
  toLoadingLocationDistance: string;     // 車庫から指定場所までの走行距離 km
  loadingWaitTime: string;               // 積込場所での待機時間 分
  loadingAncillaryTime: string;          // 積込場所での附帯作業時間 分
  loadingWorkTime: string;               // 積込作業の所要時間 分
  loadingWorker: WorkerType;             // 誰が積込作業を実施するか
  loadingSecuringTime: string;           // 積付（養生・固縛等）作業時間 分
  transitTimeHours: string;              // 出発地から到着地までの所要時間（時間）
  transitTimeMinutes: string;            // 出発地から到着地までの所要時間（分）
  transitDistance: string;               // 出発地から到着地までの走行距離 km
  unloadingWaitTime: string;             // 目的地での待機時間 分
  unloadingWorkTime: string;             // 取卸作業の所要時間 分
  unloadingWorker: WorkerType;           // 誰が取卸作業を実施するか
  unloadingAncillaryTime: string;        // 目的地での附帯作業時間 分
  returnToGarageTime: string;            // 目的地から車庫までの所要時間 分
  returnToGarageDistance: string;        // 目的地から車庫までの走行距離 km
  postArrivalTime: string;               // 帰庫から退社までの所要時間 分
}

// ==========================================
// トラクター調査 Q62-Q82
// ==========================================

// Q62: 牽引シャーシ選択（複数選択可）
export const CHASSIS_TYPES = [
  { id: "van_normal", label: "バン型（常温）" },
  { id: "refrigerated", label: "冷蔵・冷凍型" },
  { id: "heavy", label: "重量物運搬用" },
  { id: "dump", label: "ダンプ型" },
  { id: "tank", label: "タンク型" },
  { id: "bulk", label: "バルク型" },
  { id: "container", label: "コンテナ" },
  { id: "car_carrier", label: "自動車運搬用" },
  { id: "other", label: "その他" },
] as const;

export type ChassisType = typeof CHASSIS_TYPES[number]["id"];

export interface Q62Data {
  chassisTypes: ChassisType[];
}

// Q63: 車両形状詳細（Q41と同じ構造）
export interface Q63Data {
  officeName: string;
  maxLoadCapacity: string;
  grossVehicleWeight: string;
  displacement: string;
  axleCount: string;
  registrationYear: string;
  plannedUsageYears: string;
}

// Q64: 車両調達方法（Q42と同じ構造）
export interface Q64Data {
  method: ProcurementMethod;
}

// Q65: 購入/リース詳細（Q43と同じ構造）
export interface Q65Data {
  purchase: PurchaseDetails;
  lease: LeaseDetails;
}

// Q66: 車両付属備品費用（Q44と同じ構造）
export interface Q66Data {
  accessoryCost: string;
  digitalTacho: string;
  driveRecorder: string;
  asv: string;
  otherSafetyCost: string;
}

// Q67: 主な運行距離帯（Q45と同じ構造）
export interface Q67Data {
  distanceRange: DistanceRange;
}

// Q68: 1日当たり平均乗務人数（Q47と同じ構造）
export interface Q68Data {
  averageCrewCount: string;
}

// Q69: 税金（Q48と同じ構造）
export interface Q69Data {
  environmentTax: string;
  vehicleTax: string;
  weightTax: string;
}

// Q70: 保険（Q49と同じ構造）
export interface Q70Data {
  compulsoryInsurance: string;
  voluntaryInsurance: string;
}

// Q71: 平均燃費（Q50と同じ構造）
export interface Q71Data {
  fuelEfficiency: string;
}

// Q72: オイル関連（Q51と同じ構造）
export interface Q72Data {
  oilUnitPrice: string;
  oilChangeVolume: string;
  oilChangeDistance: string;
  oilChangeLaborCost: string;
}

// Q73: タイヤ関連（Q52と同じ構造）
export interface Q73Data {
  tireUnitPrice: string;
  tireCount: string;
  tireChangeLaborCost: string;
  tireChangeDistance: string;
}

// Q74: 尿素水（Q53と同じ構造）
export interface Q74Data {
  ureaUnitPrice: string;
  ureaDistancePerLiter: string;
}

// Q75: 車検・修理費用（Q54と同じ構造）
export interface Q75Data {
  inspectionCost: string;
  maintenanceCost: string;
}

// Q76: 荷役関連経費（Q55と同じ構造）
export interface Q76Data {
  cargoHandlingSupplies: string;
  liftingEquipment: string;
  helmet: string;
  safetyClothing: string;
}

// Q77: 月間収入・料金（Q56と同じ構造）
export interface Q77Data {
  monthlyRevenue: string;
  highwayFee: string;
  ferryFee: string;
  relayFacilityFee: string;
  otherFee: string;
}

// Q78: 月間運行データ（Q57と同じ構造）
export interface Q78Data {
  loadRate: string;
  totalDistance: string;
  actualDistance: string;
  workingDays: string;
  transportTonnage: string;
  dailyWorkingHours: string;
}

// Q79: 1運行当たり平均（Q58と同じ構造）
export interface Q79Data {
  averageTransportDistance: string;
  averageRoundCount: string;
}

// Q80: 車両洗浄（Q59と同じ構造）
export interface Q80Data {
  washingTime: string;
  washingCost: string;
}

// Q81: 特殊車両通行許可費用（Q60と同じ構造）
export interface Q81Data {
  specialPermitCost: string;
}

// Q82: 運行詳細（Q61と同じ構造）
export interface Q82Data {
  cargoItem: string;
  preDepartureTime: string;
  toLoadingLocationTime: string;
  toLoadingLocationDistance: string;
  loadingWaitTime: string;
  loadingAncillaryTime: string;
  loadingWorkTime: string;
  loadingWorker: WorkerType;
  loadingSecuringTime: string;
  transitTimeHours: string;
  transitTimeMinutes: string;
  transitDistance: string;
  unloadingWaitTime: string;
  unloadingWorkTime: string;
  unloadingWorker: WorkerType;
  unloadingAncillaryTime: string;
  returnToGarageTime: string;
  returnToGarageDistance: string;
  postArrivalTime: string;
}

// 全回答データ
export interface SurveyFormData {
  surveyType: SurveyType;
  // 共通調査 Q2-Q16
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
  // 料金収受実態調査 Q17-Q39
  q17: Q17Data;
  q18: Q18Data;
  q19: Q19Data;
  q20: Q20Data;
  q21: Q21Data;
  q22: Q22Data;
  q23: Q23Data;
  q24: Q24Data;
  q25: Q25Data;
  q26: Q26Data;
  q27: Q27Data;
  q28: Q28Data;
  q29: Q29Data;
  q30: Q30Data;
  q31: Q31Data;
  q32: Q32Data;
  q33: Q33Data;
  q34: Q34Data;
  q35: Q35Data;
  q36: Q36Data;
  q37: Q37Data;
  q38: Q38Data;
  q39: Q39Data;
  // 単車調査 Q40-Q61
  q40: Q40Data;
  q41: Q41Data;
  q42: Q42Data;
  q43: Q43Data;
  q44: Q44Data;
  q45: Q45Data;
  q46: Q46Data;
  q47: Q47Data;
  q48: Q48Data;
  q49: Q49Data;
  q50: Q50Data;
  q51: Q51Data;
  q52: Q52Data;
  q53: Q53Data;
  q54: Q54Data;
  q55: Q55Data;
  q56: Q56Data;
  q57: Q57Data;
  q58: Q58Data;
  q59: Q59Data;
  q60: Q60Data;
  q61: Q61Data;
  // トラクター調査 Q62-Q82
  q62: Q62Data;
  q63: Q63Data;
  q64: Q64Data;
  q65: Q65Data;
  q66: Q66Data;
  q67: Q67Data;
  q68: Q68Data;
  q69: Q69Data;
  q70: Q70Data;
  q71: Q71Data;
  q72: Q72Data;
  q73: Q73Data;
  q74: Q74Data;
  q75: Q75Data;
  q76: Q76Data;
  q77: Q77Data;
  q78: Q78Data;
  q79: Q79Data;
  q80: Q80Data;
  q81: Q81Data;
  q82: Q82Data;
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
