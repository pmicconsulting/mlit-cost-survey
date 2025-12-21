"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Truck, CheckCircle2, Info, ChevronDown, ChevronUp } from "lucide-react";

type BranchCount = "1" | "2-9" | "10+" | null;
type VehicleType = "dryvan_only" | "special_only" | "both" | "none" | null;

// 脚注データ
const DRYVAN_LIST = [
  "バンボディ",
  "ウィングボディ",
  "平ボディ",
  "幌ウィング",
];

const SPECIAL_VEHICLE_LIST = [
  "冷蔵車・冷凍車",
  "ダンプ車",
  "タンク車",
  "バルク車",
  "コンテナ輸送車",
  "コンクリートミキサー車",
  "トラック搭載型クレーン車",
  "霊柩車",
  "一般廃棄物輸送車（塵芥車、バキュームカー、ユニック、平ボディ等）",
  "車積載車（キャリアカー）",
  "重量物輸送車",
];

// 結果メッセージの定義
const RESULT_MESSAGES: Record<Exclude<VehicleType, null>, { title: string; message: string }> = {
  dryvan_only: {
    title: "ドライバン等を1両以上ご回答ください",
    message: "可能であれば、最大積載量が異なる車両をお持ちの場合、ご入力ください。",
  },
  special_only: {
    title: "該当する特殊車両を1両以上ご回答ください",
    message: "例：海上コンテナ輸送車、重量物輸送車を保有する場合、各1台以上と、合計2両以上をご回答ください。（最低２両）",
  },
  both: {
    title: "ドライバン等と特殊車両の両方をご回答ください",
    message: "ドライバン等を1両以上、該当する特殊車両を1両以上ご記入ください。",
  },
  none: {
    title: "その他の車両についてご回答ください",
    message: "ドライバン等、特殊車両以外の車両についてご回答ください。",
  },
};

