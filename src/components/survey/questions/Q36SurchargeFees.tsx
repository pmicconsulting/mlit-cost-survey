"use client";

import { useQ36 } from "../SurveyContext";
import { SURCHARGE_ITEMS, FeeItem } from "../types";

export function Q36SurchargeFees() {
  const { data, update } = useQ36();

  const handleItemChange = (
    itemId: string,
    field: keyof FeeItem,
    value: string | boolean
  ) => {
    update({
      items: {
        ...data.items,
        [itemId]: { ...data.items[itemId], [field]: value },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問36 割増料金の収受</h3>
        <p className="text-sm text-blue-100 mt-1">
          適用、収受している割増料金をご回答ください。
        </p>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-center font-medium w-12">
                選択
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left font-medium">
                割増項目
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium w-32">
                定額（円）
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center font-medium w-28">
                割増率（%）
              </th>
            </tr>
          </thead>
          <tbody>
            {SURCHARGE_ITEMS.map((item) => {
              const itemData = data.items[item.id];
              const isOther = item.id === "other";
              return (
                <tr key={item.id} className={itemData?.selected ? "bg-blue-50" : "hover:bg-gray-50"}>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={itemData?.selected ?? false}
                      onChange={(e) => handleItemChange(item.id, "selected", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {isOther && itemData?.selected ? (
                      <div className="space-y-1">
                        <span>{item.label}</span>
                        <input
                          type="text"
                          value={data.otherDescription}
                          onChange={(e) => update({ otherDescription: e.target.value })}
                          placeholder="具体的にご記入ください"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm flash-pink"
                        />
                      </div>
                    ) : (
                      item.label
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={itemData?.fixedAmount ?? ""}
                      onChange={(e) => handleItemChange(item.id, "fixedAmount", e.target.value)}
                      disabled={!itemData?.selected}
                      className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={itemData?.percentage ?? ""}
                      onChange={(e) => handleItemChange(item.id, "percentage", e.target.value)}
                      disabled={!itemData?.selected}
                      className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-3 text-xs text-gray-500">
          ※ 定額または割増率のいずれか、または両方をご記入ください
        </p>
      </div>
    </div>
  );
}
