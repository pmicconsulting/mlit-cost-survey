"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, CheckCircle, TrendingUp, ChevronDown, ChevronUp, Building2, Users, ShieldCheck, Leaf, HelpCircle } from "lucide-react";

// 投資カテゴリと項目の定義
const INVESTMENT_CATEGORIES = [
  {
    id: "businessBase",
    title: "事業基盤強化に向けた投資",
    icon: Building2,
    color: "blue",
    subcategories: [
      {
        id: "facilityEquipment",
        label: "施設・設備更新",
        items: [
          "荷役設備の更新（フォークリフト等）",
          "待機場所の確保",
          "物流機器・資材（パレット等）の更新・調達",
          "ITシステムの更新・導入",
        ],
      },
      {
        id: "complianceGovernance",
        label: "コンプライアンス・ガバナンス",
        items: [
          "業務システムのセキュリティ対策強化",
          "コンプライアンス体制の強化",
          "内部統制の強化",
        ],
      },
    ],
  },
  {
    id: "humanResources",
    title: "将来の人材関連投資",
    icon: Users,
    color: "green",
    subcategories: [
      {
        id: "recruitment",
        label: "採用・教育",
        items: [
          "新規採用活動費用",
          "教育・研修費用",
          "資格取得支援",
        ],
      },
      {
        id: "workEnvironment",
        label: "労働環境改善",
        items: [
          "給与・賞与の改善",
          "福利厚生の充実",
          "労働時間短縮への投資",
        ],
      },
    ],
  },
  {
    id: "bcp",
    title: "BCP（事業継続計画）関連投資",
    icon: ShieldCheck,
    color: "purple",
    subcategories: [
      {
        id: "disasterPrevention",
        label: "災害対策",
        items: [
          "災害対策設備の整備",
          "代替輸送手段の確保",
          "保険の充実",
        ],
      },
      {
        id: "businessContinuity",
        label: "事業継続体制",
        items: [
          "BCP策定・更新",
          "訓練・教育",
        ],
      },
    ],
  },
  {
    id: "environment",
    title: "環境対策投資",
    icon: Leaf,
    color: "emerald",
    subcategories: [
      {
        id: "vehicleEnvironment",
        label: "車両関連",
        items: [
          "低公害車・電動車の導入",
          "燃費改善装置の導入",
        ],
      },
      {
        id: "facilityEnvironment",
        label: "施設関連",
        items: [
          "太陽光発電等の導入",
          "省エネ設備の導入",
        ],
      },
    ],
  },
  {
    id: "other",
    title: "その他の投資",
    icon: HelpCircle,
    color: "slate",
    subcategories: [
      {
        id: "otherInvestment",
        label: "その他",
        items: [
          "上記に該当しない投資",
        ],
      },
    ],
  },
];

interface CategoryData {
  enabled: boolean;
  percentage: string;
  amount: string;
  selectedItems: string[];
  otherText: string;
}

interface SurveyData {
  categories: { [key: string]: CategoryData };
}

const createInitialData = (): SurveyData => {
  const categories: { [key: string]: CategoryData } = {};
  INVESTMENT_CATEGORIES.forEach((cat) => {
    categories[cat.id] = {
      enabled: false,
      percentage: "",
      amount: "",
      selectedItems: [],
      otherText: "",
    };
  });
  return { categories };
};

// ダミー保存・読込関数
const saveSurveyData = async (data: SurveyData) => {
  console.log("保存データ:", data);
  localStorage.setItem("survey_q16_draft", JSON.stringify(data));
  return { success: true };
};

const loadSurveyData = (): SurveyData | null => {
  if (typeof window === "undefined") return null;
  const draft = localStorage.getItem("survey_q16_draft");
  return draft ? JSON.parse(draft) : null;
};

