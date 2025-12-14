"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Download,
  FileSpreadsheet,
  ArrowLeft,
  CheckSquare,
  Square,
  Package,
  Loader2,
} from "lucide-react";

interface DownloadFile {
  id: string;
  name: string;
  description: string;
  filename: string;
  size: string;
}

const downloadFiles: DownloadFile[] = [
  {
    id: "sample",
    name: "調査票記入例",
    description: "調査票の記入方法のサンプルです。回答の参考にしてください。",
    filename: "survey_sample.xlsx",
    size: "245 KB",
  },
  {
    id: "cost_calc",
    name: "原価計算シート",
    description: "原価計算の補助シートです。各項目の計算にご活用ください。",
    filename: "cost_calculation.xlsx",
    size: "180 KB",
  },
  {
    id: "template",
    name: "調査票テンプレート",
    description: "調査回答用のテンプレートです。オフラインで作成する場合にご利用ください。",
    filename: "survey_template.xlsx",
    size: "120 KB",
  },
  {
    id: "guide",
    name: "調査ガイドライン",
    description: "調査の目的、回答方法、注意事項をまとめた資料です。",
    filename: "survey_guide.xlsx",
    size: "310 KB",
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
    // 個別ファイルダウンロード
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
            <Link href="/" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">国土交通省</span>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Download className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            資料ダウンロード
          </h1>
          <p className="text-slate-600">
            調査に必要な資料をダウンロードできます
          </p>
        </div>

        {/* Bulk Download Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
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
        <div className="space-y-4">
          {downloadFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleFile(file.id)}
                  className="mt-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {selectedFiles.includes(file.id) ? (
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {file.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    {file.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{file.filename}</span>
                    <span>{file.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSingleDownload(file)}
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            ご利用にあたって
          </h2>
          <ul className="space-y-2 text-slate-600">
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
                ファイルが開けない場合は、Microsoft
                Excelまたは互換ソフトウェアをご利用ください。
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
