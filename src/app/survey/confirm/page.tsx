"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, Truck, Users, FileText, Calculator, Shield, TrendingUp, Package, Fuel, Wrench, DollarSign } from "lucide-react";

// 調査タイプの定義
type SurveyType = "dryvan" | "single-truck" | "tractor";

interface StoredSurveyData {
  formData: Record<string, unknown>;
  currentStep: number;
  lastSaved: string;
}

// ラベル定義
const SURVEY_TYPE_LABELS: Record<SurveyType, string> = {
  dryvan: "ドライバン等調査",
  "single-truck": "単車調査",
  tractor: "トラクター調査",
};

// 距離帯ラベル
const DISTANCE_LABELS: Record<string, string> = {
  short: "近距離輸送",
  medium: "中距離輸送",
  long: "長距離輸送",
};

// 車両形状ラベル
const VEHICLE_SHAPE_LABELS: Record<string, string> = {
  flatbed: "平ボディ",
  van: "バン型",
  wing: "ウイング",
  tank: "タンク車",
  dump: "ダンプ車",
  refrigerated: "冷凍・冷蔵車",
  container: "コンテナ車",
  other: "その他",
};

// 調達方法ラベル
const PROCUREMENT_LABELS: Record<string, string> = {
  purchase: "購入",
  lease: "リース",
  other: "その他",
};

// 車両状態ラベル
const CONDITION_LABELS: Record<string, string> = {
  new: "新車",
  used: "中古車",
};

