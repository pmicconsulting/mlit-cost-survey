"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  LogIn,
  User,
  HelpCircle,
  Download,
  PlayCircle,
  Mail,
  Bot,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">
                国土交通省
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/download"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                資料ダウンロード
              </Link>
              <Link
                href="/qa"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                よくある質問
              </Link>
              <Link
                href="/video"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                動画解説
              </Link>
              {!loading && (
                <>
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      ダッシュボード
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        サインアップ
                      </Link>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        ログイン
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
            {/* Mobile menu button */}
            <div className="md:hidden">
              {!loading && (
                <>
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                適正原価に関する
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  実態調査
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                一般貨物自動車運送事業における適正原価の実態を調査し、
                持続可能な運送事業の発展に寄与するための調査にご協力ください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    ダッシュボードへ
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    <LogIn className="w-5 h-5" />
                    ログイン
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Right: Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {!loading && (
                <>
                  {user ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        ログイン中
                      </h2>
                      <p className="text-slate-600 mb-6">{user.email}</p>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        ダッシュボードへ
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClipboardCheck className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                        調査への参加方法
                      </h2>
                      <ul className="space-y-4 mt-6">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          <span className="text-slate-600">「実態調査の回答を開始」をクリック</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          <span className="text-slate-600">事業者情報・ログイン情報を登録</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                          <span className="text-slate-600">ダッシュボードから調査に回答</span>
                        </li>
                      </ul>
                      <Link
                        href="/register"
                        className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-center shadow-lg shadow-green-500/30"
                      >
                        <ClipboardCheck className="w-5 h-5" />
                        <span className="leading-tight">
                          実態調査の回答を開始
                          <br />
                          <span className="text-sm font-normal">（サインアップ）</span>
                        </span>
                      </Link>
                    </div>
                  )}
                </>
              )}
              {loading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 h-96 flex items-center justify-center">
                  <div className="animate-pulse text-slate-400">
                    読み込み中...
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <Link href="/qa">
              <div className="group bg-orange-50 border border-orange-100 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  よくあるご質問
                </h3>
                <p className="text-slate-600 text-sm">
                  調査やシステムについてのQ&A
                </p>
              </div>
            </Link>
            <Link href="/download">
              <div className="group bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer text-center">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Download className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  調査回答用エクセルファイル
                  <br />
                  ダウンロード
                </h3>
                <p className="text-slate-600 text-sm">
                  調査票の記入例やテンプレート
                </p>
              </div>
            </Link>
            <Link href="/video">
              <div className="group bg-purple-50 border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  動画解説
                </h3>
                <p className="text-slate-600 text-sm">
                  調査の目的や回答方法を解説
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & AI Consultant Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Consultant */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                調査に関するAI相談員
              </h2>
              <p className="text-slate-600 mb-6">
                調査についてAIがお答えします。お気軽にご質問ください
              </p>
              <Link
                href="/ai-consultant"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Bot className="w-5 h-5" />
                AI相談員に質問する
              </Link>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                お問い合わせ
              </h2>
              <p className="text-slate-600 mb-6">
                個別のご質問やご不明な点はこちらからお問い合わせください
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                お問い合わせフォームへ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">国土交通省</span>
              </div>
              <p className="text-sm">
                一般貨物自動車運送事業 適正原価に関する実態調査
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">リンク</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/qa" className="hover:text-white transition-colors">よくある質問</Link></li>
                <li><Link href="/download" className="hover:text-white transition-colors">資料ダウンロード</Link></li>
                <li><Link href="/video" className="hover:text-white transition-colors">動画解説</Link></li>
                <li><Link href="/ai-consultant" className="hover:text-white transition-colors">AI相談員</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">お問い合わせ</h4>
              <p className="text-sm">
                ご不明な点がございましたら、
                <br />
                <Link href="/contact" className="text-blue-400 hover:text-blue-300">お問い合わせフォーム</Link>よりご連絡ください。
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2025 Ministry of Land, Infrastructure, Transport and Tourism.
            All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
