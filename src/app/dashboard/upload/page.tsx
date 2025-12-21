"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Trash2,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="w-5 h-5 text-purple-500" />;
  }
  if (mimeType === "application/pdf") {
    return <FileText className="w-5 h-5 text-red-500" />;
  }
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
  }
  return <File className="w-5 h-5 text-slate-500" />;
}

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const fetchFiles = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("uploaded_files")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
    } else {
      setFiles(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      await fetchFiles(user.id);
      setLoading(false);
    };
    getUser();
  }, [supabase, router, fetchFiles]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    if (!user) return;

    setError(null);
    setSuccess(null);

    const file = fileList[0];

    // バリデーション
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("対応していないファイル形式です。PDF、Excel、画像ファイルをアップロードしてください。");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("ファイルサイズが500MBを超えています。");
      return;
    }

    setUploading(true);
    setUploadProgress("アップロード中...");

    try {
      // ファイルパスを生成
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${user.id}/${timestamp}_${sanitizedFileName}`;

      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("survey-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress("メタデータを保存中...");

      // メタデータをDBに保存
      const { error: dbError } = await supabase
        .from("uploaded_files")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        });

      if (dbError) {
        // DBエラーの場合、アップロードしたファイルを削除
        await supabase.storage.from("survey-documents").remove([filePath]);
        throw dbError;
      }

      setSuccess(`「${file.name}」をアップロードしました。`);
      await fetchFiles(user.id);
    } catch (err) {
      console.error("Upload error:", err);
      setError("アップロードに失敗しました。もう一度お試しください。");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!user) return;
    if (!confirm(`「${file.file_name}」を削除しますか？`)) return;

    setDeletingId(file.id);
    setError(null);

    try {
      // Storageから削除
      const { error: storageError } = await supabase.storage
        .from("survey-documents")
        .remove([file.file_path]);

      if (storageError) {
        throw storageError;
      }

      // DBから削除
      const { error: dbError } = await supabase
        .from("uploaded_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        throw dbError;
      }

      setSuccess(`「${file.file_name}」を削除しました。`);
      await fetchFiles(user.id);
    } catch (err) {
      console.error("Delete error:", err);
      setError("削除に失敗しました。");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("survey-documents")
        .download(file.file_path);

      if (error) {
        throw error;
      }

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("ダウンロードに失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-400 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードへ戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            資料アップロード
          </h1>
          <p className="text-slate-600 mt-2">
            調査に関連する資料をアップロードしてください（PDF、Excel、画像ファイル、最大500MB）
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-red-700">{error}</div>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5 text-red-400 hover:text-red-600" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-green-700">{success}</div>
            <button onClick={() => setSuccess(null)}>
              <X className="w-5 h-5 text-green-400 hover:text-green-600" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`mb-8 border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-white hover:border-slate-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-600">{uploadProgress}</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-2">
                ファイルをドラッグ＆ドロップ
              </p>
              <p className="text-slate-500 text-sm mb-4">または</p>
              <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                ファイルを選択
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileInput}
                />
              </label>
              <p className="text-slate-400 text-xs mt-4">
                対応形式: PDF, Excel, Word, 画像 (JPEG, PNG, GIF, WebP)
              </p>
            </>
          )}
        </div>

        {/* File List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              アップロード済みファイル
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>まだファイルがアップロードされていません</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium truncate">
                      {file.file_name}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {formatFileSize(file.file_size)} ・{" "}
                      {new Date(file.uploaded_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ダウンロード"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      disabled={deletingId === file.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="削除"
                    >
                      {deletingId === file.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
