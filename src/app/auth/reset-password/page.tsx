"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // URLハッシュからトークンを取得してセッションを確立
    const handleRecovery = async () => {
      try {
        // Supabaseがハッシュからセッションを自動的に処理
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setError("パスワードリセットリンクが無効または期限切れです。");
          setChecking(false);
          return;
        }

        if (data.session) {
          setValidSession(true);
        } else {
          // ハッシュにトークンがある場合は待機
          const hash = window.location.hash;
          if (hash && hash.includes("access_token")) {
            // Supabaseがトークンを処理するのを待つ
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
              async (event, session) => {
                if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                  setValidSession(true);
                  setChecking(false);
                } else if (event === "SIGNED_OUT") {
                  setError("パスワードリセットリンクが無効または期限切れです。");
                  setChecking(false);
                }
              }
            );

            // タイムアウト設定
            setTimeout(() => {
              if (checking) {
                subscription.unsubscribe();
                setError("パスワードリセットリンクが無効または期限切れです。再度リセットをお試しください。");
                setChecking(false);
              }
            }, 5000);
            return;
          } else {
            setError("パスワードリセットリンクが見つかりません。メールのリンクから再度アクセスしてください。");
          }
        }
      } catch (err) {
        console.error("Recovery error:", err);
        setError("エラーが発生しました。再度お試しください。");
      }
      setChecking(false);
    };

    handleRecovery();
  }, [supabase, checking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません。");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      // エラーメッセージを日本語化
      if (error.message.includes("same as your old password")) {
        setError("新しいパスワードは現在のパスワードと異なるものにしてください。");
      } else if (error.message.includes("at least 6 characters")) {
        setError("パスワードは6文字以上で入力してください。");
      } else if (error.message.includes("session")) {
        setError("セッションが無効です。再度パスワードリセットをお試しください。");
      } else {
        setError(`パスワードの更新に失敗しました: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // 3秒後にログインページへリダイレクト
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  };

  // ローディング中
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-lg text-slate-800">
                  国土交通省
                </span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-600 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            確認中...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">
                国土交通省
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            {success ? (
              // 完了画面
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  パスワードを変更しました
                </h2>
                <p className="text-slate-600 mb-6">
                  新しいパスワードが設定されました。
                  自動的にログイン画面へ移動します。
                </p>
                <div className="text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  リダイレクト中...
                </div>
              </div>
            ) : !validSession ? (
              // エラー画面（無効なリンク）
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  リンクが無効です
                </h2>
                <p className="text-slate-600 mb-6">
                  {error || "パスワードリセットリンクが無効または期限切れです。"}
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  再度パスワードリセットを申請
                </Link>
              </div>
            ) : (
              // パスワード入力画面
              <>
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  新しいパスワードを設定
                </h2>
                <p className="text-slate-600 text-center mb-6">
                  新しいパスワードを入力してください。
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      新しいパスワード
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6文字以上"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      6文字以上で入力してください
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="passwordConfirm"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      新しいパスワード（確認）
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="passwordConfirm"
                        type={showPasswordConfirm ? "text" : "password"}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="パスワードを再入力"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswordConfirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        変更中...
                      </>
                    ) : (
                      "パスワードを変更"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © 2025 Ministry of Land, Infrastructure, Transport and Tourism. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
