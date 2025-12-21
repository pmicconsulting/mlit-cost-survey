"use client";

import { Shield } from "lucide-react";
import { useQ15 } from "../SurveyContext";
import { SafetyItem } from "../types";

// 安全関連経費の項目（PDFに準拠）
const SAFETY_ITEMS = [
  {
    category: "トラック法法定",
    items: [
      { id: "managementTraining", label: "運行管理者講習の受講費用", hasTime: true },
      { id: "maintenanceTraining", label: "整備管理者講習の受講費用", hasTime: true },
      { id: "driverTraining", label: "運転者講習の受講費用", hasTime: true },
      { id: "aptitudeDiagnosis", label: "運転者の適性診断受診費用（初任、一般、適齢、特別等）", hasTime: true },
      { id: "alcoholDetector", label: "アルコール検知器導入費用", hasTime: false },
    ],
  },
  {
    category: "労働安全衛生法法定",
    items: [
      { id: "initialHealthCheck", label: "雇入れ時健康診断に係る費用", hasTime: false },
      { id: "periodicHealthCheck", label: "定期健康診断に係る費用", hasTime: false },
    ],
  },
  {
    category: "法定以外",
    items: [
      { id: "gMark", label: "安全性優良営業所（Gマーク）認定申請費用", hasTime: false },
      { id: "safetyConsulting", label: "安全マネジメントコンサルティング費用", hasTime: false },
      { id: "autoRollCall", label: "自動点呼システム導入費用", hasTime: false },
      { id: "heatstroke", label: "熱中症対策費用", hasTime: false },
      { id: "safetyManagementSystem", label: "安全運行管理システム導入費用", hasTime: false },
      { id: "driverTrainingTime", label: "ドライバーの研修時間", hasTime: true },
    ],
  },
];

interface Q15SafetyExpensesProps {
  className?: string;
}