export default function SurveyConfirmPage() {
  const [surveyData, setSurveyData] = useState<Record<SurveyType, StoredSurveyData | null>>({
    dryvan: null,
    "single-truck": null,
    tractor: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 各調査タイプのデータを読み込み
    const loadSurveyData = () => {
      const types: SurveyType[] = ["dryvan", "single-truck", "tractor"];
      const loaded: Record<SurveyType, StoredSurveyData | null> = {
        dryvan: null,
        "single-truck": null,
        tractor: null,
      };

      types.forEach((type) => {
        const key = `survey_${type}_draft`;
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            loaded[type] = JSON.parse(stored);
          } catch (e) {
            console.error(`Failed to parse ${key}:`, e);
          }
        }
      });

      setSurveyData(loaded);
    };

    loadSurveyData();
  }, []);

  // 回答があるか確認
  const hasAnyData = Object.values(surveyData).some((data) => data !== null);

  const handleSubmit = async () => {
    setSubmitting(true);
    // TODO: Supabaseへの保存処理
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  // 値の表示ヘルパー
  const formatValue = (value: unknown, suffix = ""): string => {
    if (value === undefined || value === null || value === "") return "未入力";
    return `${value}${suffix}`;
  };

  // 共通設問の表示（Q2-Q16）
  const renderCommonQuestions = (formData: Record<string, unknown>): React.ReactNode => {
    return (
      <div className="space-y-6">
        {/* Q2: 保有車両数 */}
        {formData.q2 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              問2 保有車両数
            </h4>
            <p className="text-slate-700">
              総保有車両数: {formatValue((formData.q2 as Record<string, unknown>).totalVehicles, "台")}
            </p>
          </div>
        ) : null}

        {/* Q3: 車両種別 */}
        {formData.q3 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              問3 車両種別
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">ドライバン等</p>
                {renderVehicleCounts((formData.q3 as Record<string, unknown>).dryvan as Record<string, unknown>)}
              </div>
              <div>
                <p className="text-slate-500">ドライバン等以外</p>
                {renderVehicleCounts((formData.q3 as Record<string, unknown>).nonDryvan as Record<string, unknown>)}
              </div>
            </div>
          </div>
        ) : null}

        {/* Q4: 運転者情報 */}
        {formData.q4 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              問4 運転者情報
            </h4>
            {renderDriverInfo(formData.q4 as Record<string, unknown>)}
          </div>
        ) : null}

        {/* Q5-Q6: 確認事項 */}
        {(formData.q5 || formData.q6) ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              問5-6 確認事項
            </h4>
            <div className="space-y-2 text-sm">
              {formData.q5 ? (
                <p>行政処分: {(formData.q5 as Record<string, unknown>).hasAdministrativePenalty === "yes" ? "あり" : (formData.q5 as Record<string, unknown>).hasAdministrativePenalty === "no" ? "なし" : "未回答"}</p>
              ) : null}
              {formData.q6 ? (
                <p>災害影響: {(formData.q6 as Record<string, unknown>).hasDisasterImpact === "yes" ? "あり" : (formData.q6 as Record<string, unknown>).hasDisasterImpact === "no" ? "なし" : "未回答"}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Q12-Q14: 財務情報 */}
        {(formData.q12 || formData.q13) ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              問12-14 財務状況
            </h4>
            {formData.q12 ? renderFinancialData(formData.q12 as Record<string, unknown>) : null}
          </div>
        ) : null}

        {/* Q15: 安全経費 */}
        {formData.q15 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              問15 安全経費
            </h4>
            {renderSafetyExpenses(formData.q15 as Record<string, unknown>)}
          </div>
        ) : null}

        {/* Q16: 事業投資 */}
        {formData.q16 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              問16 事業投資
            </h4>
            {renderBusinessInvestment(formData.q16 as Record<string, unknown>)}
          </div>
        ) : null}
      </div>
    );
  };

  // 車両数の表示
  const renderVehicleCounts = (data: Record<string, unknown> | undefined): React.ReactNode => {
    if (!data || !data.vehicles) return <p className="text-slate-400">未入力</p>;
    const vehicles = data.vehicles as Record<string, string>;
    const entries = Object.entries(vehicles).filter(([_, v]) => v);
    if (entries.length === 0) return <p className="text-slate-400">未入力</p>;

    const labels: Record<string, string> = {
      tractor: "トラクター",
      trailer: "トレーラー",
      large: "大型",
      medium: "中型",
      small: "小型",
    };

    return (
      <ul className="text-slate-700">
        {entries.map(([key, value]) => (
          <li key={key}>{labels[key] || key}: {value}台</li>
        ))}
      </ul>
    );
  };

  // 運転者情報の表示
  const renderDriverInfo = (data: Record<string, unknown>): React.ReactNode => {
    const driverCount = data.driverCount as Record<string, string> | undefined;
    if (!driverCount) return <p className="text-slate-400">未入力</p>;

    const entries = Object.entries(driverCount).filter(([_, v]) => v);
    if (entries.length === 0) return <p className="text-slate-400">未入力</p>;

    const labels: Record<string, string> = {
      tractor: "けん引",
      large: "大型",
      medium: "中型",
      small: "小型",
      other: "その他",
    };

    return (
      <ul className="text-sm text-slate-700">
        {entries.map(([key, value]) => (
          <li key={key}>{labels[key] || key}: {value}人</li>
        ))}
      </ul>
    );
  };

  // 財務データの表示
  const renderFinancialData = (data: Record<string, unknown>): React.ReactNode => {
    return (
      <div className="text-sm text-slate-700 space-y-1">
        <p>売上高: {formatValue(data.sales, "千円")}</p>
        <p>営業利益: {formatValue(data.operatingProfit, "千円")}</p>
      </div>
    );
  };

  // 安全経費の表示
  const renderSafetyExpenses = (data: Record<string, unknown>): React.ReactNode => {
    const items = data.items as Record<string, Record<string, unknown>> | undefined;
    if (!items) return <p className="text-slate-400">未入力</p>;

    const checkedItems = Object.entries(items).filter(([_, v]) => v.checked);
    if (checkedItems.length === 0) return <p className="text-slate-400">選択なし</p>;

    return (
      <p className="text-sm text-slate-700">{checkedItems.length}項目を選択</p>
    );
  };

  // 事業投資の表示
  const renderBusinessInvestment = (data: Record<string, unknown>): React.ReactNode => {
    const categories = data.categories as Record<string, Record<string, unknown>> | undefined;
    if (!categories) return <p className="text-slate-400">未入力</p>;

    const enabledCategories = Object.entries(categories).filter(([_, v]) => v.enabled);
    if (enabledCategories.length === 0) return <p className="text-slate-400">選択なし</p>;

    return (
      <p className="text-sm text-slate-700">{enabledCategories.length}カテゴリを選択</p>
    );
  };

  // 車両固有設問の表示（Q40-Q61 または Q62-Q82）
  const renderVehicleQuestions = (formData: Record<string, unknown>, type: SurveyType): React.ReactNode => {
    if (type === "single-truck") {
      return renderSingleTruckQuestions(formData);
    } else if (type === "tractor") {
      return renderTractorQuestions(formData);
    }
    return null;
  };

  // 単車調査 Q40-Q61
  const renderSingleTruckQuestions = (formData: Record<string, unknown>): React.ReactNode => {
    return (
      <div className="space-y-4">
        {/* Q40: 車両形状 */}
        {formData.q40 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              問40 車両形状
            </h4>
            <p className="text-slate-700">
              {VEHICLE_SHAPE_LABELS[(formData.q40 as Record<string, string>).shape] || "未選択"}
            </p>
          </div>
        ) : null}

        {/* Q41: 車両の形状等 */}
        {formData.q41 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2">問41 車両の形状等</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>最大積載量: {formatValue((formData.q41 as Record<string, unknown>).maxPayload, "kg")}</p>
              <p>車両総重量: {formatValue((formData.q41 as Record<string, unknown>).grossWeight, "kg")}</p>
              <p>年式: {formatValue((formData.q41 as Record<string, unknown>).modelYear, "年")}</p>
              <p>走行距離: {formatValue((formData.q41 as Record<string, unknown>).mileage, "km")}</p>
            </div>
          </div>
        ) : null}

        {/* Q42-Q43: 調達方法・詳細 */}
        {formData.q42 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              問42-43 調達方法
            </h4>
            <p className="text-slate-700">
              {PROCUREMENT_LABELS[(formData.q42 as Record<string, string>).method] || "未選択"}
            </p>
            {formData.q43 ? (
              <div className="text-sm text-slate-600 mt-2">
                {(formData.q42 as Record<string, string>).method === "purchase" ? (
                  <>
                    <p>車両状態: {CONDITION_LABELS[(formData.q43 as Record<string, Record<string, string>>).purchase?.condition] || "未選択"}</p>
                    <p>購入価格: {formatValue((formData.q43 as Record<string, Record<string, string>>).purchase?.price, "万円")}</p>
                  </>
                ) : null}
                {(formData.q42 as Record<string, string>).method === "lease" ? (
                  <>
                    <p>車両状態: {CONDITION_LABELS[(formData.q43 as Record<string, Record<string, string>>).lease?.condition] || "未選択"}</p>
                    <p>リース料: {formatValue((formData.q43 as Record<string, Record<string, string>>).lease?.monthlyFee, "円/月")}</p>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Q45: 走行距離帯 */}
        {formData.q45 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              問45 走行距離帯
            </h4>
            <p className="text-slate-700">
              {DISTANCE_LABELS[(formData.q45 as Record<string, string>).distanceRange] || "未選択"}
            </p>
          </div>
        ) : null}

        {/* Q50: 燃費 */}
        {formData.q50 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-orange-600" />
              問50 燃費
            </h4>
            <p className="text-slate-700">
              {formatValue((formData.q50 as Record<string, unknown>).fuelEfficiency, "km/L")}
            </p>
          </div>
        ) : null}

        {/* Q54: 整備費用 */}
        {formData.q54 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-600" />
              問54 整備費用
            </h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>定期点検費用: {formatValue((formData.q54 as Record<string, unknown>).periodicInspection, "円/年")}</p>
              <p>車検費用: {formatValue((formData.q54 as Record<string, unknown>).vehicleInspection, "円/年")}</p>
            </div>
          </div>
        ) : null}

        {/* Q56: 月間売上 */}
        {formData.q56 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              問56 月間売上
            </h4>
            <p className="text-slate-700">
              {formatValue((formData.q56 as Record<string, unknown>).monthlyRevenue, "円/月")}
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  // トラクター調査 Q62-Q82
  const renderTractorQuestions = (formData: Record<string, unknown>): React.ReactNode => {
    return (
      <div className="space-y-4">
        {/* Q62: 車両形状 */}
        {formData.q62 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600" />
              問62 車両形状
            </h4>
            <p className="text-slate-700">
              {VEHICLE_SHAPE_LABELS[(formData.q62 as Record<string, string>).shape] || "未選択"}
            </p>
          </div>
        ) : null}

        {/* Q63: 車両の形状等 */}
        {formData.q63 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2">問63 車両の形状等</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>最大積載量: {formatValue((formData.q63 as Record<string, unknown>).maxPayload, "kg")}</p>
              <p>車両総重量: {formatValue((formData.q63 as Record<string, unknown>).grossWeight, "kg")}</p>
              <p>年式: {formatValue((formData.q63 as Record<string, unknown>).modelYear, "年")}</p>
              <p>走行距離: {formatValue((formData.q63 as Record<string, unknown>).mileage, "km")}</p>
            </div>
          </div>
        ) : null}

        {/* Q64-Q65: 調達方法・詳細 */}
        {formData.q64 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              問64-65 調達方法
            </h4>
            <p className="text-slate-700">
              {PROCUREMENT_LABELS[(formData.q64 as Record<string, string>).method] || "未選択"}
            </p>
            {formData.q65 ? (
              <div className="text-sm text-slate-600 mt-2">
                {(formData.q64 as Record<string, string>).method === "purchase" ? (
                  <>
                    <p>車両状態: {CONDITION_LABELS[(formData.q65 as Record<string, Record<string, string>>).purchase?.condition] || "未選択"}</p>
                    <p>購入価格: {formatValue((formData.q65 as Record<string, Record<string, string>>).purchase?.price, "万円")}</p>
                  </>
                ) : null}
                {(formData.q64 as Record<string, string>).method === "lease" ? (
                  <>
                    <p>車両状態: {CONDITION_LABELS[(formData.q65 as Record<string, Record<string, string>>).lease?.condition] || "未選択"}</p>
                    <p>リース料: {formatValue((formData.q65 as Record<string, Record<string, string>>).lease?.monthlyFee, "円/月")}</p>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Q67: 走行距離帯 */}
        {formData.q67 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              問67 走行距離帯
            </h4>
            <p className="text-slate-700">
              {DISTANCE_LABELS[(formData.q67 as Record<string, string>).distanceRange] || "未選択"}
            </p>
          </div>
        ) : null}

        {/* Q71: 燃費 */}
        {formData.q71 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-orange-600" />
              問71 燃費
            </h4>
            <p className="text-slate-700">
              {formatValue((formData.q71 as Record<string, unknown>).fuelEfficiency, "km/L")}
            </p>
          </div>
        ) : null}

        {/* Q75: 整備費用 */}
        {formData.q75 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-600" />
              問75 整備費用
            </h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>定期点検費用: {formatValue((formData.q75 as Record<string, unknown>).periodicInspection, "円/年")}</p>
              <p>車検費用: {formatValue((formData.q75 as Record<string, unknown>).vehicleInspection, "円/年")}</p>
            </div>
          </div>
        ) : null}

        {/* Q77: 月間売上 */}
        {formData.q77 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              問77 月間売上
            </h4>
            <p className="text-slate-700">
              {formatValue((formData.q77 as Record<string, unknown>).monthlyRevenue, "円/月")}
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            回答内容を保存しました
          </h1>
          <p className="text-slate-600 mb-8">
            ご回答いただきありがとうございます。
            <br />
            回答内容は正常に保存されました。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードへ戻る
            </Link>
            <div className="text-sm text-slate-500">確認・保存</div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            回答内容の確認
          </h1>
          <p className="text-slate-600">
            入力内容を確認し、保存してください
          </p>
        </div>

        {!hasAnyData ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-500">回答データがありません</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
            >
              ダッシュボードから調査を開始してください
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 各調査タイプのデータを表示 */}
            {(Object.entries(surveyData) as [SurveyType, StoredSurveyData | null][]).map(([type, data]) => {
              if (!data) return null;
              const formData = data.formData;

              return (
                <div key={type} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Truck className="w-6 h-6 text-blue-600" />
                    {SURVEY_TYPE_LABELS[type]}
                  </h2>

                  {data.lastSaved && (
                    <p className="text-sm text-slate-500 mb-4">
                      最終保存: {new Date(data.lastSaved).toLocaleString("ja-JP")}
                    </p>
                  )}

                  {/* 共通設問 */}
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-700 mb-3 border-b border-slate-300 pb-2">
                      共通設問 (問2-16)
                    </h3>
                    {renderCommonQuestions(formData)}
                  </div>

                  {/* 車両固有設問 */}
                  {(type === "single-truck" || type === "tractor") && (
                    <div>
                      <h3 className="font-bold text-slate-700 mb-3 border-b border-slate-300 pb-2">
                        {type === "single-truck" ? "単車設問 (問40-61)" : "トラクター設問 (問62-82)"}
                      </h3>
                      {renderVehicleQuestions(formData, type)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 保存ボタン */}
        {hasAnyData && (
          <>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    回答内容を保存する
                  </>
                )}
              </button>
            </div>

            {/* ダッシュボードへ戻る */}
            <div className="mt-8 text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ダッシュボードへ戻る
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