// カラー設定
const getColorClasses = (color: string, enabled: boolean) => {
  const colors: { [key: string]: { bg: string; border: string; text: string; header: string } } = {
    blue: {
      bg: enabled ? "bg-blue-50" : "bg-slate-50",
      border: enabled ? "border-blue-300" : "border-slate-200",
      text: "text-blue-600",
      header: "bg-blue-600",
    },
    green: {
      bg: enabled ? "bg-green-50" : "bg-slate-50",
      border: enabled ? "border-green-300" : "border-slate-200",
      text: "text-green-600",
      header: "bg-green-600",
    },
    purple: {
      bg: enabled ? "bg-purple-50" : "bg-slate-50",
      border: enabled ? "border-purple-300" : "border-slate-200",
      text: "text-purple-600",
      header: "bg-purple-600",
    },
    emerald: {
      bg: enabled ? "bg-emerald-50" : "bg-slate-50",
      border: enabled ? "border-emerald-300" : "border-slate-200",
      text: "text-emerald-600",
      header: "bg-emerald-600",
    },
    slate: {
      bg: enabled ? "bg-slate-100" : "bg-slate-50",
      border: enabled ? "border-slate-400" : "border-slate-200",
      text: "text-slate-600",
      header: "bg-slate-600",
    },
  };
  return colors[color] || colors.slate;
};