export function Q15SafetyExpenses({ className = "" }: Q15SafetyExpensesProps) {
  const { data, update } = useQ15();

  // チェックボックス処理
  const handleToggle = (itemId: string) => {
    const currentItem = data.items[itemId] || { checked: false, hours: "", amount: "" };
    update({
      items: {
        ...data.items,
        [itemId]: { ...currentItem, checked: !currentItem.checked },
      },
    });
  };

  // 時間入力処理
  const handleHoursChange = (itemId: string, value: string) => {
    const currentItem = data.items[itemId] || { checked: false, hours: "", amount: "" };
    update({
      items: {
        ...data.items,
        [itemId]: { ...currentItem, hours: value.replace(/[^0-9.]/g, "") },
      },
    });
  };

  // 金額入力処理
  const handleAmountChange = (itemId: string, value: string) => {
    const currentItem = data.items[itemId] || { checked: false, hours: "", amount: "" };
    update({
      items: {
        ...data.items,
        [itemId]: { ...currentItem, amount: value.replace(/[^0-9.]/g, "") },
      },
    });
  };

  // その他チェックボックス処理
  const handleOtherToggle = () => {
    const currentItem = data.items.otherSafety || { checked: false, hours: "", amount: "" };
    update({
      items: {
        ...data.items,
        otherSafety: { ...currentItem, checked: !currentItem.checked },
      },
    });
  };

  // その他金額入力処理
  const handleOtherAmountChange = (value: string) => {
    const currentItem = data.items.otherSafety || { checked: false, hours: "", amount: "" };
    update({
      items: {
        ...data.items,
        otherSafety: { ...currentItem, amount: value.replace(/[^0-9.]/g, "") },
      },
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問15</h2>
          <p className="text-slate-600 text-sm">
            【過去１年間】輸送の安全確保のために必要な経費のうち、該当するものを選択の上、「万円」単位の概算経費（税込）及び研修等に要している時間を記入してください。
          </p>
        </div>
      </div>

      {/* カテゴリごとの項目 */}
      {SAFETY_ITEMS.map((category) => {
        // カテゴリ内に時間入力項目があるかチェック
        const hasTimeItems = category.items.some((item) => item.hasTime);

        return (
          <div key={category.category} className="mb-6">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-bold text-sm">
              【{category.category}】
            </div>

            <div className="border border-slate-200 rounded-b-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">項目</th>
                    {hasTimeItems && (
                      <th className="px-4 py-2 text-center text-sm font-medium text-slate-700 w-32">
                        年間受講時間
                      </th>
                    )}
                    <th className="px-4 py-2 text-center text-sm font-medium text-slate-700 w-36">
                      <div className="text-xs leading-tight">
                        概算額（年間の平均<br />支出額・償却額）税込
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item, index) => {
                    const itemData = data.items[item.id] || { checked: false, hours: "", amount: "" };
                    const isChecked = itemData.checked;

                    return (
                      <tr
                        key={item.id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} ${
                          isChecked ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(item.id)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                            />
                            <span
                              className={`text-sm ${
                                isChecked ? "text-blue-700 font-medium" : "text-slate-700"
                              }`}
                            >
                              {item.label}
                            </span>
                          </label>
                        </td>
                        {hasTimeItems && (
                          <td className="px-4 py-2 text-center">
                            {item.hasTime ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="text"
                                  value={itemData.hours}
                                  onChange={(e) => handleHoursChange(item.id, e.target.value)}
                                  disabled={!isChecked}
                                  className={`w-16 px-2 py-1 border rounded text-right text-sm ${
                                    isChecked ? `border-blue-300 bg-white ${itemData.hours ? 'input-filled' : 'flash-green'}` : "border-slate-200 bg-slate-100"
                                  }`}
                                  placeholder="-"
                                />
                                <span className="text-xs text-slate-500">時間/年</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="text"
                              value={itemData.amount}
                              onChange={(e) => handleAmountChange(item.id, e.target.value)}
                              disabled={!isChecked}
                              className={`w-16 px-2 py-1 border rounded text-right text-sm ${
                                isChecked ? `border-blue-300 bg-white ${itemData.amount ? 'input-filled' : 'flash-green'}` : "border-slate-200 bg-slate-100"
                              }`}
                              placeholder="-"
                            />
                            <span className="text-xs text-slate-500">万円/年</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* その他 */}
      <div className="mb-6">
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className={`${data.items.otherSafety?.checked ? "bg-blue-50" : "bg-white"}`}>
                <td className="px-4 py-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.items.otherSafety?.checked || false}
                      onChange={handleOtherToggle}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`text-sm ${
                        data.items.otherSafety?.checked ? "text-blue-700 font-medium" : "text-slate-700"
                      }`}
                    >
                      その他
                    </span>
                  </label>
                  {data.items.otherSafety?.checked && (
                    <input
                      type="text"
                      value={data.otherDescription || ""}
                      onChange={(e) => update({ otherDescription: e.target.value })}
                      className={`mt-2 ml-8 w-64 px-3 py-2 border border-blue-300 rounded-lg text-sm ${data.otherDescription ? 'input-filled' : 'flash-green'}`}
                      placeholder="内容を入力"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-center w-32">
                  <span className="text-slate-400">-</span>
                </td>
                <td className="px-4 py-2 text-center w-36">
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="text"
                      value={data.items.otherSafety?.amount || ""}
                      onChange={(e) => handleOtherAmountChange(e.target.value)}
                      disabled={!data.items.otherSafety?.checked}
                      className={`w-16 px-2 py-1 border rounded text-right text-sm ${
                        data.items.otherSafety?.checked ? `border-blue-300 bg-white ${data.items.otherSafety?.amount ? 'input-filled' : 'flash-green'}` : "border-slate-200 bg-slate-100"
                      }`}
                      placeholder="-"
                    />
                    <span className="text-xs text-slate-500">万円/年</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
        （複数選択可）※「該当しない」場合、未記入で構いません。
      </div>
    </div>
  );
}
