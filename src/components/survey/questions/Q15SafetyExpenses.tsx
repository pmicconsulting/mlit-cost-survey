"use client";

import { Shield, Clock, Wallet } from "lucide-react";
import { useQ15 } from "../SurveyContext";
import { SafetyItem } from "../types";

// 安全関連経費の項目
const SAFETY_ITEMS = [
  {
    category: "トラック法 法定",
    items: [
      { id: "managementTraining", label: "運行管理者講習の受講費用" },
      { id: "maintenanceTraining", label: "整備管理者講習の受講費用" },
      { id: "driverTraining", label: "運転者講習の受講費用" },
      { id: "initialTraining", label: "初任運転者に対する適性診断・特別指導" },
      { id: "elderlyDiagnosis", label: "高齢運転者に対する適性診断" },
      { id: "accidentDiagnosis", label: "事故惹起運転者に対する特定診断・特別指導" },
    ],
  },
  {
    category: "労働安全衛生法 法定",
    items: [
      { id: "healthCheck", label: "健康診断（定期・雇入時）" },
      { id: "stressCheck", label: "ストレスチェック" },
    ],
  },
  {
    category: "任意",
    items: [
      { id: "sleepApnea", label: "睡眠時無呼吸症候群（SAS）スクリーニング" },
      { id: "brainDock", label: "脳ドック" },
      { id: "driveRecorder", label: "ドライブレコーダーによる安全運転指導" },
      { id: "digitalTacho", label: "デジタルタコグラフによる安全運転指導" },
      { id: "safetyDevice", label: "衝突被害軽減ブレーキ等の安全装置装備車両の導入" },
      { id: "otherSafety", label: "その他安全対策費用" },
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

  // 集計
  const selectedCount = Object.values(data.items).filter((item: SafetyItem) => item.checked).length;
  const totalHours = Object.values(data.items)
    .filter((item: SafetyItem) => item.checked)
    .reduce((sum, item: SafetyItem) => sum + (parseFloat(item.hours) || 0), 0);
  const totalAmount = Object.values(data.items)
    .filter((item: SafetyItem) => item.checked)
    .reduce((sum, item: SafetyItem) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問15</h2>
          <p className="text-slate-600 text-sm">
            安全確保のための経費について、該当するものを選択し、年間の時間と金額をご記入ください
          </p>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-slate-500">選択項目数</div>
          <div className="text-2xl font-bold text-blue-600">{selectedCount}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            合計時間/年
          </div>
          <div className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}時間</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500 flex items-center justify-center gap-1">
            <Wallet className="w-4 h-4" />
            合計金額/年
          </div>
          <div className="text-2xl font-bold text-purple-600">{totalAmount.toFixed(1)}万円</div>
        </div>
      </div>

      {/* カテゴリごとの項目 */}
      {SAFETY_ITEMS.map((category) => (
        <div key={category.category} className="mb-6">
          <div
            className={`px-4 py-2 rounded-t-lg font-bold text-sm ${
              category.category.includes("法定") ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
            }`}
          >
            【{category.category}】
          </div>

          <div className="border border-slate-200 rounded-b-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">項目</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-slate-700 w-28">
                    年間時間
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-slate-700 w-28">
                    年間金額
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
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(item.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
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
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={itemData.hours}
                            onChange={(e) => handleHoursChange(item.id, e.target.value)}
                            disabled={!isChecked}
                            className={`w-16 px-2 py-1 border rounded text-right text-sm ${
                              isChecked ? "border-blue-300 bg-white" : "border-slate-200 bg-slate-100"
                            }`}
                            placeholder="-"
                          />
                          <span className="text-xs text-slate-500">時間</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={itemData.amount}
                            onChange={(e) => handleAmountChange(item.id, e.target.value)}
                            disabled={!isChecked}
                            className={`w-16 px-2 py-1 border rounded text-right text-sm ${
                              isChecked ? "border-blue-300 bg-white" : "border-slate-200 bg-slate-100"
                            }`}
                            placeholder="-"
                          />
                          <span className="text-xs text-slate-500">万円</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* その他の説明入力 */}
      {data.items.otherSafety?.checked && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            「その他安全対策費用」の内容
          </label>
          <textarea
            value={data.otherDescription}
            onChange={(e) => update({ otherDescription: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="その他の安全対策費用の内容をご記入ください"
          />
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
        ※ 該当する項目にチェックを入れると、時間・金額の入力欄が有効になります。
        <br />
        ※ 時間は運転者1人当たりの年間合計、金額は事業全体の年間合計でご記入ください。
      </div>
    </div>
  );
}
