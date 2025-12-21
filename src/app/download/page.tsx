"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  FileSpreadsheet,
  ArrowLeft,
  CheckSquare,
  Square,
  Package,
  Loader2,
  Truck,
} from "lucide-react";

interface DownloadFile {
  id: string;
  name: string;
  description: string;
  filename: string;
}

const downloadFiles: DownloadFile[] = [
  {
    id: "van",
    name: "バンタイプ等の車両",
    description: "一般的なバン型トラック向け調査票",
    filename: "survey_van.zip",
  },
  {
    id: "refrigerator",
    name: "冷蔵車・冷凍車",
    description: "冷蔵・冷凍設備付き車両向け調査票",
    filename: "survey_refrigerator.zip",
  },
  {
    id: "dump",
    name: "ダンプ車",
    description: "ダンプトラック向け調査票",
    filename: "survey_dump.zip",
  },
  {
    id: "tank",
    name: "タンク車",
    description: "タンクローリー向け調査票",
    filename: "survey_tank.zip",
  },
  {
    id: "bulk",
    name: "バルク車",
    description: "粉粒体運搬車向け調査票",
    filename: "survey_bulk.zip",
  },
  {
    id: "container",
    name: "コンテナ輸送車",
    description: "コンテナ輸送用車両向け調査票",
    filename: "survey_container.zip",
  },
  {
    id: "mixer",
    name: "コンクリートミキサー車",
    description: "生コンミキサー車向け調査票",
    filename: "survey_mixer.zip",
  },
  {
    id: "crane",
    name: "トラック搭載型クレーン車",
    description: "ユニック車等クレーン付き車両向け調査票",
    filename: "survey_crane.zip",
  },
  {
    id: "hearse",
    name: "霊柩車",
    description: "霊柩運送事業向け調査票",
    filename: "survey_hearse.zip",
  },
  {
    id: "waste",
    name: "一般廃棄物輸送車（塵芥車、衛生車等）",
    description: "ごみ収集車・衛生車向け調査票",
    filename: "survey_waste.zip",
  },
  {
    id: "carrier",
    name: "車積載車（キャリアカー）",
    description: "自動車運搬車向け調査票",
    filename: "survey_carrier.zip",
  },
  {
    id: "heavy",
    name: "重量物輸送車",
    description: "重量物・特殊貨物運搬車向け調査票",
    filename: "survey_heavy.zip",
  },
];

export default function DownloadPage() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedFiles.length === downloadFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(downloadFiles.map((f) => f.id));
    }
  };

  const handleSingleDownload = (file: DownloadFile) => {
    const link = document.createElement("a");
    link.href = `/downloads/${file.filename}`;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) return;

    setIsDownloading(true);
    try {
      const filenames = selectedFiles.map(
        (id) => downloadFiles.find((f) => f.id === id)?.filename
      ).filter(Boolean);

      const response = await fetch("/api/download-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: filenames }),
      });

      if (!response.ok) {
        throw new Error("ダウンロードに失敗しました");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mlit_survey_files.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ダウンロードエラー:", error);
      alert("ダウンロードに失敗しました。もう一度お試しください。");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Download className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            調査回答用エクセルファイル
            <br />
            ダウンロード
          </h1>
          <p className="text-slate-600">
            車両タイプ別の調査票をダウンロードできます
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-8">
          <div className="flex items-start gap-3">
            <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                ダウンロード内容について
              </h2>
              <p className="text-slate-600">
                各ファイルには<strong>調査入力用エクセルファイル</strong>と<strong>記載要領</strong>がセットで含まれています。
                該当する車両タイプのファイルをダウンロードしてご利用ください。
              </p>
            </div>
          </div>
        </div>

        {/* Bulk Download Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={toggleAll}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              {selectedFiles.length === downloadFiles.length ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="font-medium">すべて選択</span>
            </button>
            <button
              onClick={handleBulkDownload}
              disabled={selectedFiles.length === 0 || isDownloading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ダウンロード中...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  選択したファイルをダウンロード（ZIP）
                  {selectedFiles.length > 0 && (
                    <span className="bg-green-500 px-2 py-0.5 rounded-full text-sm">
                      {selectedFiles.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-3">
          {downloadFiles.map((file, index) => (
            <div
              key={file.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleFile(file.id)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {selectedFiles.includes(file.id) ? (
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-bold text-slate-900">
                      {file.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {file.description}
                  </p>
                </div>
                <button
                  onClick={() => handleSingleDownload(file)}
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            ご利用にあたって
          </h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                各ZIPファイルには調査入力用エクセルファイルと記載要領が含まれています。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                ダウンロードした資料は、本調査への回答目的でのみご利用ください。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                資料の内容に関するご質問は、
                <Link href="/qa" className="text-blue-600 hover:underline">
                  よくあるご質問
                </Link>
                をご確認ください。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                ファイルが開けない場合は、Microsoft Excelまたは互換ソフトウェアをご利用ください。
              </span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
