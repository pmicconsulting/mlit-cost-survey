"use client";

import { useQ17 } from "../SurveyContext";
import { ANCILLARY_WORK_ITEMS, AncillaryWorkItem } from "../types";

export function Q17AncillaryWorkFees() {
  const { data, update } = useQ17();

  const handleItemChange = (
    itemId: string,
    field: keyof AncillaryWorkItem,
    value: string | boolean
  ) => {
    const currentItem = data.items[itemId] || {
      selected: false,
      hourlyRate: "",
      includedInFare: false,
      lossAmount: "",
    };

    // selectedがtrueになった場合、他のチェックを自動でつける
    let updatedItem = { ...currentItem, [field]: value };

    // チェックボックスがONになった時、自動的にselectedもONに
    if (field === "includedInFare" && value === true) {
      updatedItem.selected = true;
    }

    update({
      items: {
        ...data.items,
        [itemId]: updatedItem,
      },
    });
  };

  const handleNotPerformingChange = (checked: boolean) => {
    update({ notPerforming: checked });
  };

  const handleOtherDescriptionChange = (value: string) => {
    update({ otherDescription: value });
  };

  const isDisabled = data.notPerforming;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問17 附帯作業料の収受実態</h3>
        <p className="text-sm text-blue-100 mt-1">
          附帯作業料の収受実態についてご回答ください。
          <br />
          ※「回数」単位で収受している場合、「1時間単位」に換算してください。
          <br />
          ※収受をできていない場合は1時間当たりの本来収受すべき額（収入損失額）をご回答ください。
        </p>
      </div>

      <div className="p-4">
        {/* テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left w-8">
                  <span className="text-xs text-gray-500">選択</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left min-w-[200px]">
                  附帯作業等の項目
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center w-32">
                  1時間当たり
                  <br />
                  収受額（税込）
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center w-28">
                  附帯作業料金が
                  <br />
                  運賃に含まれている
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center w-36">
                  収受できていない
                  <br />
                  1時間当たり
                  <br />
                  収入損失額（税込）
                </th>
              </tr>
            </thead>
            <tbody>
              {ANCILLARY_WORK_ITEMS.map((item) => {
                const itemData = data.items[item.id] || {
                  selected: false,
                  hourlyRate: "",
                  includedInFare: false,
                  lossAmount: "",
                };
                const isOther = item.id === "other";

                // いずれか1つでも入力があればtrue
                const hasAnyInput = itemData.includedInFare || itemData.hourlyRate || itemData.lossAmount;

                // 相互排他的な無効化ロジック
                // 1時間当たり収受額が入力されている → 他の2つを無効化
                // 含まれているがチェックされている → 他の2つを無効化
                // 収入損失額が入力されている → 他の2つを無効化
                const hourlyRateDisabled = isDisabled || !itemData.selected || itemData.includedInFare || !!itemData.lossAmount;
                const includedInFareDisabled = isDisabled || !itemData.selected || !!itemData.hourlyRate || !!itemData.lossAmount;
                const lossAmountDisabled = isDisabled || !itemData.selected || !!itemData.hourlyRate || itemData.includedInFare;

                return (
                  <tr
                    key={item.id}
                    className={`${
                      itemData.selected ? "bg-blue-50" : ""
                    } ${isDisabled ? "opacity-50" : ""}`}
                  >
                    {/* 選択チェックボックス */}
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={itemData.selected}
                        onChange={(e) =>
                          handleItemChange(item.id, "selected", e.target.checked)
                        }
                        disabled={isDisabled}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>

                    {/* 項目名 */}
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {isOther && (
                          <input
                            type="text"
                            value={data.otherDescription}
                            onChange={(e) =>
                              handleOtherDescriptionChange(e.target.value)
                            }
                            disabled={isDisabled || !itemData.selected}
                            placeholder="内容を記入"
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400"
                          />
                        )}
                      </div>
                    </td>

                    {/* 1時間当たり収受額 */}
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={itemData.hourlyRate}
                          onChange={(e) =>
                            handleItemChange(item.id, "hourlyRate", e.target.value)
                          }
                          disabled={hourlyRateDisabled}
                          placeholder=""
                          className={`w-full px-2 py-1 border border-gray-300 rounded text-right
                            ${itemData.selected && !hourlyRateDisabled ? (hasAnyInput ? "input-filled" : "flash-pink") : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                        />
                        <span className="text-gray-500 whitespace-nowrap">円</span>
                      </div>
                    </td>

                    {/* 運賃に含まれている */}
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <div className={`inline-block p-1 rounded ${
                        itemData.selected && !includedInFareDisabled && !hasAnyInput ? "flash-pink" : ""
                      }`}>
                        <input
                          type="checkbox"
                          checked={itemData.includedInFare}
                          onChange={(e) =>
                            handleItemChange(item.id, "includedInFare", e.target.checked)
                          }
                          disabled={includedInFareDisabled}
                          className={`w-4 h-4 rounded focus:ring-blue-500 ${
                            hasAnyInput ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </td>

                    {/* 収入損失額 */}
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={itemData.lossAmount}
                          onChange={(e) =>
                            handleItemChange(item.id, "lossAmount", e.target.value)
                          }
                          disabled={lossAmountDisabled}
                          placeholder=""
                          className={`w-full px-2 py-1 border border-gray-300 rounded text-right
                            ${itemData.selected && !lossAmountDisabled ? (hasAnyInput ? "input-filled" : "flash-pink") : "disabled:bg-gray-100 disabled:text-gray-400"}`}
                        />
                        <span className="text-gray-500 whitespace-nowrap">円</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 自社で行っていない */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.notPerforming}
              onChange={(e) => handleNotPerformingChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">
              附帯作業を自社で行っていない
            </span>
          </label>
        </div>

        {/* 複数選択可の注釈 */}
        <p className="mt-3 text-xs text-gray-500 text-right">（複数選択可）</p>
      </div>
    </div>
  );
}
