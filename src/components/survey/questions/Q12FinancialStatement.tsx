"use client";

import { useMemo } from "react";
import { Calculator } from "lucide-react";
import { useQ12 } from "../SurveyContext";
import { Q12Data } from "../types";

const Q12_ITEMS: { id: keyof Q12Data; label: string; category: string }[] = [
  { id: "revenue", label: "営業収益（合計）", category: "収益" },
  { id: "facilityUsageFee", label: "施設使用料", category: "費用" },
  { id: "facilityTax", label: "施設賦課税", category: "費用" },
  { id: "accidentCompensation", label: "事故賠償費", category: "費用" },
  { id: "otherExpenses", label: "その他", category: "費用" },
  { id: "subcontractCost", label: "傭車費用", category: "費用" },
  { id: "adminExpenses", label: "一般管理費（合計）", category: "費用" },
  { id: "operatingExpenses", label: "営業費用（合計）", category: "費用" },
  { id: "operatingIncome", label: "営業損益", category: "損益" },
  { id: "ordinaryIncome", label: "経常損益", category: "損益" },
];

// 数値フォーマット
const formatNumber = (value: string): string => {
  const num = parseInt(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

interface Q12FinancialStatementProps {
  className?: string;
}

export function Q12FinancialStatement({ className = "" }: Q12FinancialStatementProps) {
  const { data, update } = useQ12();

  const handleChange = (itemId: keyof Q12Data, value: string) => {
    const cleanValue = value.replace(/[^0-9-]/g, "");
    update({ [itemId]: cleanValue });
  };

  const total = useMemo(() => {
    const revenue = parseInt(data.revenue) || 0;
    return { revenue };
  }, [data.revenue]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Calculator className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問12</h2>
          <p className="text-slate-600 text-sm">
            一般貨物自動車運送事業損益明細表の数値をご記入ください（単位：千円）
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700 w-1/2">
                項目
              </th>
              <th className="border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700">
                金額（千円）
              </th>
            </tr>
          </thead>
          <tbody>
            {Q12_ITEMS.map((item, index) => {
              const isIncome = item.category === "損益";
              const value = data[item.id] || "";
              const numValue = parseInt(value) || 0;
              const isNegative = numValue < 0;

              return (
                <tr
                  key={item.id}
                  className={`${
                    isIncome ? "bg-blue-50" : index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td
                    className={`border border-slate-300 px-4 py-3 text-sm ${
                      isIncome ? "font-bold text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="text"
                        value={formatNumber(value)}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm ${
                          isNegative ? "text-red-600" : ""
                        } ${isIncome ? "border-blue-300 bg-white" : "border-slate-300"}`}
                        placeholder="0"
                      />
                      <span className="text-sm text-slate-500 w-10">千円</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">入力された営業収益:</span>
          <span className="font-medium">{total.revenue.toLocaleString()} 千円</span>
        </div>
      </div>

      <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
        ※ 損益（営業損益・経常損益）は赤字の場合マイナス値で入力してください。
      </div>
    </div>
  );
}
