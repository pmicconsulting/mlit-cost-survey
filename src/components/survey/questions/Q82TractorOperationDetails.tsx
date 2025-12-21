"use client";

import { useQ82 } from "../SurveyContext";
import { WorkerType } from "../types";

const WORKER_OPTIONS: { id: WorkerType; label: string }[] = [
  { id: "driver", label: "運転者" },
  { id: "shipper", label: "荷主" },
  { id: "other", label: "その他" },
];

export function Q82TractorOperationDetails() {
  const { data, update } = useQ82();

  const inputClass = (value: string | undefined) =>
    `px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${value ? 'input-filled' : 'flash-green'}`;

  const tableInputClass = (value: string | undefined) =>
    `w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${value ? 'input-filled' : 'flash-green'}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問82 運行詳細</h3>
        <p className="text-sm text-orange-100 mt-1">
          主な輸送における1運行の詳細をご記入ください。
        </p>
      </div>

      {/* PC/タブレット: 表形式 */}
      <div className="hidden md:block p-4">
        <p className="text-xs text-gray-500 mb-3">
          ※1日に複数回実施する場合でも、1回あたりの輸送についてご記入ください。
        </p>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left" colSpan={2}>主な運行に係る所要時間、距離等</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-20">記入例</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-44">平均的な所要時間等</th>
            </tr>
          </thead>
          <tbody>
            {/* 運転者が出社 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 運転者が出社
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2" colSpan={2}>輸送品目は何ですか？</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">食品/飲料</td>
              <td className="border border-gray-300 px-3 py-2">
                <input
                  type="text"
                  value={data.cargoItem}
                  onChange={(e) => update({ cargoItem: e.target.value })}
                  placeholder="例：食品"
                  className={`w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.cargoItem ? 'input-filled' : 'flash-green'}`}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2 w-28" rowSpan={1}>乗務前点呼・整備点検等</td>
              <td className="border border-gray-300 px-3 py-2">出社から運行開始までの所要時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">15分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.preDepartureTime}
                    onChange={(e) => update({ preDepartureTime: e.target.value })}
                    className={tableInputClass(data.preDepartureTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>

            {/* 車両乗務、運行開始 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 車両乗務、運行開始（車庫を出発）
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2" rowSpan={2}>指定場所へ移動時間と距離</td>
              <td className="border border-gray-300 px-3 py-2">車庫から積込場所までの所要時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">15分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.toLoadingLocationTime}
                    onChange={(e) => update({ toLoadingLocationTime: e.target.value })}
                    className={tableInputClass(data.toLoadingLocationTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">車庫から積込場所までの走行距離（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">5km</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.toLoadingLocationDistance}
                    onChange={(e) => update({ toLoadingLocationDistance: e.target.value })}
                    className={tableInputClass(data.toLoadingLocationDistance)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">km</span>
                </div>
              </td>
            </tr>

            {/* 積込場所に到着 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 積込場所に到着
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">待機時間</td>
              <td className="border border-gray-300 px-3 py-2">待機時間（平均）<br/><span className="text-xs text-gray-500">（受付時間、伝票の受け渡し時間等）</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">30分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.loadingWaitTime}
                    onChange={(e) => update({ loadingWaitTime: e.target.value })}
                    className={tableInputClass(data.loadingWaitTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">附帯作業時間</td>
              <td className="border border-gray-300 px-3 py-2">附帯作業の所要時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">30分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.loadingAncillaryTime}
                    onChange={(e) => update({ loadingAncillaryTime: e.target.value })}
                    className={tableInputClass(data.loadingAncillaryTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">積込作業の所要時間</td>
              <td className="border border-gray-300 px-3 py-2">積込作業の所要時間（平均）<br/><span className="text-xs text-gray-500">・運転者による準備作業時間を含む<br/>・運転者が実施しない場合でも記入</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">30分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.loadingWorkTime}
                    onChange={(e) => update({ loadingWorkTime: e.target.value })}
                    className={tableInputClass(data.loadingWorkTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">誰が積込作業を実施しますか</td>
              <td className="border border-gray-300 px-3 py-2">①運転者 ②荷主・倉庫業者等 ③その他</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">→</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex gap-1 flex-wrap">
                  {WORKER_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-1 px-2 py-1 cursor-pointer rounded border text-xs ${
                        data.loadingWorker === option.id
                          ? "bg-orange-50 border-orange-300"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tractorLoadingWorker"
                        value={option.id}
                        checked={data.loadingWorker === option.id}
                        onChange={() => update({ loadingWorker: option.id })}
                        className="w-3 h-3 text-orange-600 focus:ring-orange-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">積付（養生・固縛等）作業時間</td>
              <td className="border border-gray-300 px-3 py-2">積込作業後の積付（養生・固縛）作業時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">20分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.loadingSecuringTime}
                    onChange={(e) => update({ loadingSecuringTime: e.target.value })}
                    className={tableInputClass(data.loadingSecuringTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>

            {/* 積込場所を出発 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 積込場所を出発
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2" rowSpan={2}>出発地→到着地<br/>運行の時間・距離</td>
              <td className="border border-gray-300 px-3 py-2">出発地から到着地までの所要時間（平均）<br/><span className="text-xs text-gray-500">（連続運転時間の休憩時間等を含む/休息期間を含まない）</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">55分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.transitTimeHours}
                    onChange={(e) => update({ transitTimeHours: e.target.value })}
                    className={`w-14 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.transitTimeHours ? 'input-filled' : 'flash-green'}`}
                  />
                  <span className="text-gray-600">時間</span>
                  <input
                    type="text"
                    value={data.transitTimeMinutes}
                    onChange={(e) => update({ transitTimeMinutes: e.target.value })}
                    className={`w-14 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.transitTimeMinutes ? 'input-filled' : 'flash-green'}`}
                  />
                  <span className="text-gray-600">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">出発地から到着地までの走行距離（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">40km</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.transitDistance}
                    onChange={(e) => update({ transitDistance: e.target.value })}
                    className={tableInputClass(data.transitDistance)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">km</span>
                </div>
              </td>
            </tr>

            {/* 目的地に到着 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 目的地に到着
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">待機時間</td>
              <td className="border border-gray-300 px-3 py-2">待機時間（平均）<br/><span className="text-xs text-gray-500">（受付時間、伝票の受け渡し時間等）</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">30分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.unloadingWaitTime}
                    onChange={(e) => update({ unloadingWaitTime: e.target.value })}
                    className={tableInputClass(data.unloadingWaitTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">取卸作業の所要時間</td>
              <td className="border border-gray-300 px-3 py-2">取卸作業の所要時間（平均）<br/><span className="text-xs text-gray-500">・運転者による準備作業時間を含む<br/>・運転者が実施しない場合でも記入</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">50分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.unloadingWorkTime}
                    onChange={(e) => update({ unloadingWorkTime: e.target.value })}
                    className={tableInputClass(data.unloadingWorkTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">誰が取卸作業を実施しますか</td>
              <td className="border border-gray-300 px-3 py-2">①運転者 ②荷主・倉庫業者等 ③その他</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">→</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex gap-1 flex-wrap">
                  {WORKER_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-1 px-2 py-1 cursor-pointer rounded border text-xs ${
                        data.unloadingWorker === option.id
                          ? "bg-orange-50 border-orange-300"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tractorUnloadingWorker"
                        value={option.id}
                        checked={data.unloadingWorker === option.id}
                        onChange={() => update({ unloadingWorker: option.id })}
                        className="w-3 h-3 text-orange-600 focus:ring-orange-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">附帯作業時間</td>
              <td className="border border-gray-300 px-3 py-2">附帯作業の所要時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">15分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.unloadingAncillaryTime}
                    onChange={(e) => update({ unloadingAncillaryTime: e.target.value })}
                    className={tableInputClass(data.unloadingAncillaryTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>

            {/* 目的地を出発 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 目的地を出発
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2" rowSpan={2}>車庫へ移動時間と距離</td>
              <td className="border border-gray-300 px-3 py-2">目的地から車庫までの所要時間（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">15分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.returnToGarageTime}
                    onChange={(e) => update({ returnToGarageTime: e.target.value })}
                    className={tableInputClass(data.returnToGarageTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">目的地から車庫までの走行距離（平均）</td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">5km</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.returnToGarageDistance}
                    onChange={(e) => update({ returnToGarageDistance: e.target.value })}
                    className={tableInputClass(data.returnToGarageDistance)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">km</span>
                </div>
              </td>
            </tr>

            {/* 営業所の車庫に到着 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 営業所の車庫に到着
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">乗務後点呼・整備点検等</td>
              <td className="border border-gray-300 px-3 py-2">帰庫から退社までの所要時間（平均）<br/><span className="text-xs text-gray-500">・乗務後点呼、乗務後整備点検、指導等<br/>・安全指導、作業服着替え等の所要時間</span></td>
              <td className="border border-gray-300 px-3 py-2 text-center flash-green text-green-700 font-medium">15分</td>
              <td className="border border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.postArrivalTime}
                    onChange={(e) => update({ postArrivalTime: e.target.value })}
                    className={tableInputClass(data.postArrivalTime)}
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                </div>
              </td>
            </tr>

            {/* 運転者が退社 */}
            <tr className="bg-orange-50">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-orange-800">
                ▼ 運転者が退社
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* スマートフォン: カード形式 */}
      <div className="md:hidden p-4 space-y-6">
        {/* 輸送品目 */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            輸送品目
          </label>
          <input
            type="text"
            value={data.cargoItem}
            onChange={(e) => update({ cargoItem: e.target.value })}
            placeholder="例：食品、機械部品など"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${data.cargoItem ? 'input-filled' : 'flash-green'}`}
          />
        </div>

        {/* 出発前 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">出発前</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                出社から運行開始までの所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.preDepartureTime}
                  onChange={(e) => update({ preDepartureTime: e.target.value })}
                  className={inputClass(data.preDepartureTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                車庫から積込場所までの所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.toLoadingLocationTime}
                  onChange={(e) => update({ toLoadingLocationTime: e.target.value })}
                  className={inputClass(data.toLoadingLocationTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                車庫から積込場所までの走行距離
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.toLoadingLocationDistance}
                  onChange={(e) => update({ toLoadingLocationDistance: e.target.value })}
                  className={inputClass(data.toLoadingLocationDistance)}
                />
                <span className="text-gray-600 w-8">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 積込作業 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">積込作業</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                積込場所での待機時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.loadingWaitTime}
                  onChange={(e) => update({ loadingWaitTime: e.target.value })}
                  className={inputClass(data.loadingWaitTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                積込場所での附帯作業時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.loadingAncillaryTime}
                  onChange={(e) => update({ loadingAncillaryTime: e.target.value })}
                  className={inputClass(data.loadingAncillaryTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                積込作業の所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.loadingWorkTime}
                  onChange={(e) => update({ loadingWorkTime: e.target.value })}
                  className={inputClass(data.loadingWorkTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                積込作業の実施者
              </label>
              <div className="flex gap-2 flex-wrap">
                {WORKER_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-1 px-3 py-2 cursor-pointer rounded-lg border text-sm ${
                      data.loadingWorker === option.id
                        ? "bg-orange-50 border-orange-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tractorLoadingWorkerMobile"
                      value={option.id}
                      checked={data.loadingWorker === option.id}
                      onChange={() => update({ loadingWorker: option.id })}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                積付（養生・固縛等）作業時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.loadingSecuringTime}
                  onChange={(e) => update({ loadingSecuringTime: e.target.value })}
                  className={inputClass(data.loadingSecuringTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>
          </div>
        </div>

        {/* 走行 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">走行（出発地→到着地）</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                出発地から到着地までの所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.transitTimeHours}
                  onChange={(e) => update({ transitTimeHours: e.target.value })}
                  className={`w-16 ${inputClass(data.transitTimeHours)}`}
                />
                <span className="text-gray-600">時間</span>
                <input
                  type="text"
                  value={data.transitTimeMinutes}
                  onChange={(e) => update({ transitTimeMinutes: e.target.value })}
                  className={`w-16 ${inputClass(data.transitTimeMinutes)}`}
                />
                <span className="text-gray-600">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                出発地から到着地までの走行距離
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.transitDistance}
                  onChange={(e) => update({ transitDistance: e.target.value })}
                  className={inputClass(data.transitDistance)}
                />
                <span className="text-gray-600 w-8">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 取卸作業 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">取卸作業</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                目的地での待機時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.unloadingWaitTime}
                  onChange={(e) => update({ unloadingWaitTime: e.target.value })}
                  className={inputClass(data.unloadingWaitTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                取卸作業の所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.unloadingWorkTime}
                  onChange={(e) => update({ unloadingWorkTime: e.target.value })}
                  className={inputClass(data.unloadingWorkTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                取卸作業の実施者
              </label>
              <div className="flex gap-2 flex-wrap">
                {WORKER_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-1 px-3 py-2 cursor-pointer rounded-lg border text-sm ${
                      data.unloadingWorker === option.id
                        ? "bg-orange-50 border-orange-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tractorUnloadingWorkerMobile"
                      value={option.id}
                      checked={data.unloadingWorker === option.id}
                      onChange={() => update({ unloadingWorker: option.id })}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                目的地での附帯作業時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.unloadingAncillaryTime}
                  onChange={(e) => update({ unloadingAncillaryTime: e.target.value })}
                  className={inputClass(data.unloadingAncillaryTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>
          </div>
        </div>

        {/* 帰庫 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">帰庫</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                目的地から車庫までの所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.returnToGarageTime}
                  onChange={(e) => update({ returnToGarageTime: e.target.value })}
                  className={inputClass(data.returnToGarageTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                目的地から車庫までの走行距離
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.returnToGarageDistance}
                  onChange={(e) => update({ returnToGarageDistance: e.target.value })}
                  className={inputClass(data.returnToGarageDistance)}
                />
                <span className="text-gray-600 w-8">km</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                帰庫から退社までの所要時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.postArrivalTime}
                  onChange={(e) => update({ postArrivalTime: e.target.value })}
                  className={inputClass(data.postArrivalTime)}
                />
                <span className="text-gray-600 w-8">分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