export default function SurveyQ16Page() {
  const [data, setData] = useState<SurveyData>(createInitialData());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // 初回読み込み
  useEffect(() => {
    const savedData = loadSurveyData();
    if (savedData) {
      setData(savedData);
      // 有効なカテゴリを展開
      const enabled = Object.entries(savedData.categories)
        .filter(([, catData]) => catData.enabled)
        .map(([catId]) => catId);
      setExpandedCategories(enabled);
    }
  }, []);

  // カテゴリ有効/無効切替
  const handleCategoryToggle = (categoryId: string) => {
    const newEnabled = !data.categories[categoryId].enabled;
    setData({
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...data.categories[categoryId],
          enabled: newEnabled,
        },
      },
    });
    // 有効にした場合は展開
    if (newEnabled && !expandedCategories.includes(categoryId)) {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // アコーディオン開閉
  const toggleExpand = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // 割合入力
  const handlePercentageChange = (categoryId: string, value: string) => {
    setData({
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...data.categories[categoryId],
          percentage: value.replace(/[^0-9.]/g, ""),
        },
      },
    });
  };

  // 金額入力
  const handleAmountChange = (categoryId: string, value: string) => {
    setData({
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...data.categories[categoryId],
          amount: value.replace(/[^0-9]/g, ""),
        },
      },
    });
  };

  // 項目選択
  const handleItemToggle = (categoryId: string, itemLabel: string) => {
    const current = data.categories[categoryId].selectedItems;
    const updated = current.includes(itemLabel)
      ? current.filter((i) => i !== itemLabel)
      : [...current, itemLabel];
    setData({
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...data.categories[categoryId],
          selectedItems: updated,
        },
      },
    });
  };

  // その他テキスト
  const handleOtherTextChange = (categoryId: string, value: string) => {
    setData({
      ...data,
      categories: {
        ...data.categories,
        [categoryId]: {
          ...data.categories[categoryId],
          otherText: value,
        },
      },
    });
  };

  // 保存処理
  const handleSave = async () => {
    setSaving(true);
    await saveSurveyData(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 合計計算
  const totalPercentage = Object.values(data.categories)
    .filter((cat) => cat.enabled)
    .reduce((sum, cat) => sum + (parseFloat(cat.percentage) || 0), 0);
  const totalAmount = Object.values(data.categories)
    .filter((cat) => cat.enabled)
    .reduce((sum, cat) => sum + (parseInt(cat.amount) || 0), 0);
  const enabledCount = Object.values(data.categories).filter((cat) => cat.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/survey/common/q15"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              前の設問へ
            </Link>
            <div className="text-sm text-slate-500">設問 16 / 16</div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ドライバン等 適正原価に関する実態調査
          </h1>
          <p className="text-slate-600 text-sm">
            ※設問2～16は事業全体（全ての営業所を含む）についてご回答ください。
          </p>
        </div>

        {/* 設問16 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">設問16</h2>
              <p className="text-slate-600 text-sm">
                事業継続のための投資について、該当するカテゴリを選択し、詳細をご記入ください
              </p>
            </div>
          </div>

          {/* サマリー */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-slate-500">選択カテゴリ</div>
              <div className="text-2xl font-bold text-blue-600">{enabledCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-500">合計割合</div>
              <div className={`text-2xl font-bold ${totalPercentage > 100 ? "text-red-600" : "text-green-600"}`}>
                {totalPercentage.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-500">合計金額/年</div>
              <div className="text-2xl font-bold text-purple-600">{totalAmount.toLocaleString()}万円</div>
            </div>
          </div>

          {totalPercentage > 100 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ※ 合計割合が100%を超えています。入力内容をご確認ください。
            </div>
          )}

          {/* カテゴリ一覧 */}
          <div className="space-y-4">
            {INVESTMENT_CATEGORIES.map((category) => {
              const catData = data.categories[category.id];
              const isEnabled = catData?.enabled || false;
              const isExpanded = expandedCategories.includes(category.id);
              const colorClasses = getColorClasses(category.color, isEnabled);
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className={`rounded-xl border-2 overflow-hidden transition-colors ${colorClasses.border} ${colorClasses.bg}`}
                >
                  {/* カテゴリヘッダー */}
                  <div
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                      isEnabled ? colorClasses.header + " text-white" : "bg-slate-100"
                    }`}
                    onClick={() => toggleExpand(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCategoryToggle(category.id);
                        }}
                        className="w-5 h-5 rounded focus:ring-2"
                      />
                      <Icon className={`w-5 h-5 ${isEnabled ? "text-white" : colorClasses.text}`} />
                      <span className={`font-bold ${isEnabled ? "text-white" : "text-slate-700"}`}>
                        {category.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {isEnabled && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="opacity-80">割合:</span>
                          <span className="font-bold">{catData.percentage || "-"}%</span>
                          <span className="opacity-80 ml-2">金額:</span>
                          <span className="font-bold">{catData.amount ? parseInt(catData.amount).toLocaleString() : "-"}万円</span>
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className={`w-5 h-5 ${isEnabled ? "text-white" : "text-slate-400"}`} />
                      ) : (
                        <ChevronDown className={`w-5 h-5 ${isEnabled ? "text-white" : "text-slate-400"}`} />
                      )}
                    </div>
                  </div>

                  {/* 詳細コンテンツ */}
                  {isExpanded && (
                    <div className="p-4">
                      {/* 割合・金額入力 */}
                      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-slate-700">
                            総費用に対する割合:
                          </label>
                          <input
                            type="text"
                            value={catData?.percentage || ""}
                            onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                            disabled={!isEnabled}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-right text-sm disabled:bg-slate-100"
                            placeholder="0"
                          />
                          <span className="text-sm text-slate-500">%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-slate-700">
                            概算金額:
                          </label>
                          <input
                            type="text"
                            value={catData?.amount ? parseInt(catData.amount).toLocaleString() : ""}
                            onChange={(e) => handleAmountChange(category.id, e.target.value)}
                            disabled={!isEnabled}
                            className="w-28 px-2 py-1 border border-slate-300 rounded text-right text-sm disabled:bg-slate-100"
                            placeholder="0"
                          />
                          <span className="text-sm text-slate-500">万円/年</span>
                        </div>
                      </div>

                      {/* 詳細項目 */}
                      {category.subcategories.map((subcat) => (
                        <div key={subcat.id} className="mb-3">
                          <div className="text-sm font-medium text-slate-700 mb-2">
                            {subcat.label}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {subcat.items.map((item) => (
                              <label
                                key={item}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                  catData?.selectedItems.includes(item)
                                    ? "bg-white border border-blue-300"
                                    : "bg-slate-50 border border-slate-200 hover:bg-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={catData?.selectedItems.includes(item) || false}
                                  onChange={() => handleItemToggle(category.id, item)}
                                  disabled={!isEnabled}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* その他テキスト */}
                      <div className="mt-3">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          その他の詳細・補足
                        </label>
                        <textarea
                          value={catData?.otherText || ""}
                          onChange={(e) => handleOtherTextChange(category.id, e.target.value)}
                          disabled={!isEnabled}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none disabled:bg-slate-100"
                          rows={2}
                          placeholder="その他の投資内容や補足事項があればご記入ください"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            ※ 該当するカテゴリにチェックを入れて展開し、詳細をご入力ください。
            <br />
            ※ 割合の合計が100%を超えないようご確認ください。
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>保存中...</>
            ) : saved ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                保存しました
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                一時保存
              </>
            )}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ダッシュボードへ
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
