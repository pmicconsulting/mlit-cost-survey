"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Loader2 } from "lucide-react";

// Supabaseエラーメッセージを日本語に変換
function translateAuthError(message: string): string {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません。",
    "Email not confirmed": "メールアドレスの確認が完了していません。確認メールをご確認ください。",
    "Too many requests": "リクエストが多すぎます。しばらく時間をおいてから再度お試しください。",
    "User not found": "このメールアドレスは登録されていません。",
    "Invalid email": "有効なメールアドレスを入力してください。",
    "Signups not allowed": "現在新規登録を受け付けておりません。",
  };

  // 完全一致でチェック
  if (errorMessages[message]) {
    return errorMessages[message];
  }

  // 部分一致でチェック
  for (const [key, value] of Object.entries(errorMessages)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return `ログインに失敗しました: ${message}`;
}

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          ログイン
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="text-right mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                パスワードを忘れた方
              </Link>
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
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
