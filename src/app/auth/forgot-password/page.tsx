"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

type Step = "email" | "otp" | "newPassword" | "complete";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ステップ1: メールアドレス送信
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください。");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      if (error.message.includes("rate limit")) {
        setError("リクエストが多すぎます。しばらく時間をおいてから再度お試しください。");
      } else {
        setError("メールの送信に失敗しました。メールアドレスをご確認ください。");
      }
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  };

  // ステップ2: OTPコード検証
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (otp.length !== 6) {
      setError("6桁の認証コードを入力してください。");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (error) {
      if (error.message.includes("expired")) {
        setError("認証コードの有効期限が切れています。再度お試しください。");
      } else if (error.message.includes("invalid")) {
        setError("認証コードが正しくありません。");
      } else {
        setError("認証に失敗しました。コードをご確認ください。");
      }
      setLoading(false);
      return;
    }

    setStep("newPassword");
    setLoading(false);
  };

  // ステップ3: 新パスワード設定
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      if (error.message.includes("same as your old password")) {
        setError("新しいパスワードは現在のパスワードと異なるものにしてください。");
      } else {
        setError(`パスワードの更新に失敗しました: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    // ログアウトしてセッションをクリア
    await supabase.auth.signOut();
    setStep("complete");
    setLoading(false);
  };

  // OTP再送信
  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError("再送信に失敗しました。しばらく時間をおいてから再度お試しください。");
    } else {
      setError(null);
      alert("認証コードを再送信しました。メールをご確認ください。");
    }
    setLoading(false);
  };

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

            {/* ステップ1: メールアドレス入力 */}
            {step === "email" && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  パスワードをリセット
                </h2>
                <p className="text-slate-600 text-center mb-6">
                  登録済みのメールアドレスを入力してください。
                  認証コードをメールで送信します。
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      メールアドレス
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
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
                        送信中...
                      </>
                    ) : (
                      "認証コードを送信"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    ログイン画面に戻る
                  </Link>
                </div>
              </>
            )}

            {/* ステップ2: 認証コード入力 */}
            {step === "otp" && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  認証コードを入力
                </h2>
                <p className="text-slate-600 text-center mb-6">
                  <strong className="text-slate-800">{email}</strong> 宛てに
                  送信した6桁の認証コードを入力してください。
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      認証コード（6桁）
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      required
                      maxLength={6}
                      autoComplete="one-time-code"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        確認中...
                      </>
                    ) : (
                      "認証コードを確認"
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    認証コードを再送信
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError(null);
                    }}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    メールアドレスを変更
                  </button>
                </div>
              </>
            )}

            {/* ステップ3: 新パスワード入力 */}
            {step === "newPassword" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  新しいパスワードを設定
                </h2>
                <p className="text-slate-600 text-center mb-6">
                  認証が完了しました。新しいパスワードを入力してください。
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSetPassword} className="space-y-4">
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

            {/* ステップ4: 完了 */}
            {step === "complete" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  パスワードを変更しました
                </h2>
                <p className="text-slate-600 mb-6">
                  新しいパスワードが設定されました。
                  ログイン画面からログインしてください。
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  ログイン画面へ
                </Link>
              </div>
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