export default function SelectTruckPage() {
  const [branchCount, setBranchCount] = useState<BranchCount>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const question2Ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // アコーディオン開閉
  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  // 質問1を変更したら質問2と結果をリセット
  const handleBranchCountChange = (value: BranchCount) => {
    setBranchCount(value);
    setVehicleType(null);
  };

  // 質問2を変更
  const handleVehicleTypeChange = (value: VehicleType) => {
    setVehicleType(value);
  };

  // 質問1選択後に質問2へスクロール
  useEffect(() => {
    if ((branchCount === "1" || branchCount === "2-9") && question2Ref.current) {
      setTimeout(() => {
        question2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [branchCount]);

  // 質問2選択後に結果へスクロール
  useEffect(() => {
    if (vehicleType && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [vehicleType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/mlit_logo.png"
                alt="国土交通省"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              トップへ戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            車両選択ガイド
          </h1>
          <p className="text-slate-600">
            質問に回答して、ご回答される車両をご確認ください
          </p>
        </div>

        {/* 質問1: 営業所数 */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
              1
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              該当する営業所数をクリックしてください
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "1" as BranchCount, label: "1営業所" },
              { value: "2-9" as BranchCount, label: "2〜9の営業所" },
              { value: "10+" as BranchCount, label: "10以上の営業所" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleBranchCountChange(option.value)}
                className={`relative p-6 rounded-xl border-2 transition-all text-center ${
                  branchCount === option.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                {branchCount === option.value && (
                  <CheckCircle2 className="absolute top-3 right-3 w-6 h-6 text-blue-600" />
                )}
                <span
                  className={`text-lg font-medium ${
                    branchCount === option.value ? "text-blue-700" : "text-slate-700"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 質問2: 車両タイプ（1営業所の場合のみ表示） */}
        {branchCount === "1" && (
          <section
            ref={question2Ref}
            className="bg-white rounded-2xl p-8 border border-slate-200 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                2
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                該当するものをクリックしてください
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { value: "dryvan_only" as VehicleType, label: "① ドライバン等だけを保有" },
                { value: "special_only" as VehicleType, label: "② 特殊車両だけを保有" },
                { value: "both" as VehicleType, label: "③ ドライバン等と特殊車両を保有" },
                { value: "none" as VehicleType, label: "④ ドライバン等・特殊車両がない" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleVehicleTypeChange(option.value)}
                  className={`relative w-full p-5 rounded-xl border-2 transition-all text-left ${
                    vehicleType === option.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  {vehicleType === option.value && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
                  )}
                  <span
                    className={`text-lg font-medium ${
                      vehicleType === option.value ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 脚注 */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-slate-700">脚注</span>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-700">ドライバン等：</span>
                  <span>{DRYVAN_LIST.join("、")}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">特殊車両：</span>
                  <span>{SPECIAL_VEHICLE_LIST.join("、")}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 質問2: 車両タイプ（2〜9営業所の場合） */}
        {branchCount === "2-9" && (
          <section
            ref={question2Ref}
            className="bg-white rounded-2xl p-8 border border-slate-200 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                2
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                該当するものをクリックしてください
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { value: "dryvan_only" as VehicleType, label: "① ドライバン等だけを保有" },
                { value: "special_only" as VehicleType, label: "② 特殊車両だけを保有" },
                { value: "both" as VehicleType, label: "③ ドライバン等と特殊車両を保有" },
                { value: "none" as VehicleType, label: "④ ドライバン等・特殊車両がない" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleVehicleTypeChange(option.value)}
                  className={`relative w-full p-5 rounded-xl border-2 transition-all text-left ${
                    vehicleType === option.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  {vehicleType === option.value && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
                  )}
                  <span
                    className={`text-lg font-medium ${
                      vehicleType === option.value ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 脚注 */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-slate-700">脚注</span>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-700">ドライバン等：</span>
                  <span>{DRYVAN_LIST.join("、")}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">特殊車両：</span>
                  <span>{SPECIAL_VEHICLE_LIST.join("、")}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 10以上の営業所の場合 */}
        {branchCount === "10+" && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                車両を配置している営業所の数が10拠点以上
              </h2>
            </div>

            <p className="text-slate-700 mb-6">
              以下の手順に従って、回答する車両を選定してください。各手順をクリックすると詳細が表示されます。
            </p>

            {/* アコーディオン: 手順1〜3 */}
            <div className="space-y-3">
              {/* 手順1 */}
              <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
                <button
                  onClick={() => toggleStep(1)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                      1
                    </span>
                    <span className="font-bold text-slate-900">
                      営業所の選定方法をチェックします
                    </span>
                  </div>
                  {expandedStep === 1 ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedStep === 1 && (
                  <div className="p-5 pt-0 border-t border-slate-100">
                    <div className="space-y-4 text-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <div>
                          <p>
                            車両を配置している営業所が所在する<span className="font-bold">地域ブロック※</span>ごとに1か所以上の営業所を選定します。
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            ※地域ブロックは、以下の運輸局等の管轄地域とします。（北海道、東北、関東、北陸信越、中部、近畿、中国、四国、九州、沖縄）
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <p>
                          同一の地域ブロックから複数の営業所を選定する場合は、<span className="font-bold">地域的な偏りがないように</span>選定してください。
                        </p>
                      </div>

                      {/* 例示 */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
                        <h5 className="font-bold text-blue-800 mb-3">例示</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">（例1）</span>
                            <span>100営業所あり、上記10地域ブロックにそれぞれ所在する場合</span>
                            <br />
                            <span className="pl-4">→ 各ブロックから各1営業所を選定（地域バランスを考慮して営業所を選定します）</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">（例2）</span>
                            <span>12営業所のうち、関東に3営業所、中部に4営業所、近畿に5営業所所在する場合</span>
                            <br />
                            <span className="pl-4">→ 関東から3営業所、中部から3営業所、近畿から4営業所を選定（合計10営業所を選定します）</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">（例3）</span>
                            <span>11営業所あり、関東にすべて所在する場合</span>
                            <br />
                            <span className="pl-4">→ 関東から地域的な偏りがないように10営業所を選定（主要な営業所を選択します）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 手順2 */}
              <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
                <button
                  onClick={() => toggleStep(2)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                      2
                    </span>
                    <span className="font-bold text-slate-900">
                      選定した各営業所ごとに回答する車両を選定してください
                    </span>
                  </div>
                  {expandedStep === 2 ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedStep === 2 && (
                  <div className="p-5 pt-0 border-t border-slate-100">
                    <div className="space-y-4 text-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <div>
                          <p className="font-medium">ドライバン等を保有し、「特殊車両」を保有していない場合</p>
                          <p className="text-slate-600 pl-4">→ ドライバン等について1台ご回答ください。</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <div>
                          <p className="font-medium">ドライバン等と特殊車両を保有している場合</p>
                          <p className="text-slate-600 pl-4">→ ドライバン等とそれぞれの特殊車両の車型につき、1台ずつご回答ください。</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <div>
                          <p className="font-medium">ドライバン等を保有せず、特殊車両だけを保有している場合</p>
                          <p className="text-slate-600 pl-4">→ それぞれの特殊車両の車型につき、1台ずつご回答ください。</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">○</span>
                        <div>
                          <p className="font-medium">ドライバン等を保有せず、特殊車両も保有していない場合</p>
                          <p className="text-slate-600 pl-4">→ その他車型について1台ご回答ください。</p>
                        </div>
                      </div>

                      {/* 車両タイプの定義 */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">ドライバン等：</span>
                        <span className="text-blue-700">{DRYVAN_LIST.join("、")}</span>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <span className="font-medium text-purple-800">特殊車両：</span>
                        <span className="text-purple-700">{SPECIAL_VEHICLE_LIST.join("、")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 手順3 */}
              <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
                <button
                  onClick={() => toggleStep(3)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                      3
                    </span>
                    <span className="font-bold text-slate-900">
                      営業所が保有する車両から、回答車両を選定する優先基準
                    </span>
                  </div>
                  {expandedStep === 3 ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedStep === 3 && (
                  <div className="p-5 pt-0 border-t border-slate-100">
                    <div className="space-y-4 text-slate-700">
                      <p>
                        車両共通の優先選定基準は以下の通りです。
                      </p>
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <p className="text-sm text-amber-800 mb-3">
                          ※可能な限り以下の基準にあてはまる車両をご選定ください。保有する車両が以下の基準のいずれにも該当しない場合（中古車もしくはリース車両）でも、以下条件に近い車両を1台選定の上、ご回答いただきますようお願いいたします。
                        </p>
                      </div>

                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full font-bold text-sm flex-shrink-0">①</span>
                          <span>最も稼働率の高い車両（1日当たり平均稼働時間8〜15時間）であること</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full font-bold text-sm flex-shrink-0">②</span>
                          <span>購入した車両（リース車両ではない）であること</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full font-bold text-sm flex-shrink-0">③</span>
                          <span>新車で調達した車両（中古車で調達していない車両）であること</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full font-bold text-sm flex-shrink-0">④</span>
                          <span>新規登録から5年以内であること</span>
                        </li>
                      </ul>

                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">※</span>
                          上記の優先基準に全てに当てはまらなくても問題はありません。優先していただきたい基準ですので、仮に全て当てはまらない車両しか保有していない場合には、当該車両についてご回答ください。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  10以上の営業所
                </span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}

        {/* 結果表示: 2〜9営業所 ② 特殊車両だけを保有 */}
        {branchCount === "2-9" && vehicleType === "special_only" && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                ご協力をお願いしたい車両
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              {/* 主要な指示 */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-bold text-lg">
                    車両を配置している全ての営業所を調査対象としてください。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    回答数は、「車両配置する営業所数 ≦ 回答車両数」となります。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    各営業所単位で、ご判断ください。
                  </p>
                </div>
              </div>

              {/* 強調メッセージ（赤字） */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <p className="text-red-600 font-bold text-lg">
                  特殊車両の車型につき、1台以上ずつご回答ください。
                </p>
              </div>

              {/* 例示 */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">【例示】</h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">札幌営業所：</span>
                    <span>ダンプ車4両、タンク車1両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ダンプ車1両以上、タンク車1両</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">旭川営業所：</span>
                    <span>ダンプ車5両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ダンプ車1両以上</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">十勝営業所：</span>
                    <span>飼料バルク車5両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">バルク車1両以上</span>
                  </div>
                </div>
              </div>

              {/* 留意点 */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  <span className="font-medium">ご留意点：</span>
                  最低各営業所各1両、可能であれば、上記のような車両構成となります
                </p>
              </div>

              {/* 特殊車両の定義 */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">特殊車両：</span>
                <span className="text-purple-700">{SPECIAL_VEHICLE_LIST.join("、")}</span>
              </div>
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  2〜9営業所
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  特殊車両だけを保有
                </span>
              </div>
            </div>

            {/* 車両選定の優先基準 */}
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="text-lg">○</span>
                車両選定の優先基準
                <span className="text-sm font-normal text-amber-600">
                  ・・・全て該当しなくても問題ありません
                </span>
              </h4>
              <ul className="space-y-2 text-amber-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>最も稼働率の高い車両を優先（1日当たり平均稼働時間8〜15時間）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>購入した車両（リース車両でない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新車で調達した車両（中古車で調達していない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新規登録から5年以内（新規登録から5年超経過していない）を優先</span>
                </li>
              </ul>

              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-lg">○</span>
                車格は、小型車、中型車、大型車、トレーラのいずれでも構いません。
              </h4>

              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-amber-700">※</span>{" "}
                  上記の車両選定の基準に当てはまらない車両を保有する場合でも、ご回答ください。
                </p>
                <p className="text-sm text-slate-600 mt-2 pl-4">
                  （例）新規登録から8年経過後、中古で取得した車両が最も稼働率が高く、新車調達車両がない場合
                  <br />
                  <span className="pl-4">→ この車両をご回答いただいて差支えありません。</span>
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}

        {/* 結果表示: 2〜9営業所 ③ ドライバン等と特殊車両を保有 */}
        {branchCount === "2-9" && vehicleType === "both" && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                ご協力をお願いしたい車両
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              {/* 主要な指示 */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-bold text-lg">
                    車両を配置している全ての営業所を調査対象としてください。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    回答数は、「車両配置する営業所数 ≦ 回答車両数」となります。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    各営業所単位で、ご判断ください。
                  </p>
                </div>
              </div>

              {/* 強調メッセージ（赤字） */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <p className="text-red-600 font-bold text-lg">
                  ドライバン等と各特殊車両の車型につき、1台以上ずつご回答ください。
                </p>
              </div>

              {/* 例示 */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">【例示】</h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">仙台営業所：</span>
                    <span>ドライバン5両保有</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ドライバン1両以上を回答</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">郡山営業所：</span>
                    <span>ダンプ車3両、ユニック車2両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ダンプ車1両以上、ユニック車1両を回答</span>
                  </div>
                </div>
              </div>

              {/* 留意点 */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  <span className="font-medium">ご留意点：</span>
                  最低各営業所各1両、可能であれば、上記のような車両構成となります
                </p>
              </div>

              {/* 車両タイプの定義 */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">ドライバン等：</span>
                <span className="text-blue-700">{DRYVAN_LIST.join("、")}</span>
              </div>
              <div className="mt-2 p-4 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">特殊車両：</span>
                <span className="text-purple-700">{SPECIAL_VEHICLE_LIST.join("、")}</span>
              </div>
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  2〜9営業所
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  ドライバン等と特殊車両を保有
                </span>
              </div>
            </div>

            {/* 車両選定の優先基準 */}
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="text-lg">○</span>
                車両選定の優先基準
                <span className="text-sm font-normal text-amber-600">
                  ・・・全て該当しなくても問題ありません
                </span>
              </h4>
              <ul className="space-y-2 text-amber-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>最も稼働率の高い車両を優先（1日当たり平均稼働時間8〜15時間）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>購入した車両（リース車両でない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新車で調達した車両（中古車で調達していない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新規登録から5年以内（新規登録から5年超経過していない）を優先</span>
                </li>
              </ul>

              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-lg">○</span>
                車格は、小型車、中型車、大型車、トレーラのいずれでも構いません。
              </h4>

              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-amber-700">※</span>{" "}
                  上記の車両選定の基準に当てはまらない車両を保有する場合でも、ご回答ください。
                </p>
                <p className="text-sm text-slate-600 mt-2 pl-4">
                  （例）新規登録から8年経過後、中古で取得した車両が最も稼働率が高く、新車調達車両がない場合
                  <br />
                  <span className="pl-4">→ この車両をご回答いただいて差支えありません。</span>
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}

        {/* 結果表示: 2〜9営業所 ④ ドライバン等・特殊車両がない */}
        {branchCount === "2-9" && vehicleType === "none" && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                ご協力をお願いしたい車両
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              {/* 主要な指示 */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-bold text-lg">
                    車両を配置している全ての営業所を調査対象としてください。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    回答数は、「車両配置する営業所数 ≦ 回答車両数」となります。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    各営業所単位で、ご判断ください。
                  </p>
                </div>
              </div>

              {/* 強調メッセージ（赤字） */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <p className="text-red-600 font-bold text-lg">
                  ドライバン等、特殊車両に該当しない、貴社が保有する車型について1台以上ご回答ください。
                </p>
              </div>

              {/* 例示 */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">【例示】</h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">旭川営業所：</span>
                    <span>家畜運搬車5両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">家畜運搬車1両</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">十勝営業所：</span>
                    <span>家畜運搬車5両</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">家畜運搬車1両</span>
                  </div>
                </div>
              </div>

              {/* 留意点 */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  <span className="font-medium">ご留意点：</span>
                  最低各営業所各1両
                </p>
              </div>
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  2〜9営業所
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  ドライバン等・特殊車両がない
                </span>
              </div>
            </div>

            {/* 車両選定の優先基準 */}
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="text-lg">○</span>
                車両選定の優先基準
                <span className="text-sm font-normal text-amber-600">
                  ・・・全て該当しなくても問題ありません
                </span>
              </h4>
              <ul className="space-y-2 text-amber-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>最も稼働率の高い車両を優先（1日当たり平均稼働時間8〜15時間）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>購入した車両（リース車両でない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新車で調達した車両（中古車で調達していない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新規登録から5年以内（新規登録から5年超経過していない）を優先</span>
                </li>
              </ul>

              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-lg">○</span>
                車格は、小型車、中型車、大型車、トレーラのいずれでも構いません。
              </h4>

              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-amber-700">※</span>{" "}
                  上記の車両選定の基準に当てはまらない車両を保有する場合でも、ご回答ください。
                </p>
                <p className="text-sm text-slate-600 mt-2 pl-4">
                  （例）新規登録から8年経過後、中古で取得した車両が最も稼働率が高く、新車調達車両がない場合
                  <br />
                  <span className="pl-4">→ この車両をご回答いただいて差支えありません。</span>
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}

        {/* 結果表示: 2〜9営業所 ① ドライバン等だけを保有 */}
        {branchCount === "2-9" && vehicleType === "dryvan_only" && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                ご協力をお願いしたい車両
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              {/* 主要な指示 */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    車両を配置している全ての営業所を調査対象としてください。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    回答数は、「車両配置する営業所数 ≦ 回答車両数」となります。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">◎</span>
                  <p className="text-slate-900 font-medium">
                    各営業所単位で、ご判断ください。
                  </p>
                </div>
              </div>

              {/* 強調メッセージ（赤字） */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <p className="text-red-600 font-bold text-lg">
                  ドライバン等について1台ご回答ください。
                </p>
              </div>

              {/* 例示 */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">
                  【例示1】3営業所において、それぞれドライバン等を保有している
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">東京営業所：</span>
                    <span>ドライバン5両保有</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ドライバン1両を回答</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">長野営業所：</span>
                    <span>ドライバン5両保有</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">ドライバン1両を回答</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700 min-w-[100px]">石川営業所：</span>
                    <span>平ボディ5両保有</span>
                    <span className="text-blue-600 mx-2">→</span>
                    <span className="font-medium">平ボディ1両を回答</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-3">
                    <span className="font-bold text-blue-800">合計3両を記入</span>
                  </div>
                </div>
              </div>

              {/* ドライバン等の定義 */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">ドライバン等：</span>
                <span className="text-slate-600">{DRYVAN_LIST.join("、")}</span>
              </div>
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  2〜9営業所
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  ドライバン等だけを保有
                </span>
              </div>
            </div>

            {/* 車両選定の優先基準 */}
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="text-lg">○</span>
                車両選定の優先基準
                <span className="text-sm font-normal text-amber-600">
                  ・・・全て該当しなくても問題ありません
                </span>
              </h4>
              <ul className="space-y-2 text-amber-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>最も稼働率の高い車両を優先（1日当たり平均稼働時間8〜15時間）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>購入した車両（リース車両でない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新車で調達した車両（中古車で調達していない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新規登録から5年以内（新規登録から5年超経過していない）を優先</span>
                </li>
              </ul>

              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-lg">○</span>
                車格は、小型車、中型車、大型車、トレーラのいずれでも構いません。
              </h4>

              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-amber-700">※</span>{" "}
                  上記の車両選定の基準に当てはまらない車両を保有する場合でも、ご回答ください。
                </p>
                <p className="text-sm text-slate-600 mt-2 pl-4">
                  （例）新規登録から8年経過後、中古で取得した車両が最も稼働率が高く、新車調達車両がない場合
                  <br />
                  <span className="pl-4">→ この車両をご回答いただいて差支えありません。</span>
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}

        {/* 結果表示 */}
        {branchCount === "1" && vehicleType && (
          <section
            ref={resultRef}
            className="bg-green-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">
                ご協力をお願いしたい車両
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              {/* 強調メッセージ（赤字） */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <p className="text-red-600 font-bold text-lg">
                  {vehicleType === "dryvan_only" && "ドライバン等を1両以上、ご回答ください。可能であれば、最大積載量が異なる車両をお持ちの場合、ご入力ください。"}
                  {vehicleType === "special_only" && "該当する特殊車両を1両以上、ご回答ください。例：海上コンテナ輸送車、重量物輸送車を保有する場合、各1台以上、合計2台以上をご回答ください。"}
                  {vehicleType === "both" && "ドライバン等を1台以上、該当する特殊車両を1台以上ご記入ください。"}
                  {vehicleType === "none" && "ドライバン等、特殊車両以外の車両についてご回答ください。"}
                </p>
              </div>

              {/* 該当する車両タイプの詳細 */}
              {(vehicleType === "dryvan_only" || vehicleType === "both") && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-800">ドライバン等：</span>
                  <span className="text-blue-700">{DRYVAN_LIST.join("、")}</span>
                </div>
              )}
              {(vehicleType === "special_only" || vehicleType === "both") && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <span className="font-medium text-purple-800">特殊車両：</span>
                  <span className="text-purple-700">{SPECIAL_VEHICLE_LIST.join("、")}</span>
                </div>
              )}
            </div>

            {/* 回答選択サマリー */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-slate-700 mb-2">あなたの選択</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  1営業所
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {vehicleType === "dryvan_only" && "ドライバン等だけを保有"}
                  {vehicleType === "special_only" && "特殊車両だけを保有"}
                  {vehicleType === "both" && "ドライバン等と特殊車両を保有"}
                  {vehicleType === "none" && "ドライバン等・特殊車両がない"}
                </span>
              </div>
            </div>

            {/* 車両選定の優先基準 */}
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="text-lg">○</span>
                車両選定の優先基準
                <span className="text-sm font-normal text-amber-600">
                  ・・・全て該当しなくても問題ありません
                </span>
              </h4>
              <ul className="space-y-2 text-amber-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>最も稼働率の高い車両を優先（1日当たり平均稼働時間8〜15時間）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>購入した車両（リース車両でない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新車で調達した車両（中古車で調達していない）を優先</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>新規登録から5年以内（新規登録から5年超経過していない）を優先</span>
                </li>
              </ul>

              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-lg">○</span>
                車格は、小型車、中型車、大型車、トレーラのいずれでも構いません。
              </h4>

              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-amber-700">※</span>{" "}
                  上記の車両選定の基準に当てはまらない車両を保有する場合でも、ご回答ください。
                </p>
                <p className="text-sm text-slate-600 mt-2 pl-4">
                  （例）新規登録から8年経過後、中古で取得した車両が最も稼働率が高く、新車調達車両がない場合
                  <br />
                  <span className="pl-4">→ この車両をご回答いただいて差支えありません。</span>
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                調査回答用エクセルファイルをダウンロード
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                調査ダッシュボードに戻る
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
